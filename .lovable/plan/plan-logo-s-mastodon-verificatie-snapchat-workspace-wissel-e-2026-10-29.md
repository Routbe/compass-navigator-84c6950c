# Plan: logo's, Mastodon-verificatie, Snapchat, workspace-wissel en volledige scheiding

## 1. Openstaand
- Migratie Live-status en video-upload naar Scaleway blijven wachten op je database- en opslagsleutels. Die vraag ik op via het beveiligde formulier.

## 2. Logo's en namen
- Overal hetzelfde officiële Mastodon-logo gebruiken, ook in Component. De footer gebruikt nu al het juiste.
- Het juiste wsocial.eu-logo ook in Component gebruiken.
- "W.social" overal hernoemen naar "wsocial.eu", in alle 4 talen.
- Icons die slecht zichtbaar zijn op licht of donker een eigen contrastkleur geven.

## 3. Fout met de bovenbalk
- Het venster "Live-integratie toevoegen" en het filter "Alles" laten de bovenbalk verspringen. Dat los ik op: de pagina blijft stil staan en de balk blijft bovenaan.

## 4. Snapchat-koppeling
- Eerst nagaan waarom het misgaat: het terugstuuradres, de sleutels of de status. Daarna herstellen en een duidelijke foutmelding tonen.

## 5. Mastodon in Identiteit
- Een nieuwe verificatie toevoegen: je zet je rout.be-link in je Mastodon-profiel met rel="me". Wij controleren dat en je krijgt een badge "Geverifieerd op Mastodon". Dit werkt naast de bestaande Bluesky-handle.

## 6. Overal van workspace wisselen
- Klik je op je profielicoon, dan zie je naast je naam een wisselknop. Daarmee kies je Persoonlijk of een van je workspaces. Dat werkt overal, niet alleen in de ontwikkelaarsomgeving.
- Ik hergebruik de bestaande workspace-keuze, zodat er niets dubbel komt.

## 7. Workspaces volledig gescheiden
- Eén centrale scope: Persoonlijk of Workspace (met rol eigenaar, beheerder of lid).
- Wissel je van scope, dan halen de ontwikkelaarsomgeving (OAuth-apps en API-sleutels), QR-codes, Profiel Hub, Studio, statistieken en instellingen meteen de juiste gegevens op. Oude gegevens blijven nooit staan.
- Elke server-vraag filtert op de scope. Persoonlijk betekent: alleen van jou en zonder workspace. Workspace betekent: alleen van die workspace, en je moet lid zijn. Dit controleert de server.
- Workspace-profiel staat op rout.be/w/naam. De naam is minstens 6 tekens en eindigt op 2 cijfers. Elke workspace krijgt een eigen QR-dashboard, eigen opslag en een eigen Profiel Hub.

## 8. Opslaglimieten en abonnementen
- Abonnementen FREE, PLUS, PRO en MAX, elk met opslag, aantal eigen domeinen, aantal teamleden en geavanceerde QR-statistieken. Dit komt in de bestaande regels voor abonnementen.
- Een gratis of niet-geverifieerde workspace krijgt 0 MB: geen eigen uploads, alleen standaardthema's. De server controleert dit bij elke upload.
- Lanceeractie: wie nu verifieert, krijgt Pro voor altijd en 1 gratis Plus-workspace. Dit staat al als regel in de database en ik vul het aan met de gratis workspace.
- Het systeem kan later ook losse verificaties en abonnementen verkopen, eenmalig of per jaar.

## Technical details
- Logo's: `src/utils/brandIcons.ts`, `integrations-catalog.ts` en de locale-bestanden. Er komt een test die controleert dat geen enkel label nog "W.social" zegt.
- Scope: een hook `useScope()` bovenop `activateScopeFromUrl` en de cookie `active_workspace_id`. Elke query-key krijgt de scope mee. Bij wisselen wordt `queryClient.clear()` aangeroepen, zoals nu al gebeurt.
- Database: Neon, met een nieuwe idempotente migratie `db/107_*`. Daarin komt `workspace_id` met index op `oauth_clients`, `api_keys`, `qr_codes` en `profile_hub_links`. Er is geen Supabase RLS, dus de filters komen in de server-functies (`workspaces.server.ts`) met een lidmaatschapscontrole.
- Abonnementen: `plans` en `plan_entitlements` in `entitlement-engine.ts`, met een `purchases`-tabel (eenmalig of jaarlijks). De trigger op `profiles.verified` maakt ook de Plus-workspace-tegoed aan.
- Workspace-naam: regel `^[a-z0-9-]{4,}[0-9]{2}$`, met een unit-test.
- Mastodon: een server-functie haalt de profielpagina op via de WebFinger/actor-API en zoekt naar rel="me" of een geverifieerd veld. Die fetch gebeurt alleen op de server.
- Tests: de nieuwe regels testen (0 MB-blokkade, scope-filter, naamregel, lanceeractie), daarna `tsgo --noEmit` en de testsuite draaien.
