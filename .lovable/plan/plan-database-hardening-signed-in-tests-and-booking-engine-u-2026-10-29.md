# Plan: Database hardening, signed-in tests, and booking engine upgrade

## Part A — Database hardening

1. **Shadowban fix (new file, never edit old ones)**
   - Compare the live database with `db/91_shadowban.sql` and put only the missing pieces (columns, indexes, functions) in a new `db/108_shadowban_fix.sql`. Every step is safe to run again.
   - Add a rule to AGENTS.md: migrations that have already run are never edited. Changes always go in a new numbered file.

2. **Access audit for all tables**
   - Add `scripts/audit-rls.ts`. It lists every public table with a `user_id`, `owner_id` or `workspace_id` column and reports for each one: whether row security is on, which policies exist, and whether those policies are tied to the owner or workspace member.
   - Note: this app reaches Neon through the server as `rout_app`, not straight from the browser. So the server checks stay the main safeguard, and row security is an extra layer.
   - `db/109_rls_audit_fix.sql` closes the gaps the audit finds: it turns row security on and adds owner/workspace-member policies (using session settings `app.user_id` / `app.workspace_id` where the server sets them). If adding those policies would block current server queries, the fix is limited to removing unneeded `rout_app` permissions, and the remaining tables are listed in the report.
   - Add a test that fails if a new table with those columns has no policy.

3. **Test account**
   - Add `scripts/seed-test-user.ts`. It creates `test_preview@rout.be` through Better Auth's own sign-up (normal password hashing) with a strong random password, which is kept only in a local file under `/tmp`. Then it sets the email as verified, plus `verified` / early-verified on the profile. The script fails in production mode.

## Part B — Signed-in checks (Playwright)
- Sign in as the test account.
- Create a workspace, then switch between `/studio/personal/...` and `/studio/w/<slug>/...`.
- Check that Links, QR, Settings and Dev Console show separate data in each scope.
- Page switcher: check the main profile, the support page and bookings, and that the Content, Design and Stats tabs follow the chosen context.
- Upload in an unverified workspace: the 0 MB block must show a clear message ("Opslaglimiet bereikt", from a 403 with code `storage_quota_exceeded`), not a crash. Fix this if it isn't the case now.
- Take screenshots on phone and desktop sizes, and fix any problems found.

## Part C — Booking engine

1. **Intake forms per booking type** (`db/110_booking_custom_fields.sql`)
   - Add `booking_event_types.custom_fields jsonb default '[]'`. Each field has an id, label, type (text/textarea/select/checkbox/phone), whether it's required, its options, and a "sensitive" flag.
   - Add `bookings.intake_answers jsonb`, checked on the server against the fields' definitions (types, required fields, length limits).
   - Sensitive answers are encrypted with AES-GCM before they're stored (key `BOOKING_INTAKE_KEY`, falling back to a key derived from the auth secret). They're never logged and never sent to an outside AI. Only the host sees them, in Studio. Add the key to ENVIRONMENT.md.
   - Studio: a field editor inside the booking type editor.
   - Public `/booking` page: the fields appear after a time slot is chosen.

2. **Capacity and exceptions**
   - Add `booking_event_types.resource_capacity int default 1 check (>=1 and <=100)`.
   - Availability and booking logic: a slot stays open while the number of confirmed or pending bookings is below capacity. The check happens inside the booking transaction, with an advisory lock per type and slot, so two people can't overbook at the same moment.
   - Add tests for capacity 1, capacity 3, and two bookings arriving at once.
   - Exceptions: the `availability_overrides` table already exists. Add a Studio section "Uitzonderingen" next to the weekly hours: date ranges (for example, holiday from 1 to 15 August), whole days off or different hours. Saving them recalculates the availability cache.

3. **Smart Booking widget**
   - Booking component under Links & Components: new options "Toon eerstvolgende slots" and which booking type to use.
   - A public server function reads the next 3 slots from `availability_cache`, cached for a short time and only for public profiles.
   - Clicking the widget or a slot goes to `/$username/booking` through a normal in-app link (no page reload), with `?type=&slot=` in the address. The booking page then opens with that type and slot already chosen.
   - The draft/publish rule still applies: widget settings only go live after Publiceren.

## Finishing
- Run all migrations (108–110) through `scripts/migrate-gateway.ts` as the owner account.
- Run the type check (`tsgo --noEmit`) and the full Vitest suite.
- Update AGENTS.md (migration rule, capacity locking, intake encryption) and ENVIRONMENT.md.
- Report what was checked on screen and what wasn't.
