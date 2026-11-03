import html
import hashlib
import hmac
import json
import os
import re
import unicodedata
import uuid
from datetime import datetime, timedelta, timezone
from typing import Annotated

import bleach
import markdown
from fastapi import APIRouter, HTTPException, Request, Response
from fastapi.responses import HTMLResponse, JSONResponse
from fastmcp import FastMCP
from fastmcp.server.auth import AccessToken
from fastmcp.server.auth.providers.supabase import SupabaseProvider
from fastmcp.server.dependencies import get_access_token
from sqlalchemy import (
    Boolean,
    DateTime,
    ForeignKey,
    Integer,
    String,
    Text,
    UniqueConstraint,
    create_engine,
    delete,
    func,
    inspect,
    select,
    text,
    update,
)
from sqlalchemy.orm import DeclarativeBase, Mapped, mapped_column, sessionmaker


SITE_URL = "https://ibnalrefai.club"
DATABASE_URL = os.getenv("DATABASE_URL")
if DATABASE_URL and DATABASE_URL.startswith("postgres://"):
    DATABASE_URL = DATABASE_URL.replace("postgres://", "postgresql+psycopg://", 1)
elif DATABASE_URL and DATABASE_URL.startswith("postgresql://"):
    DATABASE_URL = DATABASE_URL.replace("postgresql://", "postgresql+psycopg://", 1)

engine = (
    create_engine(
        DATABASE_URL,
        pool_pre_ping=True,
        pool_size=1,
        max_overflow=0,
        pool_recycle=300,
        connect_args={"prepare_threshold": None},
    )
    if DATABASE_URL
    else None
)
SessionLocal = sessionmaker(bind=engine, expire_on_commit=False) if engine else None
router = APIRouter()
BASE_URL = os.getenv("BASE_URL", "https://www.ibnalrefai.club").rstrip("/")
SUPABASE_PROJECT_URL = os.getenv("SUPABASE_PROJECT_URL", "").rstrip("/")
SUPABASE_JWT_ALGORITHM = os.getenv("SUPABASE_JWT_ALGORITHM", "ES256")
BLOG_OWNER_USER_ID = os.getenv("BLOG_OWNER_USER_ID", "")
SUPABASE_ALLOWED_OAUTH_CLIENT_IDS = {
    client_id.strip()
    for client_id in os.getenv("SUPABASE_ALLOWED_OAUTH_CLIENT_IDS", "").split(",")
    if client_id.strip()
}


class AllowlistedSupabaseProvider(SupabaseProvider):
    async def verify_token(self, token: str) -> AccessToken | None:
        access_token = await super().verify_token(token)
        if access_token is None:
            return None
        client_id = access_token.claims.get("client_id") or access_token.claims.get(
            "azp"
        )
        if (
            not isinstance(client_id, str)
            or client_id not in SUPABASE_ALLOWED_OAUTH_CLIENT_IDS
        ):
            return None
        return access_token


auth_provider = (
    AllowlistedSupabaseProvider(
        project_url=SUPABASE_PROJECT_URL,
        base_url=BASE_URL,
        algorithm=SUPABASE_JWT_ALGORITHM,
    )
    if SUPABASE_PROJECT_URL and SUPABASE_ALLOWED_OAUTH_CLIENT_IDS
    else None
)
mcp = FastMCP("Ahmed Elrefai Blog", auth=auth_provider)


class Base(DeclarativeBase):
    pass


class BlogPost(Base):
    __tablename__ = "blog_posts"

    id: Mapped[int] = mapped_column(Integer, primary_key=True)
    slug: Mapped[str] = mapped_column(String(220), unique=True, index=True)
    title: Mapped[str] = mapped_column(String(180))
    summary: Mapped[str] = mapped_column(String(320), default="")
    meta_description: Mapped[str] = mapped_column(String(320), default="")
    content_markdown: Mapped[str] = mapped_column(Text)
    language: Mapped[str] = mapped_column(String(5), default="ar")
    is_published: Mapped[bool] = mapped_column(Boolean, default=False, index=True)
    created_at: Mapped[datetime] = mapped_column(
        DateTime(timezone=True), default=lambda: datetime.now(timezone.utc)
    )
    updated_at: Mapped[datetime] = mapped_column(
        DateTime(timezone=True),
        default=lambda: datetime.now(timezone.utc),
        onupdate=lambda: datetime.now(timezone.utc),
    )
    published_at: Mapped[datetime | None] = mapped_column(DateTime(timezone=True))
    view_count: Mapped[int] = mapped_column(Integer, default=0, nullable=False)
    like_count: Mapped[int] = mapped_column(Integer, default=0, nullable=False)


class BlogView(Base):
    __tablename__ = "blog_views"
    __table_args__ = (
        UniqueConstraint("post_id", "visitor_hash", name="uq_blog_views_post_visitor"),
    )

    id: Mapped[int] = mapped_column(Integer, primary_key=True)
    post_id: Mapped[int] = mapped_column(ForeignKey("blog_posts.id", ondelete="CASCADE"))
    visitor_hash: Mapped[str] = mapped_column(String(64))
    last_viewed_at: Mapped[datetime] = mapped_column(DateTime(timezone=True))


class BlogLike(Base):
    __tablename__ = "blog_likes"
    __table_args__ = (
        UniqueConstraint("post_id", "visitor_hash", name="uq_blog_likes_post_visitor"),
    )

    id: Mapped[int] = mapped_column(Integer, primary_key=True)
    post_id: Mapped[int] = mapped_column(ForeignKey("blog_posts.id", ondelete="CASCADE"))
    visitor_hash: Mapped[str] = mapped_column(String(64))
    created_at: Mapped[datetime] = mapped_column(
        DateTime(timezone=True), default=lambda: datetime.now(timezone.utc)
    )


def initialize_database() -> None:
    if engine is None:
        return
    Base.metadata.create_all(bind=engine)
    columns = {column["name"] for column in inspect(engine).get_columns("blog_posts")}
    with engine.begin() as connection:
        for column in ("view_count", "like_count"):
            if column not in columns:
                connection.execute(
                    text(
                        f"ALTER TABLE blog_posts ADD COLUMN "
                        f"{'IF NOT EXISTS ' if engine.dialect.name == 'postgresql' else ''}{column} "
                        "INTEGER NOT NULL DEFAULT 0"
                    )
                )


def _session():
    if SessionLocal is None:
        raise HTTPException(
            status_code=503,
            detail="Blog database is not configured; set DATABASE_URL to a PostgreSQL connection string.",
        )
    return SessionLocal()


def _visitor_identity(
    request: Request, *, required: bool = True
) -> tuple[str | None, str | None, bool]:
    secret = os.getenv("BLOG_ANALYTICS_SECRET")
    if not secret or len(secret) < 32:
        if not required:
            return None, None, False
        raise HTTPException(
            status_code=503,
            detail="Set BLOG_ANALYTICS_SECRET to a secret of at least 32 characters to enable blog interactions.",
        )
    signing_key = hmac.new(
        secret.encode("utf-8"),
        b"ibnalrefai-blog-visitor-cookie-v1",
        hashlib.sha256,
    ).digest()
    cookie = request.cookies.get("blog_visitor", "")
    visitor_id, separator, signature = cookie.partition(".")
    valid = bool(
        separator
        and re.fullmatch(r"[0-9a-f]{32}", visitor_id)
        and hmac.compare_digest(
            signature,
            hmac.new(signing_key, visitor_id.encode("ascii"), hashlib.sha256).hexdigest(),
        )
    )
    if not valid:
        visitor_id = uuid.uuid4().hex
        signature = hmac.new(
            signing_key, visitor_id.encode("ascii"), hashlib.sha256
        ).hexdigest()
    visitor_hash = hashlib.sha256(visitor_id.encode("ascii")).hexdigest()
    return visitor_hash, f"{visitor_id}.{signature}", not valid


def _set_visitor_cookie(response: Response, request: Request, cookie: str) -> None:
    response.set_cookie(
        "blog_visitor",
        cookie,
        max_age=60 * 60 * 24 * 365,
        httponly=True,
        secure=request.url.scheme == "https",
        samesite="lax",
        path="/",
    )


def _insert_once(session, model, values: dict, constraint: str, where=None) -> bool:
    dialect = session.get_bind().dialect.name
    if dialect == "postgresql":
        from sqlalchemy.dialects.postgresql import insert
        conflict_target = {"constraint": constraint}
    elif dialect == "sqlite":
        from sqlalchemy.dialects.sqlite import insert
        conflict_target = {
            "index_elements": [model.post_id, model.visitor_hash]
        }
    else:
        raise HTTPException(
            status_code=500,
            detail=f"Blog interaction storage does not support database dialect '{dialect}'.",
        )
    statement = insert(model).values(**values).on_conflict_do_nothing(
        **conflict_target
    )
    if where is not None:
        statement = insert(model).values(**values).on_conflict_do_update(
            **conflict_target,
            set_={"last_viewed_at": values["last_viewed_at"]},
            where=where,
        )
    return session.execute(statement.returning(model.id)).scalar_one_or_none() is not None


def _write_interaction_cookie(
    response: Response, request: Request, cookie: str | None, created: bool
) -> Response:
    if created and cookie:
        _set_visitor_cookie(response, request, cookie)
    return response


def _slugify(title: str) -> str:
    normalized = unicodedata.normalize("NFKC", title).casefold()
    slug = re.sub(r"[^\w]+", "-", normalized, flags=re.UNICODE).strip("-_")
    return slug[:200].strip("-_") or "post"


def _content_html(content: str) -> str:
    rendered = markdown.markdown(
        content,
        extensions=["fenced_code", "tables"],
        output_format="html",
    )
    return bleach.clean(
        rendered,
        tags={
            "a", "blockquote", "br", "code", "del", "em", "h1", "h2", "h3",
            "h4", "hr", "li", "ol", "p", "pre", "strong", "table", "tbody",
            "td", "th", "thead", "tr", "ul",
        },
        attributes={"a": ["href", "title"], "code": ["class"]},
        protocols=["http", "https", "mailto"],
        strip=True,
    )


def _published_posts():
    with _session() as db:
        return list(
            db.scalars(
                select(BlogPost)
                .where(BlogPost.is_published.is_(True))
                .order_by(BlogPost.published_at.desc(), BlogPost.id.desc())
            )
        )


def _published_post_like_state(slug: str, visitor_hash: str) -> tuple[BlogPost, bool]:
    with _session() as db:
        post = db.scalar(
            select(BlogPost).where(
                BlogPost.slug == slug,
                BlogPost.is_published.is_(True),
            )
        )
        if post is None:
            raise HTTPException(status_code=404, detail="Blog post not found")
        liked = db.scalar(
            select(BlogLike.id).where(
                BlogLike.post_id == post.id,
                BlogLike.visitor_hash == visitor_hash,
            )
        ) is not None
        return post, liked


def _get_published_post(slug: str) -> BlogPost:
    with _session() as db:
        post = db.scalar(
            select(BlogPost).where(
                BlogPost.slug == slug,
                BlogPost.is_published.is_(True),
            )
        )
        if post is None:
            raise HTTPException(status_code=404, detail="Blog post not found")
        return post


def _date(value: datetime | None) -> str:
    if value is None:
        return ""
    return value.strftime("%Y-%m-%d")


def _meta_description(post: BlogPost) -> str:
    return post.meta_description or post.summary or post.title


def _json_ld(data: dict) -> str:
    return json.dumps(data, ensure_ascii=False).replace("<", "\\u003c")


def _document(
    title: str,
    description: str,
    canonical: str,
    body: str,
    schema: dict,
    language: str = "ar",
    og_type: str = "website",
) -> str:
    direction = "rtl" if language == "ar" else "ltr"
    home_label, blog_label = (
        ("الرئيسية", "المدونة") if language == "ar" else ("Home", "Blog")
    )
    safe_title = html.escape(title)
    safe_description = html.escape(description, quote=True)
    safe_canonical = html.escape(canonical, quote=True)
    return f"""<!doctype html>
<html lang="{html.escape(language)}" dir="{direction}">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <title>{safe_title}</title>
  <meta name="description" content="{safe_description}">
  <link rel="canonical" href="{safe_canonical}">
  <meta name="robots" content="index, follow">
  <meta property="og:type" content="{og_type}">
  <meta property="og:site_name" content="أحمد الرفاعي">
  <meta property="og:title" content="{safe_title}">
  <meta property="og:description" content="{safe_description}">
  <meta property="og:url" content="{safe_canonical}">
  <meta property="og:image" content="{SITE_URL}/refai_stats_card.webp">
  <meta name="twitter:card" content="summary_large_image">
  <link rel="preconnect" href="https://fonts.googleapis.com">
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
  <link href="https://fonts.googleapis.com/css2?family=Space+Grotesk:wght@400;500;700&family=Tajawal:wght@400;500;700;900&display=swap" rel="stylesheet">
  <script type="application/ld+json">{_json_ld(schema)}</script>
  <link rel="stylesheet" href="/blog.css">
</head>
<body>
  <header class="blog-header">
    <a class="brand" href="/">// أحمد الرفاعي</a>
    <nav aria-label="Main navigation"><a href="/">{home_label}</a><a href="/blog">{blog_label}</a></nav>
  </header>
  <main class="blog-main">{body}</main>
  <footer class="blog-footer"><a href="/">ibnalrefai.club</a></footer>
  <script src="/blog.js" defer></script>
</body>
</html>"""


@router.get("/blog", response_class=HTMLResponse, include_in_schema=False)
async def blog_index():
    posts = _published_posts()
    cards = []
    for post in posts:
        summary = post.summary or _meta_description(post)
        cards.append(
            f"""<article class="post-card">
  <p class="post-date"><time datetime="{_date(post.published_at)}">{_date(post.published_at)}</time></p>
  <h2><a href="/blog/{html.escape(post.slug, quote=True)}">{html.escape(post.title)}</a></h2>
  <p>{html.escape(summary)}</p>
  <p class="post-engagement"><span>👁 {post.view_count}</span><span>♥ {post.like_count}</span></p>
  <a class="read-more" href="/blog/{html.escape(post.slug, quote=True)}">اقرأ المقال ←</a>
</article>"""
        )
    content = "\n".join(cards) or '<p class="empty-state">لا توجد مقالات منشورة بعد. عُد قريباً!</p>'
    body = f"""<section class="blog-intro">
  <p class="eyebrow">BLOG // ARTICLES</p>
  <h1>المدونة</h1>
  <p>مقالات وأفكار عن البرمجة والذكاء الاصطناعي وبناء المنتجات.</p>
</section>
<section class="post-list" aria-label="المقالات">{content}</section>"""
    schema = {
        "@context": "https://schema.org",
        "@type": "Blog",
        "name": "مدونة أحمد الرفاعي",
        "url": f"{SITE_URL}/blog",
        "inLanguage": "ar",
    }
    return _document(
        "المدونة | أحمد الرفاعي",
        "مقالات أحمد الرفاعي عن البرمجة والذكاء الاصطناعي وبناء المنتجات.",
        f"{SITE_URL}/blog",
        body,
        schema,
        og_type="website",
    )


@router.get("/blog/{slug}", response_class=HTMLResponse, include_in_schema=False)
async def blog_detail(slug: str, request: Request):
    visitor_hash, visitor_cookie, new_cookie = _visitor_identity(
        request, required=False
    )
    if visitor_hash is None:
        post = _get_published_post(slug)
        liked = False
    else:
        post, liked = _published_post_like_state(slug, visitor_hash)
    canonical = f"{SITE_URL}/blog/{post.slug}"
    description = _meta_description(post)
    like_label = "أعجبني" if post.language == "ar" else "Like"
    unlike_label = "إلغاء الإعجاب" if post.language == "ar" else "Unlike"
    views_label = "مشاهدة" if post.language == "ar" else "views"
    likes_label = "إعجاب" if post.language == "ar" else "likes"
    like_state = "true" if liked else "false"
    liked_class = " is-liked" if liked else ""
    body = f"""<article class="blog-article">
  <nav class="breadcrumbs" aria-label="Breadcrumb"><a href="/">الرئيسية</a><span>/</span><a href="/blog">المدونة</a></nav>
  <header class="article-header">
    <p class="eyebrow">BLOG // ARTICLE</p>
    <h1>{html.escape(post.title)}</h1>
    <p class="post-date"><time datetime="{_date(post.published_at)}">{_date(post.published_at)}</time></p>
    <p class="article-summary">{html.escape(post.summary)}</p>
  </header>
  <div class="article-content">{_content_html(post.content_markdown)}</div>
  <section class="article-engagement" data-blog-post data-post-slug="{html.escape(post.slug, quote=True)}">
    <p class="view-count">👁 <span data-view-count>{post.view_count}</span> {views_label}</p>
    <div>
      <button class="like-button{liked_class}" type="button" data-like-button
        data-label-like="{like_label}" data-label-unlike="{unlike_label}" aria-pressed="{like_state}">
        <span data-like-label>{like_label}</span> <span aria-hidden="true">♥</span>
        <span data-like-count>{post.like_count}</span> <span class="like-count-label">{likes_label}</span>
      </button>
    </div>
    <p class="interaction-status" data-view-status role="status" aria-live="polite"></p>
    <p class="interaction-status" data-like-status role="status" aria-live="polite"></p>
  </section>
</article>"""
    schema = {
        "@context": "https://schema.org",
        "@type": "BlogPosting",
        "headline": post.title,
        "description": description,
        "datePublished": post.published_at.isoformat() if post.published_at else None,
        "dateModified": post.updated_at.isoformat() if post.updated_at else None,
        "mainEntityOfPage": canonical,
        "url": canonical,
        "inLanguage": post.language,
        "author": {"@type": "Person", "name": "Ahmed Elrefai", "url": SITE_URL},
        "publisher": {"@type": "Person", "name": "Ahmed Elrefai"},
    }
    response = HTMLResponse(
        _document(
            f"{post.title} | أحمد الرفاعي",
            description,
            canonical,
            body,
            schema,
            post.language,
            og_type="article",
        )
    )
    return _write_interaction_cookie(
        response, request, visitor_cookie, new_cookie
    )


@router.get("/api/blogs")
async def list_blog_posts():
    return [
        {
            "slug": post.slug,
            "title": post.title,
            "summary": post.summary,
            "language": post.language,
            "views": post.view_count,
            "likes": post.like_count,
            "published_at": post.published_at.isoformat() if post.published_at else None,
            "url": f"{SITE_URL}/blog/{post.slug}",
        }
        for post in _published_posts()
    ]


@router.get("/api/blogs/{slug}")
async def get_blog_post(slug: str):
    post = _get_published_post(slug)
    return {
        "slug": post.slug,
        "title": post.title,
        "summary": post.summary,
        "meta_description": _meta_description(post),
        "content_markdown": post.content_markdown,
        "language": post.language,
        "views": post.view_count,
        "likes": post.like_count,
        "published_at": post.published_at.isoformat() if post.published_at else None,
        "url": f"{SITE_URL}/blog/{post.slug}",
    }


@router.post("/api/blogs/{slug}/view")
async def record_blog_view(slug: str, request: Request):
    visitor_hash, visitor_cookie, new_cookie = _visitor_identity(request)
    now = datetime.now(timezone.utc)
    cutoff = now - timedelta(hours=24)
    with _session() as db:
        post = db.scalar(
            select(BlogPost).where(
                BlogPost.slug == slug,
                BlogPost.is_published.is_(True),
            )
        )
        if post is None:
            raise HTTPException(status_code=404, detail="Blog post not found")
        counted = _insert_once(
            db,
            BlogView,
            {
                "post_id": post.id,
                "visitor_hash": visitor_hash,
                "last_viewed_at": now,
            },
            "uq_blog_views_post_visitor",
            where=BlogView.last_viewed_at <= cutoff,
        )
        if counted:
            db.execute(
                update(BlogPost)
                .where(BlogPost.id == post.id)
                .values(view_count=BlogPost.view_count + 1)
            )
        db.commit()
        counts = db.execute(
            select(BlogPost.view_count, BlogPost.like_count).where(
                BlogPost.id == post.id
            )
        ).one()
    response = JSONResponse(
        {
            "views": counts.view_count,
            "likes": counts.like_count,
            "counted": counted,
        }
    )
    return _write_interaction_cookie(response, request, visitor_cookie, new_cookie)


@router.put("/api/blogs/{slug}/like")
async def like_blog_post(slug: str, request: Request):
    visitor_hash, visitor_cookie, new_cookie = _visitor_identity(request)
    now = datetime.now(timezone.utc)
    with _session() as db:
        post = db.scalar(
            select(BlogPost).where(
                BlogPost.slug == slug,
                BlogPost.is_published.is_(True),
            )
        )
        if post is None:
            raise HTTPException(status_code=404, detail="Blog post not found")
        added = _insert_once(
            db,
            BlogLike,
            {
                "post_id": post.id,
                "visitor_hash": visitor_hash,
                "created_at": now,
            },
            "uq_blog_likes_post_visitor",
        )
        if added:
            db.execute(
                update(BlogPost)
                .where(BlogPost.id == post.id)
                .values(like_count=BlogPost.like_count + 1)
            )
        db.commit()
        counts = db.execute(
            select(BlogPost.view_count, BlogPost.like_count).where(
                BlogPost.id == post.id
            )
        ).one()
    response = JSONResponse(
        {"views": counts.view_count, "likes": counts.like_count, "liked": True}
    )
    return _write_interaction_cookie(response, request, visitor_cookie, new_cookie)


@router.delete("/api/blogs/{slug}/like")
async def unlike_blog_post(slug: str, request: Request):
    visitor_hash, visitor_cookie, new_cookie = _visitor_identity(request)
    with _session() as db:
        post = db.scalar(
            select(BlogPost).where(
                BlogPost.slug == slug,
                BlogPost.is_published.is_(True),
            )
        )
        if post is None:
            raise HTTPException(status_code=404, detail="Blog post not found")
        removed = db.execute(
            delete(BlogLike)
            .where(
                BlogLike.post_id == post.id,
                BlogLike.visitor_hash == visitor_hash,
            )
            .returning(BlogLike.id)
        ).scalar_one_or_none() is not None
        if removed:
            db.execute(
                update(BlogPost)
                .where(BlogPost.id == post.id)
                .values(like_count=BlogPost.like_count - 1)
            )
        db.commit()
        counts = db.execute(
            select(BlogPost.view_count, BlogPost.like_count).where(
                BlogPost.id == post.id
            )
        ).one()
    response = JSONResponse(
        {"views": counts.view_count, "likes": counts.like_count, "liked": False}
    )
    return _write_interaction_cookie(response, request, visitor_cookie, new_cookie)


@router.get("/sitemap.xml", include_in_schema=False)
async def sitemap():
    locations = [
        f"<url><loc>{SITE_URL}/</loc></url>",
        f"<url><loc>{SITE_URL}/blog</loc></url>",
    ]
    for post in _published_posts():
        locations.append(
            f"<url><loc>{SITE_URL}/blog/{html.escape(post.slug)}</loc>"
            f"<lastmod>{_date(post.updated_at)}</lastmod></url>"
        )
    xml = (
        '<?xml version="1.0" encoding="UTF-8"?>'
        '<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">'
        + "".join(locations)
        + "</urlset>"
    )
    return Response(content=xml, media_type="application/xml")


def _tool_session():
    if SessionLocal is None:
        raise RuntimeError(
            "Blog database is not configured; set DATABASE_URL to a PostgreSQL connection string."
        )
    return SessionLocal()


def _tool_post(post: BlogPost) -> dict:
    return {
        "slug": post.slug,
        "title": post.title,
        "summary": post.summary,
        "language": post.language,
        "views": post.view_count,
        "likes": post.like_count,
        "published": post.is_published,
        "url": f"{SITE_URL}/blog/{post.slug}" if post.is_published else None,
    }


def _require_blog_owner() -> None:
    if not BLOG_OWNER_USER_ID:
        raise RuntimeError(
            "BLOG_OWNER_USER_ID is not configured; blog MCP tools are disabled."
        )
    access_token = get_access_token()
    if access_token is None:
        raise PermissionError("Supabase OAuth authentication is required.")
    user_id = access_token.claims.get("sub") or access_token.claims.get("user_id")
    if not isinstance(user_id, str) or not hmac.compare_digest(
        user_id, BLOG_OWNER_USER_ID
    ):
        raise PermissionError("Only the configured blog owner can use blog MCP tools.")


@mcp.tool()
def list_blog_posts() -> list[dict]:
    """List blog posts, including drafts, for the authenticated site owner."""
    _require_blog_owner()
    with _tool_session() as db:
        posts = db.scalars(
            select(BlogPost).order_by(BlogPost.updated_at.desc(), BlogPost.id.desc())
        )
        return [_tool_post(post) for post in posts]


@mcp.tool()
def get_blog_analytics(
    days: Annotated[int, "Recent activity window: 1 (rolling 24 hours), 7, 30, or 90 days"] = 30,
    limit: Annotated[int, "Maximum number of posts in ranked results, from 1 to 100"] = 20,
) -> dict:
    """Report current published-post views and likes, recent activity, rankings, and engagement insights."""
    _require_blog_owner()
    if days not in {1, 7, 30, 90}:
        raise ValueError("days must be 1 (rolling 24 hours), 7, 30, or 90")
    if not 1 <= limit <= 100:
        raise ValueError("limit must be between 1 and 100")

    now = datetime.now(timezone.utc)
    cutoff = now - timedelta(days=days)
    with _tool_session() as db:
        posts = list(
            db.scalars(
                select(BlogPost)
                .where(BlogPost.is_published.is_(True))
                .order_by(BlogPost.view_count.desc(), BlogPost.id.desc())
            )
        )
        draft_count = db.scalar(
            select(func.count()).select_from(BlogPost).where(
                BlogPost.is_published.is_(False)
            )
        )
        post_ids = [post.id for post in posts]
        if post_ids:
            recent_views = dict(
                db.execute(
                    select(BlogView.post_id, func.count())
                    .where(
                        BlogView.post_id.in_(post_ids),
                        BlogView.last_viewed_at >= cutoff,
                    )
                    .group_by(BlogView.post_id)
                ).all()
            )
            recent_likes = dict(
                db.execute(
                    select(BlogLike.post_id, func.count())
                    .where(
                        BlogLike.post_id.in_(post_ids),
                        BlogLike.created_at >= cutoff,
                    )
                    .group_by(BlogLike.post_id)
                ).all()
            )
        else:
            recent_views = {}
            recent_likes = {}

        ranked_posts = [
            {
                "slug": post.slug,
                "title": post.title,
                "views": post.view_count,
                "likes": post.like_count,
                "like_rate_percent": (
                    round(post.like_count / post.view_count * 100, 1)
                    if post.view_count
                    else None
                ),
                "recent_viewers": recent_views.get(post.id, 0),
                "recent_likes": recent_likes.get(post.id, 0),
                "url": f"{SITE_URL}/blog/{post.slug}",
            }
            for post in posts
        ]

    total_views = sum(post["views"] for post in ranked_posts)
    total_likes = sum(post["likes"] for post in ranked_posts)
    insights = []
    if ranked_posts:
        top_views = max(ranked_posts, key=lambda post: post["views"])
        top_likes = max(ranked_posts, key=lambda post: post["likes"])
        insights.append(
            {
                "type": "most_viewed",
                "slug": top_views["slug"],
                "title": top_views["title"],
                "views": top_views["views"],
            }
        )
        insights.append(
            {
                "type": "most_liked",
                "slug": top_likes["slug"],
                "title": top_likes["title"],
                "likes": top_likes["likes"],
            }
        )
        eligible = [post for post in ranked_posts if post["views"] >= 10]
        if eligible:
            best_rate = max(eligible, key=lambda post: post["like_rate_percent"])
            insights.append(
                {
                    "type": "highest_like_rate",
                    "minimum_views": 10,
                    "slug": best_rate["slug"],
                    "title": best_rate["title"],
                    "like_rate_percent": best_rate["like_rate_percent"],
                }
            )
        for post in ranked_posts:
            if post["views"] >= 10 and post["likes"] == 0:
                insights.append(
                    {
                        "type": "views_without_likes",
                        "slug": post["slug"],
                        "title": post["title"],
                        "views": post["views"],
                        "suggestion": "Review the article's call to action and share it with a relevant audience.",
                    }
                )

    return {
        "generated_at": now.isoformat(),
        "published_posts": len(ranked_posts),
        "draft_posts": draft_count or 0,
        "all_time": {
            "views": total_views,
            "likes": total_likes,
            "like_rate_percent": round(total_likes / total_views * 100, 1)
            if total_views
            else None,
        },
        "recent_activity": {
            "window_days": days,
            "viewer_post_records": sum(
                post["recent_viewers"] for post in ranked_posts
            ),
            "likes_added_and_still_active": sum(
                post["recent_likes"] for post in ranked_posts
            ),
            "definitions": {
                "viewer_post_records": (
                    "Distinct visitor-post records whose last counted view is in this window; "
                    "the same visitor can count once per post, and repeat visits are deduplicated "
                    "for 24 hours, so this is not total view events or site-wide unique visitors."
                ),
                "likes_added_and_still_active": (
                    "Currently active likes created in this window; removed likes are not included."
                ),
            },
        },
        "top_posts": ranked_posts[:limit],
        "insights": insights,
    }


@mcp.tool()
def create_blog_post(
    title: Annotated[str, "Article title"],
    content_markdown: Annotated[str, "Full article body in Markdown"],
    summary: Annotated[str, "Short excerpt shown in listings"] = "",
    meta_description: Annotated[str, "Search-result description"] = "",
    language: Annotated[str, "Article language: ar or en"] = "ar",
    publish: Annotated[bool, "Publish immediately; defaults to a private draft"] = False,
) -> dict:
    """Create a blog draft, or publish it immediately when publish=true."""
    _require_blog_owner()
    title = title.strip()
    if not title or len(title) > 180:
        raise ValueError("title must contain 1 to 180 characters")
    if not content_markdown.strip() or len(content_markdown) > 100_000:
        raise ValueError("content_markdown must contain 1 to 100000 characters")
    if language not in {"ar", "en"}:
        raise ValueError("language must be 'ar' or 'en'")
    if len(summary) > 320 or len(meta_description) > 320:
        raise ValueError("summary and meta_description must be at most 320 characters")

    with _tool_session() as db:
        slug = _slugify(title)
        if db.scalar(select(BlogPost.id).where(BlogPost.slug == slug)) is not None:
            slug = f"{slug[:188]}-{uuid.uuid4().hex[:8]}"
        now = datetime.now(timezone.utc)
        post = BlogPost(
            slug=slug,
            title=title,
            summary=summary.strip(),
            meta_description=meta_description.strip(),
            content_markdown=content_markdown,
            language=language,
            is_published=publish,
            created_at=now,
            updated_at=now,
            published_at=now if publish else None,
        )
        db.add(post)
        db.commit()
        db.refresh(post)
        return _tool_post(post)


@mcp.tool()
def update_blog_post(
    slug: Annotated[str, "Slug returned by create_blog_post or list_blog_posts"],
    title: Annotated[str, "Replacement title; leave empty to keep current"] = "",
    content_markdown: Annotated[str, "Replacement Markdown; leave empty to keep current"] = "",
    summary: Annotated[str, "Replacement excerpt; leave empty to keep current"] = "",
    meta_description: Annotated[str, "Replacement SEO description; leave empty to keep current"] = "",
) -> dict:
    """Update an existing blog draft or published post without changing its publication state."""
    _require_blog_owner()
    with _tool_session() as db:
        post = db.scalar(select(BlogPost).where(BlogPost.slug == slug))
        if post is None:
            raise ValueError(f"No blog post found with slug '{slug}'")
        if title:
            title = title.strip()
            if not title or len(title) > 180:
                raise ValueError("title must contain 1 to 180 characters")
            post.title = title
        if content_markdown:
            if not content_markdown.strip() or len(content_markdown) > 100_000:
                raise ValueError("content_markdown must contain 1 to 100000 characters")
            post.content_markdown = content_markdown
        if summary:
            if len(summary) > 320:
                raise ValueError("summary must be at most 320 characters")
            post.summary = summary.strip()
        if meta_description:
            if len(meta_description) > 320:
                raise ValueError("meta_description must be at most 320 characters")
            post.meta_description = meta_description.strip()
        post.updated_at = datetime.now(timezone.utc)
        db.commit()
        db.refresh(post)
        return _tool_post(post)


@mcp.tool()
def publish_blog_post(slug: Annotated[str, "Slug returned by create_blog_post or list_blog_posts"]) -> dict:
    """Publish a draft so it appears on the public blog and sitemap."""
    _require_blog_owner()
    with _tool_session() as db:
        post = db.scalar(select(BlogPost).where(BlogPost.slug == slug))
        if post is None:
            raise ValueError(f"No blog post found with slug '{slug}'")
        if not post.is_published:
            now = datetime.now(timezone.utc)
            post.is_published = True
            post.published_at = now
            post.updated_at = now
            db.commit()
            db.refresh(post)
        return _tool_post(post)


@mcp.tool()
def delete_blog_post(
    slug: Annotated[str, "Slug returned by create_blog_post or list_blog_posts"],
    confirm: Annotated[bool, "Must be true to permanently delete the post and its engagement data"],
) -> dict:
    """Permanently delete a blog post and its views and likes. Requires explicit confirmation."""
    _require_blog_owner()
    if not confirm:
        raise ValueError("Deletion not performed. Set confirm=true only after verifying the post slug.")

    with _tool_session() as db:
        post = db.scalar(select(BlogPost).where(BlogPost.slug == slug))
        if post is None:
            raise ValueError(f"No blog post found with slug '{slug}'")
        deleted_post = {"slug": post.slug, "title": post.title}
        db.execute(delete(BlogView).where(BlogView.post_id == post.id))
        db.execute(delete(BlogLike).where(BlogLike.post_id == post.id))
        db.delete(post)
        db.commit()
        return {"deleted": True, **deleted_post}
