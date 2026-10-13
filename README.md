# House builder website template

Next.js + Supabase website for a house-building business. Includes public house plans, project portfolio, contact pages, and an admin area for content, images, and company settings.

**Start here:** [setup.md](setup.md), then follow the [client deployment runbook](docs/CLIENT_SETUP.md). Do not deploy a clone with this repository's client branding, contact information, photos, or database credentials unchanged.

## Local development

1. Use Node.js 24 (see `.nvmrc`; Next.js requires at least 20.9) and run `npm ci`.
2. Copy `.env.example` to `.env.local` and fill in the new client's Supabase URL, publishable key, and site URL.
3. Provision a **new** Supabase project using the migration steps in the client setup guide.
4. Run `npm run dev` and open `http://localhost:3000`.

## Project map

| Area | Location |
| --- | --- |
| Brand defaults, contact fallback, colors, navigation | `config/site.ts` |
| Company/contact editor | `/admin/settings` |
| House and project content | `/admin/houses`, `/admin/projects` |
| Static logos and hero images | `public/assets/branding`, `public/assets/hero` |
| Supabase tables, policies, and image bucket | `supabase/migrations` |
| Environment template | `.env.example` |

Changes to content in the admin area are stored in Supabase. Code, logos, CSS, and static images require a Git commit and redeployment. Each client should have a separate Supabase project and deployment.

## Checks

Run `npm run lint` and `npm run build` before release. The first client launch also needs the manual checks in [Client setup and handover](docs/CLIENT_SETUP.md), including image rights and admin access.
