import os
from contextlib import asynccontextmanager
from pathlib import Path

from fastapi import FastAPI, Request
from fastapi.responses import FileResponse, JSONResponse

from blog import (
    BLOG_OWNER_USER_ID,
    SUPABASE_ALLOWED_OAUTH_CLIENT_IDS,
    SUPABASE_PROJECT_URL,
    auth_provider,
    initialize_database,
    mcp,
    router,
)

PUBLIC_DIR = Path(__file__).resolve().parent / "public"
SUPABASE_ANON_KEY = os.getenv("SUPABASE_ANON_KEY", "")
mcp_app = mcp.http_app(path="/mcp", transport="streamable-http", stateless_http=True)


@asynccontextmanager
async def lifespan(_: FastAPI):
    initialize_database()
    async with mcp_app.router.lifespan_context(mcp_app):
        yield


app = FastAPI(
    title="Ahmed Elrefai Portfolio",
    description="Portfolio and blog for Ahmed Elrefai",
    version="2.0.0",
    lifespan=lifespan,
)
app.include_router(router)


@app.middleware("http")
async def require_oauth_configuration(request: Request, call_next):
    if request.url.path == "/mcp" or request.url.path.startswith("/mcp/"):
        if auth_provider is None:
            return JSONResponse(
                status_code=503,
                content={
                    "detail": (
                        "Configure SUPABASE_PROJECT_URL and "
                        "SUPABASE_ALLOWED_OAUTH_CLIENT_IDS for MCP OAuth"
                    )
                },
            )
    return await call_next(request)


@app.get("/", include_in_schema=False)
async def serve_index():
    return FileResponse(PUBLIC_DIR / "index.html")


@app.get("/app.js", include_in_schema=False)
async def serve_app_js():
    return FileResponse(PUBLIC_DIR / "app.js")


@app.get("/style.css", include_in_schema=False)
async def serve_style_css():
    return FileResponse(PUBLIC_DIR / "style.css")


@app.get("/blog.css", include_in_schema=False)
async def serve_blog_css():
    return FileResponse(PUBLIC_DIR / "blog.css")


@app.get("/blog.js", include_in_schema=False)
async def serve_blog_js():
    return FileResponse(PUBLIC_DIR / "blog.js")


@app.get("/oauth-consent.css", include_in_schema=False)
async def serve_oauth_consent_css():
    return FileResponse(PUBLIC_DIR / "oauth-consent.css")


@app.get("/oauth-consent.js", include_in_schema=False)
async def serve_oauth_consent_js():
    return FileResponse(PUBLIC_DIR / "oauth-consent.js")


@app.get("/me.webp", include_in_schema=False)
async def serve_me_webp():
    return FileResponse(PUBLIC_DIR / "me.webp", media_type="image/webp")


@app.get("/refai_stats_card.webp", include_in_schema=False)
async def serve_refai_stats_card_webp():
    return FileResponse(PUBLIC_DIR / "refai_stats_card.webp", media_type="image/webp")


@app.get("/favicon.ico", include_in_schema=False)
async def serve_favicon():
    return FileResponse(PUBLIC_DIR / "favicon.ico", media_type="image/x-icon")


@app.get("/robots.txt", include_in_schema=False)
async def robots_txt():
    return FileResponse(PUBLIC_DIR / "robots.txt", media_type="text/plain")


@app.get("/oauth/consent", include_in_schema=False)
async def oauth_consent():
    return FileResponse(
        PUBLIC_DIR / "oauth-consent.html",
        headers={"Cache-Control": "no-store"},
    )


@app.get("/oauth/config", include_in_schema=False)
async def oauth_config():
    if (
        not SUPABASE_PROJECT_URL
        or not SUPABASE_ANON_KEY
        or not BLOG_OWNER_USER_ID
        or not SUPABASE_ALLOWED_OAUTH_CLIENT_IDS
    ):
        return JSONResponse(
            status_code=503,
            content={"detail": "Supabase OAuth consent is not fully configured"},
        )
    return JSONResponse(
        {
            "project_url": SUPABASE_PROJECT_URL,
            "anon_key": SUPABASE_ANON_KEY,
            "owner_user_id": BLOG_OWNER_USER_ID,
            "allowed_oauth_client_ids": sorted(SUPABASE_ALLOWED_OAUTH_CLIENT_IDS),
        },
        headers={"Cache-Control": "no-store"},
    )


app.mount("/", mcp_app)
