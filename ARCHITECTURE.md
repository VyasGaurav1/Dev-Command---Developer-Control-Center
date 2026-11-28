# Architecture

## Current application
- Next.js App Router provides the web/control plane.
- Better Auth handles email/password auth and sessions via the shared PostgreSQL `pg` Pool.
- Drizzle accesses Neon Postgres. Current app data includes `public.projects`, keyed by user ownership; all existing project server actions validate session and scope by user ID.
- React/shadcn components render the dashboard and project CRUD. Most other dashboard areas are presentation-only and must not be treated as live data.

## Target modular boundaries
- Domain/data layer: workspace, projects, integrations, repositories, deployments, monitors, incidents, servers, domains, providers, usage, notifications, and audit records.
- Service layer: domain operations with authentication, membership, role authorization, validation, and provider-neutral contracts.
- Adapters: GitHub, Openship, Vercel, Netlify, Railway, Render, and other authorized providers behind isolated interfaces.
- Execution plane: separately deployable queue-backed build/deployment and monitoring workers, restricted network egress and per-job credentials; signed Linux agent for private-server telemetry.

## Security model
Neon has no app-level RLS configured for `public`; every app query must include the authenticated user/workspace membership scope. Authorization is server-side, not a hidden button. Secrets are never returned to client components. Treat repository build scripts, webhooks, logs, URLs and provider responses as hostile input. Monitoring workers must block loopback/private/link-local/metadata destinations and revalidate redirects. No arbitrary shell execution is exposed.

## Current limitations
No worker, queue, provider adapter, integration credential store, background monitor, or isolated builder was found in the audited app. Their interfaces and deployment topologies remain future work, not capabilities of the current Next.js runtime.
