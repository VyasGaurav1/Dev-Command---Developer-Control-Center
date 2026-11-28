# Development Roadmap

Roadmap is sequenced by dependency; each milestone updates the status/checklist/test docs and records external blockers. No phase is considered done based on UI alone.

1. **Phase 0 — Audit and foundation (in progress):** audit existing routes/data/security, capture actual statuses, ensure build checks cannot be suppressed, document source/license review and resumable state.
2. **Phase 1 — Authentication and security:** retain Better Auth; implement workspace ownership/membership, roles and invitations with server-side enforcement and migration-safe user-data ownership. Add account recovery and configure requested auth methods only when credentials/provider support are available.
3. **Phase 2 — Existing functionality:** finish real project records/details, remove misleading actions and static operational claims; preserve useful existing project CRUD.
4. **Phase 3 — GitHub/project management:** least-privilege GitHub App/OAuth integration, repository/project linking, issues/PRs/Actions/releases, webhook verification and event audit.
5. **Phase 4 — Infrastructure:** provider-neutral server registration, scoped Linux agent, Docker/PM2 telemetry, infrastructure adapters and isolated always-on components.
6. **Phase 5 — Openship/deployments:** inspect upstream source/API/license; isolate Openship adapter; implement authenticated connection/discovery, then state-machine-driven deploy workflows only against configured providers.
7. **Phase 6 — Networking/data:** domains, DNS/SSL read checks, authorized DB connections and backup workflows; guard all destructive actions.
8. **Phase 7 — Observability:** isolated SSRF-safe background monitors, genuine metrics/logs, incident lifecycle, notification rules, cooldowns, and status pages.
9. **Phase 8 — Developer intelligence:** API provider inventory, actual/provider-reported usage vs explicit estimates, budgets, activity, tasks, global search, analytics.
10. **Phase 9 — Production readiness:** integration/e2e/accessibility/security testing, worker/container deployment definitions, retention/backups, dependency and licensing notices, operations documentation.

At each step: inspect callers and schemas, make a small safe implementation, verify authorization and behavior, then update the exact next task in `IMPLEMENTATION_STATUS.md`. External credentials and always-on execution requirements are blockers to real connected operation, not justification for fake data.
