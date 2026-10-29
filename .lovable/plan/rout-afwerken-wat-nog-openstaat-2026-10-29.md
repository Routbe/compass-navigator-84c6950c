# ROUT: afwerken wat nog openstaat

Veel van de opdrachten bestaan al (URL-scopes, opslaglimiet, Coach-bolletje met %-ring, Boekingen in de Pagina-Wisselaar, eigen live-status). Dit plan werkt de punten af die nog openstaan of nog niet goed zijn, zonder iets dubbel te bouwen.

## 1. Logo's en namen
- Mastodon: overal hetzelfde officiële logo gebruiken als in de footer (Componenten, Live-koppelingen, Identiteit).
- wsocial.eu: het juiste logo bij Componenten, en overal "wsocial.eu" tonen in plaats van "W.social".
- Alle merkicoontjes nalopen op scherpte en contrast (licht/donker) op gsm en computer.

## 2. Storingen en koppelingen
- Venster "Live integratie toevoegen": het probleem met de bovenbalk bij "Alles" oplossen (de oorzaak eerst nagaan in de preview).
- Snapchat-koppeling: nagaan waarom die niet werkt (ontbrekende sleutels of fout in de terugkeer na inloggen) en herstellen.
- Identiteit: Mastodon toevoegen om je handle te verifiëren (een rel="me"-link op je Mastodon-profiel naar je ROUT-profiel controleren).

## 3. Workspaces wisselen overal
- Wisselen kan nu alleen in de ontwikkelaarsomgeving. Bij een klik op je profielicoontje kun je naast je naam wisselen tussen je persoonlijk account en al je workspaces, overal in de app.
- Wisselen wist de oude gegevens en opent dezelfde pagina in de gekozen scope.

## 4. Workspaces volledig gescheiden
- Eigen publieke pagina op rout.be/w/naam met een eigen Profiel Hub per workspace.
- Workspacenaam: minstens 6 tekens, waarvan 2 cijfers. Dat wordt op de server gecontroleerd.
- Links, statistieken en instellingen gesplitst per persoonlijk/workspace, net als QR-codes nu al. Eigen QR-dashboard en eigen opslag per workspace controleren.

## 5. Studio-afwerking
- Rondleidingsknop in Profielstudio kleiner en minder opvallend.
- Conversie Coach: meer concrete tips (video, CTA, extra pagina's), en het verkleinde bolletje toont de %-ring.
- Controleren dat niets publiek wordt vóór "Publiceren", ook video-links en uploads.

## 6. Controle
- Typecheck (tsgo --noEmit) en de volledige testreeks draaien, met nieuwe tests voor de naamregel en de scope-splitsing.
- Op gsm en computer screenshots maken van Studio, Boekingen, het workspace-menu en de koppelingsvensters.

## Waar het van afhangt
- De database (Neon) en opslag (Scaleway) zijn nog niet aan dit project gekoppeld. Zonder die sleutels kan ik de migraties en echte uploads niet uitvoeren of testen. Die vraag ik via een beveiligd formulier, nooit in de chat.
- Voor Snapchat zijn mogelijk Snapchat-app-sleutels nodig.

## Technisch
- Nieuwe migratie db/107_workspace_public_pages.sql (workspace-slug met CHECK op lengte/cijfers, scope-kolommen op links/stats/settings), uitgevoerd via scripts/migrate-gateway.ts.
- Bestaande scope-flow hergebruiken: activateScopeFromUrl, workspaces.server.ts, de vaste regels in entitlement-engine.
- Een nieuwe publieke route w.$slug.tsx met head()-metadata en een zichtbaarheidscontrole op de server.
