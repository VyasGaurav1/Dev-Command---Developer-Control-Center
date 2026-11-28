# Security

## Current safeguards and gaps
Better Auth protects the dashboard route and project actions retrieve a server session. Project operations scope by `userId`. Next config sends nosniff, strict-origin referrer policy, HSTS, SAMEORIGIN, and restrictive camera/microphone/geolocation policy. Live `public` schema reports RLS disabled, so per-query scoping is mandatory. No role/membership model, provider secret store, rate limiter, signature verifier, worker egress policy, or build sandbox was found in the audit.

## Required controls
- Enforce authentication, workspace membership, and role permissions in every route/action; deny by default.
- Validate inputs with schemas, impose size/time limits, parameterize queries, and use generic auth errors.
- Encrypt integration credentials at rest with key rotation and redaction. Keep them out of client props, logs, error reports, and build contexts.
- Verify webhook signatures/timestamps and reject replay. Rate-limit auth, expensive operations, and webhook ingress.
- Isolate untrusted builds from control-plane credentials; constrain CPU/memory/time/filesystem/network and use per-job ephemeral credentials.
- Protect monitoring against SSRF: reject unsafe IP ranges, resolve/revalidate DNS at connection time, and apply the same policy to redirects.
- Never offer arbitrary shell commands or privileged Docker socket access through the app.
- Confirm destructive and production-changing operations; audit actor, scope, target, and outcome.
- Use safe file handling, secrets redaction, backups, retention limits, and recovery drills.

## Operational note
Only the current baseline headers have been configured; broader controls are not complete. Do not describe this app as security-audited or production-ready until threat-model-driven tests pass.
