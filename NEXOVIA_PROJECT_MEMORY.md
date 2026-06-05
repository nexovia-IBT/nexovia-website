# Nexovia Project Memory

Last updated: 2026-05-28

## Website

- Local folder: `C:\Users\orhun\Documents\Nexovia-website`
- GitHub repo: `https://github.com/nexovia-IBT/nexovia-website`
- Repository visibility: public
- Reason it is public: Vercel Hobby blocks private organization repo deployments without Pro. The website repo was checked for secrets before making public.
- Production branch: `main`
- Working branch also used locally: `clinical-evidence-latest`
- Vercel project: `nexovia-website`
- Vercel account/workspace: personal Hobby workspace, not the paid `nexovia-ibt-s-projects` team.
- Current website domain: `nexovia.pro`
- Also configured: `www.nexovia.pro`

## Website DNS

DNS is managed in Squarespace domain settings for `nexovia.pro`.

Required website records:

```txt
A      @     216.198.79.1
CNAME  www   9a7fcc9403857764.vercel-dns-017.com
```

Do not delete or modify email/MX/TXT records unless explicitly requested.

Old Squarespace website records were removed:

```txt
A      @     198.49.23.145
A      @     198.185.159.144
A      @     198.185.159.145
A      @     198.49.23.144
CNAME  www   ext-sq.squarespace.com
```

## Squarespace Backup

- The original Squarespace site was duplicated before switching the domain.
- Backup copy name: `Nexovia (Copy)`
- Backup built-in URL: `tarpon-buffalo-kx2g.squarespace.com`
- Original built-in/config site previously observed: `cardioid-hen-k3f2.squarespace.com`
- Do not delete the Squarespace backup unless explicitly requested.

## Dashboard / Platform

- Local folder: `C:\Users\orhun\Documents\nexovia-platform`
- GitHub repo: `https://github.com/gaygunorhun-beep/nexovia-platform`
- Repository visibility: private
- Default branch: `master`
- Latest confirmed commit: `a4b4c82 Preserve shipment archive folder workflow`
- Keep this repo private. Do not make it public.
- Reason: dashboard/platform contains backend routes, auth/database/Google Drive integration logic, and operational workflows.
- Keep it under the personal GitHub account so it remains compatible with Vercel Hobby private repo deployment.

## Important Deployment Rule

- Website can remain public in `nexovia-IBT` and deploy through Vercel Hobby.
- Dashboard/platform should stay private under `gaygunorhun-beep`.
- Avoid transferring Vercel projects to `nexovia-ibt-s-projects` unless the user accepts paid Vercel Pro/team billing.

