# Openship Integration

## Position
Openship may serve as a deployment/infrastructure engine behind a DevCommand provider adapter. DevCommand remains operational without it and will not import/fork its whole codebase.

## Initial public API reconnaissance
Public references identify deployment routes under `/api/deployments`, including create, prepare, fetch deployment, and build-decision responses. Reported permission tags include `deployment:read` and `deployment:write`. This is preliminary route discovery only; confirm each route, payload, auth scheme, current API version, and license against the actual upstream repository/docs before implementing calls.

## Adapter requirements
- Endpoint configuration is server-side and URL-validated; credentials must be stored encrypted and never returned after save.
- Verify connection using an authenticated read-only request, then discover capabilities.
- Import only authorized projects/history/servers/databases; normalize provider records without copying provider secrets.
- Deployment requests require workspace permission and explicit production confirmation. Track pending/running/succeeded/failed/cancelled from engine responses; never infer success from request acceptance.
- Disconnect revokes/deletes stored credentials and leaves imported records with their provenance where retention is lawful.
- Handle timeout, retries, rate limits, pagination, API version changes, and redacted provider errors.

## Source and licensing
No Openship source files have been copied into this repository. Before reusing any component, inspect its source-level license and attribution/NOTICE obligations. Record reused material in `THIRD_PARTY_NOTICES.md`. Do not copy GPL code without a distribution assessment.

## Blocker
No authorized Openship instance or API credential is configured. End-to-end connectivity and deployment execution remain blocked; do not show a connected status or offer live operations until configured and tested.
