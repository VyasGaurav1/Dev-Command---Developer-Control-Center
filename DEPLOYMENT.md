# Deployment and Operations

## Current control plane
The app is a Next.js App Router project and has a Vercel-compatible configuration. It uses Neon Postgres via `DATABASE_URL` and Better Auth via `BETTER_AUTH_SECRET`; project env setup is managed by the connected integration. Do not print or commit environment values.

## Current capability boundary
This repository does not yet contain a persistent worker, job queue, isolated build runner, monitoring agent, or Docker orchestration service. Therefore it cannot truthfully execute persistent monitoring/deployments from serverless request handlers. Those components require separately provisioned, authorized infrastructure and operational documentation before use.

## Safe deployment requirements
- Keep production changes behind provider-supported APIs and explicit permission checks.
- Build imported source in an isolated ephemeral environment with no control-plane secrets.
- Track accepted/running/completed/failed states from the execution engine.
- Health checks must use configured safe targets and bounded timeouts.
- Document worker image, queue, persistence, egress rules, resource limits, secret flow, update/rollback, backups, and alerting before enabling.
- Do not run destructive migrations against production during development.

See `BLOCKERS.md` for currently missing provider credentials and execution-plane dependencies.
