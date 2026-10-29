# ROUT afwerken: Studio, opslag, Conversie Coach, Boekingen en Live-status

Dit is veel werk. Daarom doen we het in vijf fasen, in deze volgorde. Na elke fase draaien de typecheck en de tests. Bij de eerste stap bekijk ik hoe elk onderdeel nu werkt. Waar al iets bestaat (scope in de URL, entitlement engine, presign), bouwen we daarop verder in plaats van het opnieuw te schrijven.

## Fase 1 — Snelle UI-fixes in de Profielstudio
- De knop om de rondleiding opnieuw te starten wordt een klein (?)-icoon naast de Pagina-Wisselaar. Daar staat ook de tip "Snel wisselen: klik op je profielkaartje bovenaan...".
- Conversie Coach als zwevend venster: verklein je het tot een bolletje, dan blijft een ring met het voltooiingspercentage zichtbaar. Tik erop om het venster weer te openen.
- Alles nakijken op gsm (384px) en desktop, met schermafbeeldingen.

## Fase 2 — Conversie Coach (volledig lokaal, zonder AI)
- `analyzePageConversion(pageData)` geeft vaste regels terug, elk met een gewicht, een status en een concrete tip:
  bio, avatar, 3-7 actieve links, een primaire CTA, verificatiebadge, gekoppelde steunpagina of boekingen, live-status en thema-contrast.
- Werkt per paginatype (profiel, /tip, /qna, /booking) met eigen regels.
- De ring en de checklist werken direct bij terwijl je bewerkt. Er gaan geen gegevens naar externe diensten.
- Elk regelgewicht en elke drempel krijgt een unit test.

## Fase 3 — Opslag en Concept/Publiceren
- Alle uploads (afbeeldingen, badges, video's, QR-media) lopen verplicht via `/api/upload/presign`, naar Scaleway. Gratis of ongeverifieerde workspaces krijgen `403 Storage Quota Exceeded`.
- Video's via een link: we controleren de link (een toegelaten host of een direct bestand). Op publieke pagina's laden ze via onze proxy of als opgeslagen kopie, nooit rechtstreeks bij een derde partij.
- Concept/Publiceren: alle bewerkingen gaan naar een concept. Publieke pagina's lezen alleen de gepubliceerde versie. "Publiceren" zet het concept in één stap over.
- Uploads blijven privé tot je publiceert.
- Tests: presign weigert bij 0 MB, en een publieke pagina toont nooit het concept.

## Fase 4 — Boekingen in de Pagina-Wisselaar
- Het losse `/studio/bookings`-scherm verdwijnt. Een omleiding stuurt oude links naar de Pagina-Wisselaar met "Boekingen" gekozen.
- Je zet Boekingen aan via het Boekingen-blok of via "Extra pagina's". Dat activeert `rout.be/[gebruiker]/booking` en voegt het toe aan de wisselaar.
- De vaste tabs Inhoud | Vormgeving | Statistieken:
  - Inhoud heeft subtabs: Afspraken, Boekingstypes, Beschikbaarheid en Agenda's.
  - Vormgeving geldt alleen voor de /booking-pagina.
  - Statistieken: weergaven, geboekte slots, conversie en Stripe-inkomsten.
- Het blok op je hoofdprofiel wordt een strakke knop naar /booking.
- De layout krijgt een nieuw ontwerp voor gsm en desktop.

## Fase 5 — Live-status engine
- Tokens van Spotify, Last.fm en Twitch worden versleuteld opgeslagen met AES-256-GCM. De status wordt op de server ververst en gecachet (TTL standaard 15 s).
- Publieke endpoints: `/api/public/presence/[handle]` en een SSE-stream op `/stream`. Die pusht alleen bij een wijziging en respecteert de zichtbaarheid van het profiel.
- `POST /api/v1/presence` met een `presence_api_key` per gebruiker. Je kunt de sleutel aanmaken en intrekken in de Studio. De invoer wordt gecontroleerd met Zod en heeft een rate limit.
- Privacyregels: stealth-uren en -dagen, een filter voor expliciete nummers en automatisch vervallen.
- SSR zet de laatst bekende status direct in de profielpagina.
- Tests voor stealth, vervallen en de API-sleutel.

## Technisch
- Migraties komen als `db/NN_*.sql` en draaien via `scripts/migrate-gateway.ts`. Dat lukt pas met je database-sleutel, die ik via het beveiligde formulier vraag en nooit via de chat.
- Bij elke fase worden de scope-regels server-side gecontroleerd.

## Wat ik niet kan testen zonder je sleutels
Neon, Scaleway, Stripe en de koppelingen met streamingdiensten. Zonder die sleutels test ik alleen de logica en de schermen.
