# Test Matrix

Status reflects checks actually run for the current checkpoint.

| Area | Expected verification | Status |
|---|---|---|
| Email sign-up/sign-in | Browser form, persisted session, reload, sign-out, protected URL redirect | Not run in this checkpoint |
| Project CRUD | Authenticated create/list/edit/archive/restore; cross-user IDs rejected | Not run in this checkpoint |
| Workspace tenancy | Member access, role matrix, invitation lifecycle, cross-workspace denial | Not implemented |
| GitHub | OAuth/App callback, scoped API reads, webhook signatures/replay rejection | Not implemented |
| Openship | Auth/connectivity, capability discovery, import and provider-confirmed deployment state | Not implemented |
| Deployments | State machine and mocked adapter contract tests; live provider only when configured | Not implemented |
| Monitoring | Worker scheduling, SSRF/redirect/private-IP rejection, history and incident deduplication | Not implemented |
| Agent | Token scope, signature/replay checks, metric validation, safe upgrades | Not implemented |
| Security | Input bounds, authorization per mutation, secret redaction, headers and rate limits | Partial source audit only |
| Build/typecheck/lint | `pnpm run build`, `pnpm run lint`, TypeScript diagnostics | Build and lint passed; lint has four existing warnings |
| Frozen dependency install | `pnpm install --frozen-lockfile` | Passed |
| Patch hygiene | `git diff --check` | Passed |
| Browser UI | Sign-in + projects responsive interactions and navigation accessibility | Not run in this checkpoint |

No functionality is marked verified until the corresponding test is executed and passes.
