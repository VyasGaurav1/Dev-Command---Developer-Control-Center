# Integrations

| Provider | Current state | Safe implementation boundary |
|---|---|---|
| Neon Postgres | Connected; current app data/auth tables exist | Drizzle server-side; all application data scoped by authenticated identity/workspace |
| GitHub | Not configured | Authorized OAuth/App; minimum read scope by default; verify webhook signatures |
| Openship | Not configured | Isolated adapter; authenticated discovery and explicit deployment authorization |
| Vercel/Netlify/Railway/Render | Not configured | Provider-specific server-side credentials and provider-confirmed deployment state |
| Cloud/VPS/Docker/PM2 | No execution integration/agent | Signed scoped agent or authorized provider APIs; never public unrestricted shell/Docker |
| SMTP/email | Not configured | Required for recovery/invitation/notification delivery; generic responses and verified callback URLs |
| AI/API providers | Not configured | Encrypted server-only credentials; provider-reported metrics separated from local estimates |
| Slack/Discord/other notifications | Not configured | Optional, least privilege, signed callbacks and cooldown/deduplication |

Unconfigured providers must render disconnected/unavailable states. Do not use fake connected badges, sample metrics, or successful deployment records as fallback.
