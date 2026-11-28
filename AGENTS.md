# DevCommand Development Instructions

DevCommand is an independent Developer Operating System. Preserve existing working behavior and data; do not present UI as implemented backend functionality. Work sequentially from `DEVELOPMENT_ROADMAP.md` and resume from the exact next task in `IMPLEMENTATION_STATUS.md`.

## Engineering rules
- Inspect active code, callers, and live database schema before changing them.
- Keep all user-owned reads and writes server-side and scoped to the authenticated owner/workspace. Verify authorization on every mutation.
- Use the existing Next.js App Router, TypeScript, Tailwind/shadcn, Better Auth, Drizzle, and connected Neon Postgres patterns. Do not add another database/auth provider without reason.
- Use additive, safe schema migrations. Never run destructive production operations during development.
- Do not fabricate provider metrics or mark deployments healthy without confirmation from the execution provider. Clearly label unsupported/unconfigured capabilities.
- Never expose credentials to client code, arbitrary build scripts, logs, or error messages. Do not expose unrestricted shell, SSH, or Docker access.
- Load the relevant integration skill and verify live schemas before integration-dependent code. Keep credentials in managed integrations or encrypted server-side storage.
- Test changed behavior and correct failures. Record untested work honestly. For user-visible flows, verify in a browser.
- Maintain `FEATURE_CHECKLIST.md`, `IMPLEMENTATION_STATUS.md`, `DEVELOPMENT_ROADMAP.md`, `TEST_MATRIX.md`, `DECISIONS.md`, and `BLOCKERS.md` with each milestone.

## Current checkpoint
Phase 1 authentication/security. The initial source audit and build/lint foundation are documented in `IMPLEMENTATION_STATUS.md`. The next implementation task is the secure workspace model (membership, roles, switching, and migration of existing user-owned projects), following additive migration review and server-side authorization tests.
