# Feature Checklist

Status key: **Complete and verified**, **Implemented but untested**, **Partially implemented**, **UI only**, **Missing**, **Broken**, **Blocked**. Statuses describe inspected source, not aspirations.

## Foundation and account security
- [ ] Email/password sign-up and sign-in — **Implemented but untested**; Better Auth client and server session checks exist.
- [ ] Secure sessions and sign-out — **Implemented but untested**; Better Auth session configuration and sign-out control exist.
- [ ] Password recovery and verified-email flow — **Missing**.
- [ ] GitHub sign-in — **Missing**; no provider configured.
- [ ] Server-side authorization for project actions — **Implemented but untested**; project reads and mutations require an authenticated workspace membership and scope to the validated active workspace; role gates protect mutations.
- [ ] Personal and team workspaces, workspace switching — **Implemented but untested**; personal workspace bootstrapping, team creation, membership-validated switching, and HttpOnly active-workspace selection are implemented.
- [ ] Workspace membership, invitations, role permissions, tenant isolation — **Partially implemented**; membership table and owner/admin/developer/viewer project permissions are implemented; invite/revoke/member-management UI remains missing.
- [ ] Custom roles, audit trail, session/credential revocation — **Missing**.
- [ ] Credential encryption/redaction — **Missing**; no provider credential storage is implemented.

## Projects and developer workflow
- [ ] Create/list/edit/archive/restore projects — **Implemented but untested**; persisted through Drizzle/Neon and scoped by a server-validated workspace membership.
- [ ] Project search and active/archived filters — **Implemented but untested**; client filtering over server-provided project records.
- [ ] Repository import, branches, commits, PRs, issues, releases, Actions — **UI only**; no GitHub integration/API.
- [ ] Project detail, environments, tags, notes, linked services — **Missing**.
- [ ] Global search/command palette — **Partially implemented**; section navigation only, not cross-project search.
- [ ] Tasks, activity timeline, documentation, cross-project analytics — **UI only**.

## Deployment, servers, networking, and data
- [ ] Openship connector and provider adapters — **Missing**.
- [ ] Deployment execution, state machine, history/logs/rollback/cancel — **UI only**; no execution provider.
- [ ] Server registration/agent/metrics/PM2/Docker monitoring — **UI only**; no agent or worker.
- [ ] Domains, DNS, SSL, expiry, reverse proxy — **UI only**.
- [ ] HTTP/TCP monitoring, real scheduled checks, history — **UI only**; no background monitoring job.
- [ ] Logs, incidents, notifications, status pages — **UI only**.
- [ ] Database registration/provisioning/backups/restore — **UI only**.
- [ ] API/AI providers, reported usage and cost tracking — **UI only**; no provider APIs or instrumentation.
- [ ] Budgets, infrastructure costs, subscription renewals — **UI only**.

## Production readiness
- [x] Strict type checking at production build — **Complete and verified**; removed `ignoreBuildErrors` and production build passed.
- [x] Project lint command — **Complete and verified**; installed/configured ESLint; lint passes with four non-blocking unused-variable warnings.
- [ ] Baseline HTTP security headers — **Implemented but untested** in `next.config.mjs`.
- [ ] Isolated deployment/monitoring workers and queues — **Missing**.
- [ ] Webhook signatures, rate limiting, SSRF controls, safe build isolation — **Missing**.
- [ ] Automated critical-flow tests and production deployment configuration — **Missing**.
- [ ] Openship API/source and licensing review — **Partially implemented**; deployment route surface has been identified from public references; deeper API/source/license verification remains.
