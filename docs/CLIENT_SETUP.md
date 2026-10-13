# Client Deployment Runbook

This document is written for an AI coding agent or developer preparing **one separate website for one client**. Follow the gates in order, but complete every safe available action within a gate before asking the owner for help. Record evidence, not guesses. Read [setup.md](../setup.md) for the agent's operating contract. Do not infer hidden infrastructure or silently reuse the current client's Supabase project.

## Responsibility and stop points

| Agent handles | Owner handles or approves |
| --- | --- |
| Inspect checkout and provider connections; prepare a new client checkout; install dependencies; make reversible code/asset edits; run checks and document evidence | Create/authorize provider accounts, login and 2FA, billing, and supply approved client identity/assets |
| Set up a confirmed private Git remote, commit and push after reviewing files | Confirm the target repository and ownership; enter secrets directly into ignored local files or provider dashboards |
| Prepare SQL, explain target and rollback, perform read-only verification | Explicitly approve SQL on the named project, production deployment, and DNS changes |

Ask for missing inputs **for the next gate only, in one checklist**. Do not require domain, imagery, or hosting details to create a private repository. Stop only for a real blocker: account access, secret entry, target ambiguity, required approval, or an irreversible action. Maintain a client-specific `SETUP_STATUS.md` based on [this template](SETUP_STATUS_TEMPLATE.md); state each gate as `missing`, `prepared`, `verified`, or `blocked`. Do not put secrets in that file.

## Operating model

- Keep this repository's static images as **starter assets**. Do not remove or relocate them in the source template. In each client's copy, replace the visible logo, hero, backgrounds, and other client-specific imagery with approved files when the client provides them.
- Create a separate **private Git repository**, **Supabase project**, **admin user**, and **hosting deployment** for each client. This is a single-client template, not a multi-tenant app.
- House plans, projects, their uploaded images, admin accounts, and settings live in Supabase. Brand defaults, CSS, logo/hero paths, and static images live in Git.
- Never commit `.env.local`, service-role keys, database passwords, Supabase access tokens, customer data exports, or private media. Do not copy data from the current Chenwit Supabase project.
- Changes to a live client database, DNS, or deployment are consequential. Verify the target project/domain and obtain the owner's approval before applying SQL, production deployment, or switching DNS. Never run the baseline SQL against an existing populated database.

## Gate 0: Inspect the local checkout

Inspect `git status`, remotes, files, installed Node version, and any provider connection that is actually available. Preserve unrelated local changes. Once the client checkout exists, create `SETUP_STATUS.md` there and record known values and unknowns without blocking on later-gate fields. If the target is already a client-specific repository, inspect and preserve its history; do not reinitialize it just because this guide defaults to fresh history for **new** clients.

## Gate 1: Create a client-specific repository

If this is a new client and no target repository exists, request **one bundle**: client/site name and URL of an empty private Git repository (or ask the owner to create it). Default to a fresh history on branch `main`; ask about history only if the owner has indicated a different preference. If the remote is already configured, verify its owner/URL and whether it contains commits before doing anything to it.

For fresh history, export the template's **tracked files** into a new empty directory, initialize Git there on `main`, and connect only the confirmed empty client remote. This avoids copying or deleting the source `.git` directory. Preserve an already-initialized client repository and its changes; never force-push or rewrite history to enforce the default. Commit and push only after checking staged files for secrets, client data, and asset rights. Check whether that push triggers an existing live deployment; if it does, treat the push as a production change requiring approval. A private repository can hold starter assets during preparation, but do not make it public or deploy its Chenwit branding as the client's site.

Use Node.js 24 as pinned in `.nvmrc` (this Next.js release declares Node `>=20.9.0`). Install dependencies and prepare an ignored local environment file:

```powershell
npm ci
Copy-Item .env.example .env.local
```

Confirm `.env.example` is tracked and `.env.local` is ignored. Review the staged files before pushing; push only to the confirmed **private** client repository. Do not deploy, make the repository public, or present it as finished until asset rights and brand content have been reviewed. A raw clone still contains Chenwit-specific starter copy and images.

## Gate 2: Provision a new Supabase project in SQL Editor

Create a **new, empty Supabase project** belonging to this client. When Gate 1 is verified, ask in **one bundle** for confirmation that this is a new empty project, its project reference/URL, publishable key, admin email, and approval to apply the baseline SQL to that named project. Obtain values yourself from an authorized connection when available. The publishable key is not a server secret; never request a service-role key or password in chat. The owner can enter credentials directly in the dashboard or ignored `.env.local`.

Before the first paid-client handover, execute the baseline once against a fresh disposable Supabase project and record the project reference, template revision, results, and any fixes in `SETUP_STATUS.md`. This has **not** happened yet. Do not skip this test or silently treat the client project as the disposable test. It is fine to finish Git setup while this gate is waiting.

After confirming the target and receiving explicit approval, in **that client's** SQL Editor open each file below, copy the **entire SQL contents**, paste into a separate query, and run **in this exact order**. Confirm success after each file; do not skip ahead after an error.

1. [`20261002000000_initial_schema.sql`](../supabase/migrations/20261002000000_initial_schema.sql): seven application tables, row-level security, an empty `site_settings` row, and a default project category.
2. [`20261003000000_site_images_storage.sql`](../supabase/migrations/20261003000000_site_images_storage.sql): the public-read `site-images` bucket with admin-only writes.
3. [`20261003145445_house_kitchens.sql`](../supabase/migrations/20261003145445_house_kitchens.sql): the `houses.kitchens` column.

The baseline SQL was reconstructed from the app's current queries; it has **not** been compared with the existing Chenwit database or executed against a disposable Supabase project in this checkout. Test it on a throwaway new project before promising a paid-client handover. The existing project predates this baseline: **never run file 1 there**.

Use this read-only SQL Editor verification query after all three files:

```sql
select to_regclass('public.admin_users') as admin_users,
       to_regclass('public.site_settings') as site_settings,
       to_regclass('public.houses') as houses,
       to_regclass('public.house_floor_plans') as house_floor_plans,
       to_regclass('public.project_categories') as project_categories,
       to_regclass('public.projects') as projects,
       to_regclass('public.project_images') as project_images;

select id, public from storage.buckets where id = 'site-images';

select column_name from information_schema.columns
where table_schema = 'public' and table_name = 'houses' and column_name = 'kitchens';
```

**Pass criteria:** all seven table names are non-null, the `site-images` bucket exists with `public = true`, and `kitchens` is returned. The catalog should initially contain **no houses or projects**. Record which SQL files were applied and to which project reference.

**Migration-history caveat:** SQL Editor execution does not register these files in Supabase CLI migration history. Do not later run `supabase db push` blindly against that project; reconcile migration history and actual schema first. Apply future schema changes consistently and keep a per-client change log. Do not use `supabase db reset --linked` on a client project.

## Gate 3: Create and allowlist an admin

Create the client's admin account in Supabase Auth with the actual email address and a unique strong password. In the **same project's** SQL Editor, replace the example email and execute:

```sql
insert into public.admin_users (user_id, is_active)
select id, true from auth.users where email = 'admin@client-domain.com'
on conflict (user_id) do update set is_active = excluded.is_active;
```

Confirm exactly one account was matched/allowlisted. If the email is wrong or the user does not exist, the `insert ... select` may affect zero rows without an error. Verify explicitly:

```sql
select au.user_id, au.is_active
from public.admin_users au
join auth.users u on u.id = au.user_id
where u.email = 'admin@client-domain.com';
```

Only an active allowlisted user should access the admin area and write to the image bucket. Test a non-allowlisted account as well. Revoke access by setting `is_active = false`; do not remove records or users casually.

## Gate 4: Configure environment variables

Fill `.env.local` for development and set the same values in the new hosting project for Production (and Preview when used). Read the project URL and **publishable key** from the **new client's** Supabase project; never use a service-role key in a `NEXT_PUBLIC_*` variable.

| Variable | Required value |
| --- | --- |
| `NEXT_PUBLIC_SUPABASE_URL` | New client's Supabase project URL |
| `NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY` | New client's publishable key |
| `NEXT_PUBLIC_SITE_URL` | Canonical public origin, e.g. `https://www.client-domain.com`, with no path |
| `ADMIN_LOGIN_DOMAIN` | Optional. Enables username-only login by appending this email domain |

If `ADMIN_LOGIN_DOMAIN` is blank, log in with the **full email address**. Do not assume the template's prior admin domain or credentials apply. `NEXT_PUBLIC_SITE_URL` is used for absolute metadata URLs; set the final HTTPS domain before launch and redeploy after it changes. The app can build with a localhost fallback, but a production launch must not rely on that fallback.

## Gate 5: Rebrand the client's copy

Make only the client-specific changes below; preserve the source template's starter assets.

| What | Where |
| --- | --- |
| Company name, short brand name, subtitle, tagline, fallback contact, theme colors, logo and home-hero paths | `config/site.ts` |
| Visible logo, hero and site images | `public/assets/branding`, `public/assets/hero`; replace referenced files or change paths in `config/site.ts` |
| House-list hero background | `app/globals.css`, `--page-hero-bg` |
| Company name, phone, LINE, email, address, hours, SEO description | `/admin/settings` after admin login |
| House catalog, covers and floor plans | `/admin/houses` |
| Project categories, projects and galleries | `/admin/projects` |

Search source **and rendered pages** for `CHENWIT`, `Chenwit`, `chenwit`, `atmind`, old phone numbers, old URLs, and `LOCAL PREVIEW`. Review the homepage, listing/detail pages, about/contact pages, footer, sticky contact controls, admin login, browser titles, and mobile layout. Update fallback contact values in `config/site.ts` even when settings are saved in Supabase; these values are used when settings cannot be loaded. The original static images remain in the template, but a client's public pages must show only images they are entitled to use.

Do not claim that changing `/admin/settings` changes static logos, CSS backgrounds, or hero images. Those require a code/asset change and redeployment. Images uploaded via admin are stored in the **new client's Supabase Storage**, not committed to Git.

## Gate 6: Test locally

```powershell
npm run dev
```

Open `http://localhost:3000`, then `/admin`. Log in as the allowlisted account, save `/admin/settings`, and verify the public contact page/footer reflect it after reload. Add at least one client-owned house with a floor plan and one project with gallery images. Test create, edit, delete, publication toggles, and public visibility. Confirm reloading preserves changes and image URLs point to **this client's** `site-images` bucket. Empty listings are expected before client content is entered.

Run `npm run lint`, `npm run build`, and `npm audit --omit=dev --audit-level=critical`. A critical production-dependency finding blocks production deployment until investigated and resolved or explicitly risk-accepted by the owner; it does **not** block creating a private client repository. A successful build does **not** prove that SQL, RLS, admin login, storage permissions, DNS, or image rights work; those need the live checks above.

## Gate 7: Deploy and connect the domain

Import the client's **private repository** into a **separate Vercel project** or another Next.js-compatible host. Configure the four environment variables as applicable and deploy. Use the host's temporary URL for acceptance testing before changing DNS. Registering a domain alone does not host the app or database. Verify current commercial-use terms, limits, and pricing for the chosen hosting plan; do not assume a free plan is suitable.

Add the client's domain to the hosting project and set DNS exactly as the host instructs. Do not change DNS until the temporary deployment passes. Once HTTPS on the final domain works, set `NEXT_PUBLIC_SITE_URL` to that canonical origin and redeploy. Check navigation, contact links, titles/descriptions, social previews, and image loading. Record who owns and pays for the domain, host, and Supabase project, and who can restore access or data after handover.

## Release evidence checklist

- [ ] Private client repository; no secrets, `.env.local`, data dumps, or unlicensed media in Git
- [ ] Separate Supabase project; all three SQL files succeeded in order and read-only checks passed
- [ ] Correct admin allowlisted; unauthorized account denied
- [ ] Client brand, imagery, copy, contact channels, and social links checked on desktop/mobile
- [ ] No previous client's data or public-facing brand remains
- [ ] House/project create, edit, delete, publish, image upload, and reload tested on this client's project
- [ ] `npm run lint` and `npm run build` pass
- [ ] Deployed URL and final HTTPS domain tested; `NEXT_PUBLIC_SITE_URL` matches canonical domain
- [ ] SEO title/description, social preview, image rights, privacy/contact disclosures, backups, billing, and handover agreed

## Known limits and rollback

This template does **not** create provider accounts, import customer content, configure DNS, audit image rights, or provide a verified backup/restore workflow. The initial SQL still needs a fresh-project execution test. Until those checks pass, report the setup as **prepared, not production-verified**.

Code/asset changes can be reversed through Git and redeployed. Database writes and DNS changes need their own backup/rollback plan; do not assume a Git revert restores Supabase data or domain routing. Never test a destructive reset against a client's live project.
