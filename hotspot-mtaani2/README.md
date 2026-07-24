# Hotspot Mtaani

Turn a WiFi connection into a business. Users sign up (Google), set up a
business profile, create hotspot packages, pay a one-time Ksh 100 setup fee
via Paystack, then land on a dashboard with an online/offline toggle.

Stack: **Next.js 14 (App Router) + TypeScript + Tailwind + Supabase (auth, db,
RLS) + Paystack**.

## What's built so far

**Step 1 — Project scaffold**
- Next.js + Tailwind configured with your brand green
- Responsive homepage matching the provided design (hero, how-it-works,
  why-choose-us, pricing, CTA, footer)
- Supabase client helpers (`lib/supabase/client.ts` for the browser,
  `lib/supabase/server.ts` for server components/route handlers)
- `middleware.ts` — refreshes the auth session and protects
  `/dashboard` and `/onboarding`
- `supabase/schema.sql` — full DB schema: `profiles`, `businesses`,
  `packages`, `payments`, with row-level security so a user can only ever
  see/edit their own data

**Step 2 — Supabase project set up** (done on your end)

**Step 3 — Login page**
- `/login` — styled after your "Create Account" design, with a single
  "Continue with Google" button (Google handles both signup and first-time
  login, so there's one screen instead of two)
- `/signup` — redirects to `/login` so any existing links keep working
- `/auth/callback/route.ts` — exchanges Google's OAuth code for a Supabase
  session, then checks whether the user already has an active business:
  sends them to `/onboarding` if not, `/dashboard` if they've already paid
  the setup fee

**Step 4 — Business Information (onboarding step 1 of 3)**
- `/onboarding` — server component, redirects to `/login` if not signed in,
  redirects to `/dashboard` if the business is already active (paid)
- `components/onboarding/setup-wizard.tsx` — the stepper header matching
  your "Hotspot Mtaani Setup" design (1-2-3 circles, connecting lines)
- `components/onboarding/business-info-step.tsx` — the real form (Business
  Name, Business Type, Location, Phone), saves via a server action
- `app/onboarding/actions.ts` — `saveBusinessInfo` upserts into
  `businesses` and advances `profiles.onboarding_step`
**Step 5 — Create Hotspot (onboarding step 2 of 3)**
- `components/onboarding/hotspot-step.tsx` — Hotspot Name + Maximum Users,
  then branches by the business type chosen in step 1:
  - **Mobile Hotspot** → Network Name (SSID), Password, Band
  - **Home WiFi** → WiFi Share Link
- `saveHotspotInfo` server action in `app/onboarding/actions.ts` updates the
  same `businesses` row and advances `profiles.onboarding_step` to `payment`
- `supabase/migrations/002_add_hotspot_fields.sql` — **run this in the
  Supabase SQL Editor before testing**, it adds the new columns
  (`hotspot_name`, `max_users`, `network_name`, `network_password`, `band`,
  `wifi_share_link`) to `businesses`
**Step 6 — Setup Payment (onboarding step 3 of 3)**
- `components/onboarding/payment-step.tsx` — loads Paystack's inline
  popup script, charges Ksh 100 in KES, offers both card and mobile money
  (M-Pesa shows under mobile money for KES transactions) — no separate
  Daraja/STK integration needed for this fee
- `app/api/payments/verify/route.ts` — after the popup reports success, this
  route independently re-verifies the transaction with Paystack using the
  secret key (amount, currency, status all checked server-side — the client
  is never trusted alone), then writes a row to `payments`, flips
  `businesses.is_active = true`, and marks `profiles.onboarding_step = 'done'`
- `lib/supabase/admin.ts` — a service-role Supabase client, used only in
  that route, since the `payments`/`businesses` RLS policies intentionally
  block client-side writes
- On success, redirects to `/dashboard` (doesn't exist yet — next step)

**Step 7 — Dashboard**
- `/dashboard` — redirects to `/login` if signed out, `/onboarding` if the
  business isn't active yet (hasn't paid)
- `components/dashboard/dashboard-view.tsx` — trimmed to what you asked for
  from your design: the Hotspot Status toggle (Active/Inactive badge +
  switch, optimistic UI with rollback on failure), a Packages panel with an
  "Add Package" button (empty state for now — packages CRUD isn't built
  yet), and Hotspot Info showing your real onboarding data (name, max
  users, location, and network name/band or WiFi share link depending on
  business type)
- `app/dashboard/actions.ts` — `toggleOnlineStatus` flips
  `businesses.is_online`, `signOut` ends the session
- Left out the stats cards (Active Users, Revenue, Earnings, Uptime) and the
  package list from your screenshot since we don't track that data yet —
  can add both once packages/end-customer payments are built

**Step 8 — Install as PWA**
- `app/manifest.ts` — Next.js auto-generates `/manifest.webmanifest` from
  this and links it automatically
- `public/icons/` — generated app icons (192, 512, maskable 512, and an
  Apple touch icon) using the brand green + wifi mark
- `public/sw.js` + `components/pwa/register-sw.tsx` — a minimal service
  worker (network-first, falls back to cache) registered app-wide; enables
  reliable install prompts on Android and basic offline resilience
- `components/dashboard/install-app-button.tsx` — a "Get the App" card on
  the dashboard. On Android/Chrome it triggers the native install prompt via
  `beforeinstallprompt`; on iOS (which doesn't support that API) it shows
  manual "Share → Add to Home Screen" instructions instead. Hides itself
  once already installed, and doesn't render at all on browsers where
  installing isn't possible (e.g. desktop Safari/Firefox)
- `app/layout.tsx` — added manifest link, apple-web-app meta tags, and
  theme color

Test it: on Android Chrome, open `/dashboard` and you should see a "Get the
App" card with a working install button (may take a page reload or two
after first deploy for Chrome to pick up the service worker). On iPhone
Safari, the button shows the manual instructions instead. Desktop Chrome
also supports installing via the icon in the address bar even if the card
doesn't show a working prompt right away.

## Not built yet

9. Deploy (Vercel + Supabase, both free tier to start)

## Local setup

```bash
npm install
cp .env.local.example .env.local   # fill in the values below
npm run dev
```

### 1. Supabase

1. Create a project at supabase.com
2. Project Settings → API → copy `Project URL` and `anon public` key into
   `NEXT_PUBLIC_SUPABASE_URL` / `NEXT_PUBLIC_SUPABASE_ANON_KEY`. Copy the
   `service_role` key into `SUPABASE_SERVICE_ROLE_KEY` (server-only, never
   expose to the browser — used later for the Paystack webhook to update
   payment status).
3. SQL Editor → paste the contents of `supabase/schema.sql` → Run.
4. Authentication → Providers → enable **Google**, add your Google OAuth
   Client ID/Secret from Google Cloud Console. Set the redirect URL Supabase
   gives you (looks like `https://<project-ref>.supabase.co/auth/v1/callback`)
   in the Google Cloud Console's Authorized redirect URIs.
5. Authentication → URL Configuration → set **Site URL** to
   `http://localhost:3000` and add `http://localhost:3000/auth/callback`
   under **Redirect URLs**. Without this, Google will log the user in but
   Supabase will refuse to redirect back to `/auth/callback`.

### 2. Paystack

1. Get your test keys from the Paystack dashboard (Settings → API Keys &
   Webhooks).
2. Put the secret key in `PAYSTACK_SECRET_KEY` (server-only) and the public
   key in `NEXT_PUBLIC_PAYSTACK_PUBLIC_KEY`.
3. Paystack supports M-Pesa as a channel for KES transactions, so the Ksh 100
   fee can be paid by card or M-Pesa from the same checkout — no separate
   Daraja integration needed for this fee.

### 3. Run it

```bash
npm run dev
```

Visit http://localhost:3000 — the homepage should match the design you sent.

## Folder structure

```
app/
  page.tsx          → homepage
  layout.tsx         → root layout, fonts, metadata
  globals.css
lib/supabase/
  client.ts           → browser Supabase client
  server.ts           → server Supabase client
supabase/
  schema.sql          → run once in Supabase SQL editor
middleware.ts         → session refresh + route protection
```
