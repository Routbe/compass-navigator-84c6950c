# Roadmap
- [ ] Enterprise booking: publieke intakevragen en veilige opslag afronden
- [ ] Enterprise booking: capaciteit en uitzonderingen controleren
- [ ] Smart widget: drie vrije tijden en vooraf gekozen boekingscontext
- [ ] Nieuwe migraties uitvoeren en volledige scope/RLS-audit verifiëren
- [ ] Preview-testaccount seeden en ingelogde workspace/tabs/0 MB-upload controleren
- [ ] Nieuwe regeltests en architectuurnotities afronden
- [x] Fase 1: kleinere rondleiding-knop, Coach verkleint tot bolletje met %-ring
- [x] Fase 2: één Coach-score met checklist (verificatie + extra pagina meegeteld)
- [x] Fase 3: opslaglimiet op alle uploadpaden; video-links gevalideerd; concept/publiceren bestond al
- [x] Fase 4: Boekingen in Pagina-Wisselaar met Inhoud | Vormgeving | Statistieken
- [x] Fase 5: eigen status, API-sleutel, privacyregels, publiek endpoint
- [ ] Migratie db/106 draaien (wacht op database-sleutel; tabel wordt ook automatisch aangemaakt)
- [ ] Video-upload (Pro) naar Scaleway: wacht op opslagsleutels om te testen
- [x] Logo's Mastodon/wsocial.eu overal gelijk, naam "wsocial.eu"
- [ ] Bovenbalk-glitch in venster Live integratie toevoegen
- [ ] Snapchat-koppeling herstellen
- [ ] Mastodon rel="me" verificatie bij Identiteit
- [x] Scope-wisselaar in profielmenu op alle pagina's
- [x] Workspace publieke pagina rout.be/w/slug (slug: min 3, a-z0-9-, gereserveerde woorden)
- [ ] Links/statistieken/instellingen per scope
- [ ] Rondleiding als compact (?) icoon
- [x] typecheck + tests
- [ ] db/107 migratie draaien (wacht op database-sleutel)

## Import-ronde (okt 2026)
- [x] Project geïmporteerd, Neon gekoppeld, 801 tests groen
- [x] Testaccount test_preview@rout.be (bestond al; wachtwoord vernieuwd met --rotate) en ingelogd in preview
- [x] Ingelogde controles: workspace-switch, Pagina-Wisselaar 3 tabs, 0 MB-upload melding
- [x] Publieke boekingspagina: intakevragen + gekozen tijd uit widget end-to-end (subpagina-routes hersteld)
- [x] RLS-audit gedraaid: 79 tabellen RLS aan, 77 zonder policies, rout_app omzeilt RLS (beslissing gebruiker nodig)
- [ ] Bestanden en media toont in workspace nog persoonlijk quotum (0/500 MB)
- [ ] Links/statistieken/instellingen per scope (Studio toont persoonlijk profiel in workspace)

## RFC-001 Blueprint (wacht op goedkeuring Lead Architect)
- [x] Blauwdruk geschreven (SSOT, IdP, Identity Graph) — /mnt/documents/ROUT-Architectural-Blueprint.md
- [ ] Fase 0: migratievolgorde numeriek, signing key versleutelen + roteren, onbekende kid weigeren
- [ ] Fase 1: SSOT-opruiming, runtime-DDL bevriezen, schema-snapshot in CI
- [ ] Fase 2: identity_links + e-mail-automerge uit
- [ ] Fase 3: IdP-uitbreidingen (pairwise sub, refresh/revoke/introspect, end-session)
- [ ] Fase 4: Namespace Matrix + reserved brands, DNS-handle + badge, passkey-first login, Data Vault export/hard delete, context-menu, /studio/account vs /studio/w/$slug/settings
