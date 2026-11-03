# Ahmed Elrefai portfolio and blog

## Deploy to Vercel

Import this repository into Vercel and deploy from the repository root.
Vercel detects the FastAPI application in `main.py`, installs Python packages
from `requirements.txt`, and serves files in `public/` from its CDN. The
`public/` directory contains the portfolio HTML, JavaScript, CSS, images, icon,
and `robots.txt`; the blog pages, APIs, sitemap, and MCP endpoint are handled
by FastAPI. `Dockerfile` is only needed when deploying as a container outside
Vercel.

Set these Vercel environment variables for **Production** (and Preview if
needed):

1. `DATABASE_URL`: Supabase **Transaction pooler** URI copied from the
   dashboard's **Connect** panel. It normally uses port `6543`. Do not use the
   direct IPv6 connection string for Vercel's serverless function.
2. `BLOG_MCP_TOKEN`: generate with
   `python -c "import secrets; print(secrets.token_urlsafe(32))"`.
3. `BLOG_ANALYTICS_SECRET` (optional): a separate random secret of at least
   32 characters. If omitted, the app uses `BLOG_MCP_TOKEN` to sign visitor
   cookies.

The app disables Psycopg prepared statements and limits each serverless
instance to one pooled connection for Supabase transaction-pooler
compatibility. The Vercel deployment uses stateless MCP HTTP so requests do
not rely on being routed to the same serverless instance.

## Configuration and local development

The portfolio can serve without a database, but blog pages and the MCP tools
require PostgreSQL. The application creates the required tables at startup and
adds view and like counters to existing blog tables. Keep database passwords
and tokens in hosting-provider secret settings; do not commit them.

```powershell
python -m pip install -r requirements.txt
$env:DATABASE_URL = "postgresql+psycopg://user:password@localhost:5432/blog"
$env:BLOG_MCP_TOKEN = "replace-with-a-long-random-secret"
$env:BLOG_ANALYTICS_SECRET = "replace-with-another-long-random-secret"
uvicorn main:app --reload
```

## Blog views and likes

Each published article records at most one view per browser in a rolling
24-hour window. A browser can like each article once and can remove its like.
The anonymous, HTTP-only visitor cookie lasts one year. The database stores a
hash of its random identifier, not the cookie value or the visitor's IP
address. Clearing the cookie or switching browsers/devices creates a new
anonymous identity, so these counts are engagement signals rather than
verified unique-person analytics.

## MCP blog tools

Connect an MCP-compatible client to `https://ibnalrefai.club/mcp` using
Streamable HTTP and the `Authorization: Bearer <BLOG_MCP_TOKEN>` header. The
server provides:

- `create_blog_post`: create a Markdown draft; set `publish=true` to publish it
  immediately.
- `update_blog_post`: update a post using its slug.
- `publish_blog_post`: publish a saved draft.
- `list_blog_posts`: list published posts and drafts.

Do not expose the bearer token in public prompts or share it with untrusted
clients. Public posts are rendered as SEO-friendly HTML at `/blog/{slug}`.
