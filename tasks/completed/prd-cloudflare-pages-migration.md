# PRD: Migrate Deployment from Azure Static Web Apps to Cloudflare Pages

## 1. Overview

**Feature Name:** Azure-to-Cloudflare Pages Migration

Migrate the VOR Blog from Azure Static Web Apps to Cloudflare Pages. This is a clean cutover — all Azure deployment artifacts will be removed and replaced with Cloudflare Pages configuration. The site's custom domain (currently on GoDaddy DNS) will be pointed to Cloudflare Pages. Cloudflare Pages has native Hugo build support, eliminating the need for a custom GitHub Actions build workflow.

**Problem:** Azure Static Web Apps adds unnecessary complexity for a simple Hugo static site. Cloudflare Pages offers a simpler deployment model with native Hugo support, unlimited free bandwidth, automatic preview deployments on PRs, and faster global edge delivery.

**Context:** The site currently deploys via a GitHub Actions workflow (`.github/workflows/azure-static-web-apps-proud-dune-0f72d5f0f.yml`) that builds Hugo and uploads the `public/` directory to Azure. Azure-specific routing and headers are configured in `staticwebapp.config.json`. The custom domain DNS is managed through GoDaddy.

## 2. Working Backlog

### Feature: Azure to Cloudflare Pages Migration

#### Phase 1: Cloudflare Configuration & Azure Removal

- [ ] **STORY-01**: As a site owner, I want Cloudflare Pages-compatible configuration files so that headers, redirects, and 404 handling work correctly on the new platform
  - **Priority**: Must-Have
  - **Acceptance Criteria**: (verified at Manual Testing checkpoint)
    - [ ] A `static/_headers` file exists with security headers (CSP, cache-control) equivalent to current `staticwebapp.config.json` global headers
    - [ ] A `static/_redirects` file exists with a 301 redirect from `voiceofrepentance.com` to `www.voiceofrepentance.com`
    - [ ] A `404.html` is served for unknown routes (Hugo + Gruvbox theme already generates this)
    - [ ] No Azure-specific configuration files remain in the repository
  - **Tasks**:
    - [ ] Create `static/_headers` file with security headers migrated from `staticwebapp.config.json`:
      - `Content-Security-Policy`: match current policy (`default-src 'self' 'unsafe-inline' 'unsafe-eval' *.googleapis.com *.gstatic.com; img-src 'self' data: *.googleapis.com *.gstatic.com; style-src 'self' 'unsafe-inline' *.googleapis.com; font-src 'self' data: *.gstatic.com;`)
      - `Cache-Control: public, max-age=3600`
      - `X-Frame-Options: DENY`
      - `X-Content-Type-Options: nosniff`
    - [ ] Create `static/_redirects` file with apex-to-www redirect:
      - `https://voiceofrepentance.com/* https://www.voiceofrepentance.com/:splat 301`
    - [ ] Delete `staticwebapp.config.json`
    - [ ] Delete `.github/workflows/azure-static-web-apps-proud-dune-0f72d5f0f.yml`
    - [ ] Local Testing: Run `hugo --minify` and verify `_headers` and `_redirects` appear in `public/` output
    - [ ] Manual Testing: CHECKPOINT — Notify user to review the deleted Azure files and new Cloudflare config files before proceeding
    - [ ] Git: Commit with message describing Azure removal and Cloudflare config addition
  - **Technical Notes**: Cloudflare Pages serves `_headers` and `_redirects` from the build output root. Hugo copies files from `static/` to `public/` at build time, so these files go in `static/`. The `/*` path in `_headers` applies headers to all routes.
  - **Blockers**: None

- [ ] **STORY-02**: As a site owner, I want the Hugo configuration updated for Cloudflare Pages so that the site builds correctly on the new platform
  - **Priority**: Must-Have
  - **Acceptance Criteria**: (verified at Manual Testing checkpoint)
    - [ ] `hugo.toml` `baseURL` is updated to `https://www.voiceofrepentance.com/`
    - [ ] A `wrangler.toml` or Cloudflare Pages project config is NOT required (Cloudflare Pages uses dashboard settings + build config, not a wrangler file)
    - [ ] Hugo builds successfully with `hugo --minify` using the updated config
    - [ ] All existing content, templates, and theme functionality remain intact after config changes
  - **Tasks**:
    - [ ] Update `baseURL` in `hugo.toml` from `https://vorblog.azurewebsites.net/` to `https://www.voiceofrepentance.com/`
    - [ ] Update `baseURL` in `config.toml` from `https://vorblog.azurewebsites.net/` to `https://www.voiceofrepentance.com/`
    - [ ] Verify build environment variables needed for Cloudflare Pages dashboard setup:
      - Build command: `npm install && hugo --minify`
      - Build output directory: `public`
      - Environment variable: `HUGO_VERSION` = `0.146.7` (or current version)
      - Environment variable: `NODE_VERSION` = `18`
    - [ ] Document the Cloudflare Pages dashboard build settings in a comment block at the top of `hugo.toml`
    - [ ] Local Testing: Run `npm install && hugo --minify` and verify the full site builds without errors; spot-check that `public/index.html` uses `https://www.voiceofrepentance.com/` as baseURL
    - [ ] Manual Testing: CHECKPOINT — Notify user to verify site builds correctly and baseURL is correct before proceeding
    - [ ] Git: Commit with message describing Hugo config updates for Cloudflare Pages
  - **Technical Notes**: Cloudflare Pages auto-detects Hugo projects but requires `HUGO_VERSION` env var to use the extended version (needed for Tailwind/PostCSS). The Go module system requires internet access during build — Cloudflare Pages supports this natively. Both `hugo.toml` and `config.toml` define `baseURL`; they must be kept in sync or consolidated.
  - **Blockers**: None

#### Phase 2: Domain & DNS Configuration

- [ ] **STORY-03**: As a site owner, I want my custom domain connected to Cloudflare Pages so that visitors reach the site at my domain
  - **Priority**: Must-Have
  - **Acceptance Criteria**: (verified at Manual Testing checkpoint)
    - [ ] Custom domain `www.voiceofrepentance.com` is added to the Cloudflare Pages project in the dashboard
    - [ ] GoDaddy DNS has a CNAME record for `www` pointing to `<project-name>.pages.dev`
    - [ ] GoDaddy has a redirect (forwarding) from `voiceofrepentance.com` to `https://www.voiceofrepentance.com`
    - [ ] Site loads correctly at `https://www.voiceofrepentance.com` over HTTPS
    - [ ] Visiting `voiceofrepentance.com` redirects to `https://www.voiceofrepentance.com`
    - [ ] The `*.pages.dev` subdomain also serves the site as a fallback
  - **Tasks**:
    - [ ] (Dashboard) Create Cloudflare Pages project: connect to GitHub repo `HacksterT/VOR-Blog`, set branch to `main`, configure build settings (build command, output dir, env vars from STORY-02)
    - [ ] (Dashboard) Trigger initial deployment and verify the site loads at `<project-name>.pages.dev`
    - [ ] (Dashboard) Add custom domain `www.voiceofrepentance.com` in Cloudflare Pages project settings → Custom Domains
    - [ ] (GoDaddy) Add CNAME record — host: `www`, target: `<project-name>.pages.dev`
    - [ ] (GoDaddy) Set up domain forwarding from `voiceofrepentance.com` to `https://www.voiceofrepentance.com` (301 permanent redirect). In GoDaddy: Domain Settings → Forwarding → add forward from `@` to `https://www.voiceofrepentance.com`
    - [ ] Verify HTTPS is working on `www.voiceofrepentance.com` (Cloudflare auto-provisions SSL certificate)
    - [ ] Verify apex redirect: `curl -I http://voiceofrepentance.com` returns 301 to `https://www.voiceofrepentance.com`
    - [ ] Manual Testing: CHECKPOINT — Notify user to verify site loads at `www.voiceofrepentance.com`, apex redirects correctly, HTTPS works, all pages render correctly
    - [ ] Git: No code changes expected — commit any doc updates if made
  - **Technical Notes**: Primary domain is `www.voiceofrepentance.com` (CNAME to Pages). Apex redirect (`voiceofrepentance.com` → `www`) is handled by GoDaddy's domain forwarding since CNAME records cannot be set on apex domains without CNAME flattening. The `_redirects` file in STORY-01 also includes an apex→www rule as a belt-and-suspenders approach, but GoDaddy forwarding handles the DNS-level redirect before traffic reaches Cloudflare.
  - **Blockers**: STORY-02 (baseURL must be correct before deploying)

- [ ] **STORY-04**: As a site owner, I want to verify the full deployment is working and clean up any remaining migration artifacts so that the migration is complete
  - **Priority**: Must-Have
  - **Acceptance Criteria**: (verified at Manual Testing checkpoint)
    - [ ] Site loads at `https://www.voiceofrepentance.com` with correct styling (Gruvbox theme, Tailwind CSS)
    - [ ] All blog posts render with Prism.js syntax highlighting
    - [ ] Sidebar displays Dr. Sybert's bio from JSON Resume data
    - [ ] Navigation menu works (Home, Posts, About)
    - [ ] Search functionality works (FlexSearch with search-index.json)
    - [ ] RSS feed is accessible
    - [ ] 404 page displays for unknown routes
    - [ ] Security headers are present (check with browser dev tools or `curl -I`)
    - [ ] Cloudflare Pages preview deployments work on PRs
    - [ ] `CLAUDE.md` is updated to reflect the new deployment platform
  - **Tasks**:
    - [ ] Verify all acceptance criteria above by visiting the live site
    - [ ] Test a PR branch to confirm Cloudflare Pages creates a preview deployment
    - [ ] Update `CLAUDE.md` — replace Azure deployment section with Cloudflare Pages info (build settings, deployment flow)
    - [ ] Update `README.md` deployment section if it references Azure
    - [ ] Remove any remaining Azure references in the codebase (search for "azure", "staticwebapp", "proud-dune")
    - [ ] Local Testing: Run `hugo --minify` one final time; grep codebase for any remaining Azure references
    - [ ] Manual Testing: CHECKPOINT — Notify user for final sign-off on the complete migration
    - [ ] Git: Commit with message describing migration completion and doc updates
  - **Technical Notes**: Cloudflare Pages automatically creates preview deployments for every PR — no additional configuration needed. The `CLAUDE.md` and `README.md` updates should reflect the simpler deployment model (no GitHub Actions workflow, Cloudflare builds natively).
  - **Blockers**: STORY-03 (domain must be configured and live)

### Unresolved Blockers

None — all blockers resolved. Domain: `www.voiceofrepentance.com` with apex redirect from `voiceofrepentance.com`.

## 3. Non-Goals

- Migrating DNS from GoDaddy to Cloudflare (only updating records, not transferring the domain)
- Adding Cloudflare Workers or serverless functions
- Changing the Hugo theme, content, or site functionality
- Setting up Cloudflare Web Analytics (can be done separately later)
- Configuring Cloudflare WAF or advanced security features

## 4. Dependencies

- **Cloudflare account** with Pages access (free tier is sufficient)
- **GitHub repo access** from Cloudflare (OAuth connection during project setup)
- **GoDaddy account access** for DNS record changes
- **Hugo Extended** available in Cloudflare Pages build environment (set via `HUGO_VERSION` env var)

## 5. Success Metrics

- Site loads at `https://www.voiceofrepentance.com` with full functionality (all acceptance criteria in STORY-04)
- Build time on Cloudflare Pages is under 2 minutes
- Zero Azure artifacts remain in the repository
- Preview deployments automatically created for PRs

## 6. Open Questions

- Should the `config.toml` and `hugo.toml` dual-config situation be consolidated during this migration, or left as-is?
- Does the user want to enable Cloudflare Web Analytics (free, privacy-friendly) as part of this migration or in a future task?
