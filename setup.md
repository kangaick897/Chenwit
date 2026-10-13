# Client Setup: Agent Entry Point

Read [the full client deployment runbook](docs/CLIENT_SETUP.md) before acting. When the owner says "read setup.md and set up the project", operate the setup rather than merely summarizing this file. Continue through every safe step until a real owner action or approval is required.

## Working contract

1. Inspect this checkout, Git remotes/status, installed tools, and existing configuration first. Do not ask for values you can verify locally. Treat statements from another chat or machine as unverified until checked here.
2. Ask for **all missing inputs for the next actionable gate in one concise message**. Do not collect domain, branding, and Supabase details up front when they do not block the current gate.
3. Default to one private repository, one new empty Supabase project, one admin account, and one deployment per client. A new client repository starts with **fresh Git history** and branch `main`; never rewrite an existing repository or force-push without explicit approval.
4. Perform reversible local setup, dependency installation, code changes, checks, and read-only verification yourself. You may commit and push to the **confirmed client repository** after reviewing the staged files for secrets and unlicensed media; first check whether a push would trigger a live deployment. Announce the target and rollback path before costly-to-reverse changes.
5. Pause for owner login/2FA, account creation, billing, secret entry, ambiguous targets, or explicit approval before SQL on an external database, production deployment, or DNS changes. Do not request passwords, service-role keys, or database credentials in chat; the owner enters them directly in the provider dashboard or an ignored local environment file.
6. Create a client-specific `SETUP_STATUS.md` from [the status template](docs/SETUP_STATUS_TEMPLATE.md). Record missing, prepared, and verified items separately with evidence. Never mark an untested external step complete because a local build passed.

The starter copy and images are not a finished client site. Only publish approved client content. The baseline SQL has **not yet been validated on a fresh Supabase project**; the runbook's test gate is mandatory before a paid-client handover.
