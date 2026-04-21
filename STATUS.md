---
project: vor-blog
status: active
phase: Tier 4 — Features (Planned)
next_step: "Add an iCloud alias for troy.sybert@cortivus.com so Cortivus Workspace can be cancelled and Ezra can migrate to a new Workspace at voiceofrepentance.com."
blockers: []
key_people:
  - "Troy Sybert (author, operator)"
updated: 2026-04-19
---

## Next Steps

*(No checkbox-style PRDs exist in `tasks/` — items below are derived from open roadmap entries in `tasks/roadmap-site-improvements.md`)*

- [ ] 4.2.1 — Add iCloud alias for `troy.sybert@cortivus.com` (prerequisite for Workspace migration) *(source: roadmap-site-improvements.md)*
- [ ] 4.2.1 — Provision Google Workspace at `voiceofrepentance.com` for Ezra, then swap SMTP credentials *(source: roadmap-site-improvements.md)*
- [ ] 4.2.1 — Cancel Cortivus Workspace after alias is verified working *(source: roadmap-site-improvements.md)*
- [ ] 1.2 — Write substantive content for the About page (comparable narrative depth to `/selah`) *(source: roadmap-site-improvements.md)*
- [ ] 2.4 — Publish additional My Story chapters (infrastructure complete; content only) *(source: roadmap-site-improvements.md)*

## Notes

Contact pipeline (Selah + general `/contact`) is live as of 2026-04-19. Endpoint routes through AILS Cloudflare tunnel → NGINX → Ezra `/api/vor/contact`, writes SQLite CRM, composes/sends welcome email via Ezra's agent graph, fires Telegram alert. NGINX config on the Mac Mini is now symlinked to `Selah/deployment/mac-mini/nginx-selah.conf` — no more config drift.
