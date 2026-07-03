from fastapi import FastAPI
from fastapi.responses import FileResponse

app = FastAPI(
    title="Ahmed Elrefai Portfolio API",
    description="FastAPI Backend for Ahmed Elrefai's Portfolio",
    version="1.0.0"
)

# ----------------------------------------------------
# SECURE ROUTING FOR STATIC FRONTEND ASSETS
# ----------------------------------------------------
@app.get("/")
async def serve_index():
    return FileResponse("index.html")

@app.get("/app.js")
async def serve_app_js():
    return FileResponse("app.js")

@app.get("/style.css")
async def serve_style_css():
    return FileResponse("style.css")

@app.get("/me.webp")
async def serve_me_webp():
    return FileResponse("me.webp", media_type="image/webp")

@app.get("/refai_stats_card.webp")
async def serve_refai_stats_card_webp():
    return FileResponse("refai_stats_card.webp", media_type="image/webp")

@app.get("/favicon.ico")
async def serve_favicon():
    return FileResponse("favicon.ico", media_type="image/x-icon")
