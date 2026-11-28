# DevCommand — Developer Control Center

DevCommand is evolving into a unified Developer Operating System for projects, repositories, deployments, infrastructure, monitoring, domains, APIs, incidents, costs, and developer workflows.

## Current implementation
The current app provides Better Auth email/password account flows, a protected dashboard, and per-user project create/list/edit/archive/restore backed by Neon Postgres. The navigation for most other product areas is currently placeholder UI; there is no real deployment engine, GitHub sync, monitoring worker, or infrastructure agent yet. See `FEATURE_CHECKLIST.md` and `IMPLEMENTATION_STATUS.md` for precise status.

## Stack
Next.js App Router, TypeScript, React, Tailwind/shadcn, Better Auth, Drizzle ORM, `pg`, and Neon Postgres.

## Configuration
The Vercel project currently supplies `DATABASE_URL` and `BETTER_AUTH_SECRET` through managed environment configuration. Keep all secrets in Vercel-managed variables/integrations; never commit `.env` files. Use the project integration settings to inspect or configure providers.

## Development and verification
Use the project's package manager (`pnpm`, per `pnpm-lock.yaml`) and the scripts in `package.json`: `dev`, `build`, and `lint`. Verify sign-in, protected reload/sign-out, and per-user project CRUD before release. Type errors are no longer ignored by the Next.js build.

## Architecture and roadmap
Read `AGENTS.md` before contributing. The active roadmap, schema boundaries, security requirements, blockers, and verification matrix are documented in `DEVELOPMENT_ROADMAP.md`, `ARCHITECTURE.md`, `DATABASE_SCHEMA.md`, `SECURITY.md`, `BLOCKERS.md`, and `TEST_MATRIX.md`.
