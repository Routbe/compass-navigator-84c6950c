# Studio perfectioneren: scope, rechten, opslag en pagina-structuur

Dit is veel werk; ik voer het uit in 5 fasen, elk afgesloten met `tsgo --noEmit` en een controle in het voorbeeld.

## Fase 1 — Snelle UI-verbeteringen
- **Rondleiding-knop** in Profielstudio: van grote knop naar een klein icoon (vraagteken) in de kopbalk, met tooltip "Rondleiding opnieuw".
- **Conversie Coach**: als de popup is ingeklapt, wordt het een rond bolletje met een voortgangsring eronder/rond (percentage voltooid). Uitgeklapt: duidelijkere volgende stap, afvinken, en directe "Ga naar"-knop per tip.
- **Publiceren-model**: alle wijzigingen in de Studio blijven een concept tot je op **Publiceren** klikt. Een balk toont "Niet-gepubliceerde wijzigingen" met Publiceren / Verwerpen. Ik controleer alle bewerk-panelen op plekken die nu direct live opslaan en zet die om.
- **Video's via link en uploads**: links (YouTube, Vimeo, directe mp4) worden gecontroleerd en correct bewaard; uploads gaan via onze eigen opslag en worden pas live bij Publiceren.

## Fase 2 — Extra pagina's en uniforme tabs
- Instellingen: "Steunpagina en donaties" wordt **"Extra pagina's"** met alleen een lijst: Steunpagina (/tip), Vragen/Gastenboek (/qna), Boekingen (/book) — elk met Actief-schakelaar en Bekijk-link.
- Tabbalk **Inhoud | Vormgeving | Statistieken** is altijd zichtbaar, ongeacht de gekozen pagina bovenaan.
- **Inhoud** past zich aan per pagina:
  - Profiel: profielgegevens, live-status, links en blokken, favorieten
  - Steunpagina: IBAN/rekeninghouder, vaste bedragen, boodschap, foto's, betaalmethodes, externe steunlinks (verhuisd uit Instellingen)
  - Vragen/Gastenboek: inkomende vragen, antwoord-editor, gepinde verhalen
  - Boekingen: boekingstypes, beschikbaarheid, gekoppelde agenda's (bestaand boekingsdashboard ingebouwd)
- **Vormgeving** en **Statistieken** gelden alleen voor de gekozen pagina (bv. bezoekers en donaties van /tip).
- Wisselen van pagina bewaart de keuze in de adresbalk zodat herladen op dezelfde plek blijft.

## Fase 3 — Scope in de adresbalk
- Nieuwe adressen: `/studio/personal/<onderdeel>` en `/studio/w/<workspace>/<onderdeel>` (ook dev-console, QR, links, statistieken, instellingen).
- Oude adressen sturen automatisch door naar de persoonlijke variant.
- Wisselen in de kopbalk-wisselaar wist alle tijdelijk opgeslagen gegevens in de browser en gaat naar het juiste adres.

## Fase 4 — Server-afgedwongen scheiding
- Eén centrale controle die bij elk verzoek de scope uit het adres valideert tegen de rol van de ingelogde gebruiker.
- Alle zoekopdrachten voor apps, QR-codes, links, statistieken en instellingen filteren op: persoonlijk = geen workspace, workspace = exact die workspace. Ik loop alle bestaande functies na en vervang losse `user_id`-filters.
- Een kleine testset bewijst dat persoonlijke en workspace-gegevens niet bij elkaar kunnen.

## Fase 5 — Rechten-motor, opslaglimiet en vroege-verificatie-actie
- Nieuwe tabel `entitlement_overrides` (id, scope_type, scope_id, entitlement_key, value, granted_by, created_at) + kolom `is_early_verified`.
- De bestaande rechtenlogica wordt uitgebreid tot één service die plan + overrides per scope bepaalt (limieten en functies).
- Bij verificatie: `is_early_verified = true`, `PRO_FOR_LIFE` op het persoonlijke account, en één `INCLUDED_PLUS_WORKSPACE` tegoed om één workspace gratis naar Plus te zetten (eenmalig in te zetten, met knop in workspace-instellingen).
- **`/api/upload/presign`**: controleert scope, plan en overrides vóór er een upload-link komt. Ongeverifieerde/Free workspaces hebben 0 MB en krijgen `403 Storage Quota Exceeded`. Alle bestaande upload-knoppen gaan via dit endpoint.
- Tests voor: 0 MB-weigering, PRO_FOR_LIFE toekenning, Plus-tegoed maar één keer bruikbaar.

## Technische details
- Routes: `_authenticated/studio.personal.$feature.tsx` en `studio.w.$workspaceSlug.$feature.tsx`; scope-resolver in `src/lib/scope.server.ts` (vervangt de HttpOnly `active_workspace_id`-cookie als bron van waarheid, cookie blijft enkel als standaard), `AGENTS.md`-regel wordt vervangen.
- Migraties als idempotente `db/NN_*.sql`, uitgevoerd met `scripts/migrate-gateway.ts`; uitbreiding van `entitlement.server.ts`.
- Presign via de bestaande opslagprovider in `assets.server.ts`; concept-media in een draft-prefix, bij Publiceren gepromoveerd, opruim-cron verwijdert verweesde concepten.
- Pagina-context als zoekparameter `?page=profile|tip|qna|book&tab=content|design|stats`.

## Beperkingen
- Zonder de databasesleutel in deze preview kan ik de ingelogde flows (publiceren, uploads, scheiding, verificatie-actie) niet echt doorlopen; ik controleer types, tests en de schermen die zonder login werken, en meld wat niet is getest.
