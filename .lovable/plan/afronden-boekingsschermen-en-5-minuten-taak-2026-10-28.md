# Afronden: boekingsschermen en 5-minuten taak

De pagina's, de taak en `vercel.json` (`*/5 * * * *`) staan er al. De drie nieuwe pagina's staan nu ook in de lijst van pagina's van de app. Dit plan maakt het werk af dat nog openstaat.

## Stappen
1. **Typecheck**: `tsgo --noEmit` draaien en alle fouten in de boekingscode, de bevestigingspagina, `/studio/booking` en de cron-route oplossen.
2. **Studio-menu**: in het Studio-menu een link "Boekingen" naar `/studio/booking` zetten, met de bestaande menustijl en vertaalbundels (NL/EN).
3. **Huisstijl nalopen**: in de drie schermen alle vaste kleuren vervangen door de semantische tokens, en kop- en sociale metadata toevoegen aan `book.$eventTypeId` en `booking.$bookingId`.
4. **Visuele controle** (Playwright, desktop 1280 en mobiel 384):
   - De openbare boekingspagina: datum kiezen, tijdsloten bekijken, de tijdzone van de bezoeker en het formulier.
   - De bevestigingspagina: de downloadknop voor het `.ics`-bestand.
   - `/studio/booking` met een aangemaakte sessie: aanvragen met Bevestig/Wijs af/Annuleer, boekingstypes met routing (STRICT/ROUND_ROBIN/COLLECTIVE en prioriteiten) en agenda's met de sync-status.
5. **Cron-controle**: de endpoint geeft 401 zonder geldige `Bearer CRON_SECRET` en antwoordt netjes als de database of de sleutel ontbreekt.
6. **Fallbacks**: controleren dat een ontbrekende Brevo- of Stripe-sleutel in development het boeken niet blokkeert. Zonder Stripe-sleutel krijg je een duidelijke melding in plaats van een crash. Er wordt niets naar AI-diensten gestuurd.

## Beperkingen
- Zonder `DATABASE_URL` in de preview blijven de tijdsloten en de dashboarddata leeg. De schermen worden dan gecontroleerd in hun lege toestand en met foutmeldingen. De volledige flow met echte data en de betaling kan pas getest worden zodra de sleutels er zijn.
