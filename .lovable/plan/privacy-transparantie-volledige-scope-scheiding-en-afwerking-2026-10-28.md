# Privacy-transparantie, volledige scope-scheiding en afwerking

## Feiten die de teksten bepalen (gecontroleerd)
- Login draait op **Better Auth 1.6.23**, niet 1.7. Ik schrijf "Better Auth" zonder versienummer.
- Vrije tijden worden echt als `bit(96)` in kwartierblokken opgeslagen, met een zero-knowledge-adapter in de boekingsmotor. Die claim is dus te onderbouwen.
- Er staat **geen AGPLv3-licentiebestand** in het project. Het "open-source auditbewijs" toon ik pas als je het bestand toevoegt of bevestigt. Tot dan zeg ik niets over een licentie.
- De serverlocatie (België/EU) staat nergens vast in het project. Je hebt hier een bevestiging voor nodig (zie onderaan).
- **RLS:** de app praat met de database via één serverrol. De scheiding wordt nu in de servercode afgedwongen, niet door RLS. Ik noem het "server-afgedwongen scope-isolatie" en voeg RLS toe als extra laag in een migratie. Ik claim RLS pas als het echt actief is.
- Mijn eerdere migratie heeft hetzelfde nummer als een bestaande (`100_`). Ik hernummer hem naar `105_`.

## 1. PrivacyBadge
- Kleine badge met een schild-icoon en drie varianten: **Zero-Knowledge PII**, **Sovereign Identity** en **Zero-Trust Isolation**.
- Tikken (mobiel) of klikken (desktop) opent een popover, en op mobiel een onderblad. Daarin staan:
  - de garantie
  - "Hoe dit werkt"
  - "Wat we wél opslaan / wat we NIET opslaan"
  - een knop naar de juiste sectie op /security
- De teksten komen uit één bestand, zodat badge en Trust Center altijd hetzelfde zeggen. Er komen vertalingen in NL/EN/FR/DE.
- De badge komt op deze plekken:
  - Booking Studio (Zero-Knowledge PII)
  - publiek profiel (Sovereign Identity)
  - het toestemmingsscherm van "Login met ROUT" (Sovereign Identity)
  - de steunpagina (Sovereign Identity + de IBAN/EPC-QR-uitleg)

## 2. Trust Center op /security, plus herzien /privacy
- Er komt een nieuwe pagina /security met:
  - de drie pijlers als secties met ankers
  - een vergelijkingstabel tussen traditionele SaaS en ROUT, in algemene termen zonder claims over specifieke concurrenten
  - inklapbare "Live proof"-blokken met het echte schema van de beschikbaarheidstabel, het OAuth-scopemodel en de scope-controle
  - een datamanifest:
    - donaties gaan via EPC-QR rechtstreeks naar je bank, zonder tussenrekening
    - hoe koppelingssleutels versleuteld bewaard worden (staat al in de code)
    - de serverlocatie, alleen na jouw bevestiging
- /privacy krijgt een korte verwijzing naar het Trust Center en dezelfde termen.
- Overal waar de Studio en de instellingen een algemene "100% privé"-achtige tekst tonen, komt de juiste term.

## 3. Volledige scope-scheiding
- Alle serverfuncties van deze onderdelen gaan via één helper (`resolveScope`): Developer Console (apps en API-sleutels), QR-codes en sjablonen, links, blokken en feeds, statistieken en instellingen.
  - Persoonlijk: filter op `workspace_id is null`.
  - Workspace: exact die workspace, plus een rolcontrole.
- Tabellen die nog geen `workspace_id` hebben, krijgen die in migratie `106_`. Bestaande gegevens blijven persoonlijk.
- Per onderdeel komen er tests die aantonen dat persoonlijke en workspace-gegevens niet bij elkaar kunnen.

## 4. Uploads en Publiceren
- Alle upload-knoppen gaan via `/api/upload/presign`: profielfoto, galerij, steunpaginafoto's, QR-logo's/-bestanden en video's. Daarna bevestigt de app de upload zodat hij meetelt voor het quotum.
- Nieuwe bestanden komen eerst in een conceptmap en worden pas publiek bij Publiceren. Bij Verwerpen worden ze opgeruimd, en de opruimtaak wist achtergebleven concepten.
- Videolinks (YouTube, Vimeo, directe mp4) worden gecontroleerd en in het concept bewaard.

## 5. Vaste tabs per pagina + Plus-knop
- Inhoud | Vormgeving | Statistieken altijd zichtbaar, voor profiel, /tip, vragen/gastenboek en boekingen.
  - Inhoud toont de velden van die pagina.
  - Vormgeving geldt voor die pagina.
  - Statistieken is gefilterd op die pagina.
- In de workspace-instellingen komt de knop **"Gebruik gratis Plus Upgrade"**. Die zie je alleen met een tegoed, en hij werkt eenmalig, met een controle op de server.

## 6. Migraties en controle
- Migraties draaien via `scripts/migrate-gateway.ts`. In deze omgeving is **geen databaseverbinding aanwezig**, dus ik kan ze hier niet uitvoeren. Jij draait ze met dat script, lokaal of op Vercel, met je eigen `.env.local`.
- Daarna draai ik `tsgo --noEmit` en de volledige Vitest-suite. Ik bekijk de badge en het Trust Center op mobiel (384 px) en desktop.

## Wat ik van je nodig heb
- Bevestiging van de serverlocatie (bv. Neon eu-central / Vercel fra1) en of ROUT onder AGPLv3 valt. Zonder bevestiging laat ik die twee claims weg.
