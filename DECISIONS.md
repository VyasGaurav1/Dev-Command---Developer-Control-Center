# Architecture Decisions

## 2026-11-28 — Preserve the existing stack
Keep Next.js App Router, Better Auth, Drizzle, `pg` Pool, and connected Neon. The application and live schema already use this stack; migrating databases or auth providers would add risk without a requirement.

## 2026-11-28 — Workspace isolation must be enforced server-side
Projects are scoped to a workspace resolved from the authenticated user's membership. A client-selected workspace ID is never proof of access. The additive workspace migration backfilled existing users/projects; project mutations enforce owner/admin/developer permissions and viewers remain read-only. The active workspace selection is an HttpOnly, server-set cookie; development uses `SameSite=None; Secure` so it works in the cross-site v0 preview iframe.

## 2026-11-28 — No simulated infrastructure state
Provider status, deployment success, monitoring measurements, usage and spend must come from a real provider/worker or be clearly labeled unavailable/estimated. Keep unconfigured integrations functional as disconnected states.

## 2026-11-28 — Independent execution plane
Vercel functions are the control plane only. Long-running builds, monitoring schedules, SSH, Docker, and agents require isolated worker/agent services; do not run unrestricted infrastructure operations in request handlers.

## 2026-11-28 — Build diagnostics are mandatory
Removed `typescript.ignoreBuildErrors` from Next config. A green build must include type-check diagnostics rather than suppressing them.

## 2026-11-28 — Openship is an adapter, not a fork
Prefer supported REST/SDK integration and independently implement missing capabilities. Verify actual routes, auth, and repository license before adapting or reusing source. Track third-party obligations in `THIRD_PARTY_NOTICES.md`.
