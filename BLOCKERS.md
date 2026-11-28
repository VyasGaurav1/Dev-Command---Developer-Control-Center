# Blockers

No external credential is needed for the current source audit. The following dependencies prevent claiming corresponding connected features complete:

- GitHub App/OAuth client and webhook configuration are not present; GitHub operations cannot be exercised until an authorized integration is configured.
- No Openship instance endpoint/account is configured. Public route references are not proof of a compatible deployed API; connection/discovery needs an authorized instance and source/API verification.
- Vercel/Netlify/Railway/Render/cloud provider credentials are not configured; deployment actions must remain unavailable until provider-specific permission is granted.
- No always-on worker, isolated build executor, monitoring service, queue, or Linux agent deployment target is present in this Next.js app. Real recurring monitoring and builds need a separately deployed execution plane.
- SMTP/email delivery is not configured for recovery and invitations; do not claim password recovery/invitation emails work until delivery is available and tested.
- Current checkout is `main`. Changes must be committed to a feature branch, never pushed directly to the default branch.

These blockers do not prevent local architecture and integration adapters/tests from being developed. No production infrastructure has been changed.
