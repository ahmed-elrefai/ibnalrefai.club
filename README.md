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
- `SUPABASE_ALLOWED_OAUTH_CLIENT_IDS`: comma-separated IDs of the OAuth apps
  you manually register and trust. Requests from other registered clients are
  rejected by the MCP token verifier.
- `BASE_URL`: public website origin, `https://www.ibnalrefai.club`.
- `BLOG_ANALYTICS_SECRET`: required random secret of at least 32 characters
  for signing anonymous blog interaction cookies. Blog views and likes return
  an error until this is configured.

Set the variables for Production and redeploy. Never use a Supabase service
role key in the browser or commit database credentials to Git.

### Configure Supabase OAuth

In Supabase **Authentication → OAuth Server**:

1. Enable the OAuth Server.
2. Set **Site URL** to `https://www.ibnalrefai.club`.
3. Set **Authorization Path** to `/oauth/consent`.
4. Leave **Allow Dynamic OAuth Apps** disabled. Public registration lets
   arbitrary clients create app registrations and can enable convincing
   impersonation or phishing attempts.
5. In **Authentication → URL Configuration**, allow
   `https://www.ibnalrefai.club/oauth/consent`. This is the redirect used by
   the owner's email sign-in link; it is **not** the MCP client's OAuth
   `redirect_uri`.
6. Create/confirm your owner account in **Authentication → Users**, then copy
   its user UUID into Vercel as `BLOG_OWNER_USER_ID`.
7. Under **Authentication → OAuth Apps**, manually register only the client
   you intend to use. Add the exact OAuth callback/redirect URI that Grok
   displays or documents for its MCP connector. This value belongs to Grok,
   not your website; do not enter `/oauth/consent` here unless Grok explicitly
   identifies that URL as its callback. Redirect URIs must match exactly,
   including scheme, host, path, and trailing slash. For a PKCE-only MCP
   client choose a **Public** app; use a **Confidential** app only if the
   client requires a secret and can protect it.
8. Add the registered app's client ID to
   `SUPABASE_ALLOWED_OAUTH_CLIENT_IDS` in Vercel. Add more approved IDs as a
   comma-separated list. Do not put a client secret in frontend code.

The deployed consent screen lets the owner sign in using a one-time email link
and approve or deny the requesting MCP client. All MCP blog tools check the
verified Supabase token's user ID against `BLOG_OWNER_USER_ID`; other signed-in
users cannot read drafts or modify posts.
The MCP tools can list, create, update, publish, permanently delete posts, and
retrieve blog analytics. `get_blog_analytics` reports all-time totals, ranked
posts, 7/30/90-day recent activity, and engagement signals. Recent viewer
activity is based on deduplicated visitor-post records (not raw view events),
and recent likes include only likes still active at report time. Deletion
requires explicit confirmation of the post slug and also removes its stored
views and likes.

Connect the MCP client to `https://www.ibnalrefai.club/mcp` using OAuth. Enter
the manually registered client ID and, only for a confidential client, its
client secret. Public PKCE clients do not have a secret. The client must use
OAuth discovery and the redirect URI registered in Supabase. The MCP server
rejects valid Supabase tokens issued to client IDs absent from
`SUPABASE_ALLOWED_OAUTH_CLIENT_IDS`.

If Supabase returns `{"code":400,"error_code":"validation_failed","msg":"invalid redirect_uri"}`,
the callback URI sent by the MCP client does not exactly match one registered
for that OAuth app in Supabase. Check Grok's MCP OAuth callback URI and add it
to that app under **Authentication → OAuth Apps**. Do not change the site's
**Authorization Path**: `/oauth/consent` is where Supabase sends the browser
to ask for owner approval, not where it returns the browser to Grok.

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
