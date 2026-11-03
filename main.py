import hmac
import os
from contextlib import asynccontextmanager
from pathlib import Path

from fastapi import FastAPI, Request
from fastapi.responses import FileResponse, JSONResponse

from blog import initialize_database, mcp, router

PUBLIC_DIR = Path(__file__).resolve().parent / "public"


@asynccontextmanager
async def lifespan(_: FastAPI):
    initialize_database()
    async with mcp.session_manager.run():
        yield


app = FastAPI(
    title="Ahmed Elrefai Portfolio",
    description="Portfolio and blog for Ahmed Elrefai",
    version="2.0.0",
    lifespan=lifespan,
)
app.include_router(router)


@app.middleware("http")
async def authenticate_mcp(request: Request, call_next):
    if request.url.path == "/mcp" or request.url.path.startswith("/mcp/"):
        expected_token = os.getenv("BLOG_MCP_TOKEN")
        if not expected_token:
            return JSONResponse(
                status_code=503,
                content={"detail": "BLOG_MCP_TOKEN is not configured"},
            )
        supplied_token = request.headers.get("authorization", "")
        if not hmac.compare_digest(supplied_token, f"Bearer {expected_token}"):
            return JSONResponse(
                status_code=401,
                headers={"WWW-Authenticate": "Bearer"},
                content={"detail": "Invalid MCP bearer token"},
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


# FastMCP serves its /mcp path internally; mounting last preserves the site routes above.
app.mount("/", mcp.streamable_http_app())
