# Ahmed Elrefai portfolio and blog

## Deploy to Vercel

Import this repository into Vercel and deploy from the repository root.
Vercel detects the FastAPI application in `main.py`, installs Python packages
from `requirements.txt`, and serves the portfolio files in `public/` from its
CDN. Blog pages, APIs, sitemap, consent callback, and MCP are handled by
FastAPI. `Dockerfile` is for container hosting outside Vercel.

Set these Vercel environment variables:

- `DATABASE_URL`: Supabase **Transaction pooler** connection string from the
  Supabase dashboard's **Connect** panel (normally port `6543`).
- `SUPABASE_PROJECT_URL`: project URL, for example
  `https://your-project-ref.supabase.co`.
- `SUPABASE_ANON_KEY`: Supabase publishable/anon key. This key is intentionally
  used by the consent page in the browser; it is not a service-role key.
- `SUPABASE_JWT_ALGORITHM`: the JWT signing algorithm configured for your
  Supabase project (`ES256`, `RS256`, or `HS256`); defaults to `ES256`.
- `BLOG_OWNER_USER_ID`: the UUID of the Supabase Auth user allowed to manage
  blog posts through MCP.
- `BASE_URL`: public website origin, `https://www.ibnalrefai.club`.
- `BLOG_ANALYTICS_SECRET` (optional): random secret of at least 32 characters
  for signing anonymous blog interaction cookies.

Set the variables for Production and redeploy. Never use a Supabase service
role key in the browser or commit database credentials to Git.

### Configure Supabase OAuth

In Supabase **Authentication → OAuth Server**:

1. Enable the OAuth Server.
2. Set **Site URL** to `https://www.ibnalrefai.club`.
3. Set **Authorization Path** to `/oauth/consent`.
4. Enable **Allow Dynamic OAuth Apps** so MCP clients can register.
5. In **Authentication → URL Configuration**, allow the exact redirect URL
   `https://www.ibnalrefai.club/oauth/consent`.
6. Create/confirm your owner account in **Authentication → Users**, then copy
   its user UUID into Vercel as `BLOG_OWNER_USER_ID`.

The deployed consent screen lets the owner sign in using a one-time email link
and approve or deny the requesting MCP client. All MCP blog tools check the
verified Supabase token's user ID against `BLOG_OWNER_USER_ID`; other signed-in
users cannot read drafts or modify posts.

Connect an MCP client to `https://www.ibnalrefai.club/mcp` and choose its
OAuth option. Supabase supplies OAuth discovery and dynamically registers
clients. With dynamic registration enabled, let the MCP client register itself;
do not enter a manually created client ID or client secret. The previous
shared `BLOG_MCP_TOKEN` authentication is no longer used.

The app disables Psycopg prepared statements and limits each serverless
instance to one pooled connection for Supabase transaction-pooler
compatibility. MCP is configured for stateless HTTP for serverless instances.

## Local development

```powershell
python -m pip install -r requirements.txt
$env:DATABASE_URL = "postgresql+psycopg://user:password@localhost:5432/blog"
$env:SUPABASE_PROJECT_URL = "https://your-project-ref.supabase.co"
$env:SUPABASE_ANON_KEY = "your-publishable-or-anon-key"
$env:SUPABASE_JWT_ALGORITHM = "ES256"
$env:BLOG_OWNER_USER_ID = "your-supabase-auth-user-uuid"
$env:BASE_URL = "http://localhost:8000"
$env:BLOG_ANALYTICS_SECRET = "a-random-secret-with-at-least-32-characters"
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
