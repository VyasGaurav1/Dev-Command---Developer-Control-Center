# Database Schema Notes

## Current application schema
The live `public` schema contains Better Auth `user`, `session`, `account`, `verification`, and DevCommand `projects` tables. The project table has `id`, `userId`, `name`, `description`, `status`, `createdAt`, and `updatedAt`. Project actions use per-user `userId` filtering. No team workspace tables or workspace foreign key exist in the app schema.

The connected Neon environment also exposes a separate `neon_auth` schema with auth/organization tables. The app currently imports `public` schema mappings and uses its own public Better Auth tables; do not mix or assume those schemas are interchangeable.

## Target schema domains
Workspaces, memberships and invitations; projects, repositories and environments; integrations and encrypted credential references; deployments and state transitions; servers/agents/metrics; monitors/results; domains/certificates; incidents/events; provider usage/cost; notifications/tasks; immutable audit history.

## Migration rules
- Refresh live Neon schema before querying or altering existing tables.
- Apply additive migration with a backfill plan before changing application queries.
- Preserve every existing project and establish a valid owner/workspace before enforcing non-null workspace ownership.
- Use constraints/indexes and user/workspace scoping; never rely on the UI for tenant isolation.
- No destructive DDL, account deletion or production restore in development.
- Update Drizzle schema and this document after each applied migration; test rollback or forward-recovery strategy.
