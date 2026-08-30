# The Surf Society

Rental & membership site for The Surf Society — customer, staff, and admin views in one app.

This is a Phase 1 port of the original single-file HTML sandbox prototype into a real Vite + React +
TypeScript + Tailwind project with client-side routing. **All data is still in-memory mock data** —
there is no backend yet. See [Phase 2](#phase-2--what-real-functionality-needs) below for what's needed
to make it real.

## What's real vs. still mocked

| Area | Status |
|---|---|
| Visual design, copy, layout | Real — ported 1:1 from the prototype |
| Routing (`/membership`, `/staff/board-wall`, `/admin/inventory`, etc.) | Real — each view/tab is an actual URL via `react-router` |
| Role switcher (Customer / Staff / Admin) | Real UI, but **not access-controlled** — anyone can click into Staff or Admin, there's no login |
| Board check-in / check-out, activity feed | Real interactions, but **in-memory only** — resets on page refresh |
| Admin inventory + "add board" + photo upload preview | Real UI and interaction; photo is held as a base64 data URL in memory, never uploaded/stored anywhere |
| Membership tiers, join flow, QR code | Real UI. QR code is generated client-side with the [`qrcode`](https://www.npmjs.com/package/qrcode) npm package (no third-party API call) |
| Reviews (read + write) | Real UI, in-memory only |
| Member "payment status," billing history, "amount due" | **Fully fake.** No payment processor is involved. See Billing below |
| Sign-in (customer demo picker) | A dropdown that lets you preview any mock member's account — not real authentication |

Every page still shows the original prototype's footer disclaimer: *"Sandbox build for internal
review — no real bookings, payments, or accounts are processed here."*

Refreshing the page resets all state (new boards, new members, checked-out boards, reviews you added,
etc. all revert to the mock defaults in [`src/lib/mockData.ts`](src/lib/mockData.ts)).

## Running locally

Requires Node 18+.

```bash
npm install
npm run dev
```

Then open the printed local URL (default `http://localhost:5173`). Other scripts:

```bash
npm run build     # type-check + production build to dist/
npm run preview   # serve the production build locally
npm run lint      # oxlint
```

## Project structure

```
src/
  components/       # Layout (topbar/subnav/footer), shared UI primitives, Slideshow, QrCode
  pages/
    customer/       # Home, Rentals, Membership, Reviews, Join, Account
    staff/          # BoardWall, MemberCheckIn
    admin/          # Inventory, Members
  state/AppState.tsx  # single React Context holding all mock data + actions
  lib/                # types, mock data, date formatting, placeholder board SVG
```

Routes (all under one `Layout`, role is inferred from the URL):

- Customer: `/`, `/rentals`, `/membership`, `/reviews`, `/join`, `/account`
- Staff: `/staff/board-wall`, `/staff/check-in`
- Admin: `/admin/inventory`, `/admin/members`

## Deployment

Deployed on Vercel with automatic deploys on push to `main` (see the PR/commit for the live URL).
Vercel builds with `npm run build` and serves `dist/`; `vercel.json` adds an SPA rewrite so client-side
routes (e.g. a hard refresh on `/staff/board-wall`) resolve correctly instead of 404ing.

## Phase 2 — what real functionality needs

Phase 1 intentionally ships with **no backend**. Here's what's scaffolded for and what you'd need to
set up to make each piece real:

### Auth (customer / staff / admin roles)

Nothing is implemented yet — the role switcher is just a UI toggle with no access control. Recommended:
**Supabase Auth** (simplest if pairing with Supabase for data/storage below) or **Clerk** (if you want
polished hosted UI + org/role management out of the box).

What you'd set up:
- An account with whichever provider you pick, plus a project/application in their dashboard.
- Environment variables (e.g. `VITE_SUPABASE_URL`, `VITE_SUPABASE_ANON_KEY`, or Clerk's publishable/secret
  keys) added locally (`.env.local`) and in Vercel's project settings.
- A `role` claim per user (custom claim in Supabase, or Clerk's organizations/roles) so `/staff/*` and
  `/admin/*` routes can be gated with a route guard component, and the role switcher becomes "sign in as
  this role" instead of a free toggle.

### Data + photos (boards, members, reviews)

Recommended default: **Supabase Postgres + Storage** — pairs naturally with Supabase Auth above, and
gets you a hosted Postgres database plus an S3-compatible file store in one product.

What you'd set up:
- A Supabase project (free tier is fine to start).
- Tables roughly matching `src/lib/types.ts` (`boards`, `members`, `reviews`, `activity`), with row-level
  security policies so staff/admin actions require the right role.
- A Storage bucket for board photos; the admin "Add board" photo upload would upload the file to that
  bucket and store the resulting public URL instead of a base64 data URL in memory.
- `src/state/AppState.tsx` gets rewritten to fetch/subscribe from Supabase instead of holding
  `useState` mock arrays — the component API (`useAppState()`) can mostly stay the same shape so pages
  don't need to change much.

### Billing

**Everything billing-related in this app is currently fake** — `paymentStatus`, `nextBilling`, `amount`,
and billing history are hardcoded mock fields with no payment processor behind them. Do not treat any of
it as real financial data.

To make it real: **Stripe** (Billing + Customer Portal + webhooks) should become the source of truth.
That means:
- A Stripe account, products/prices for each membership tier (Swell/Local/Society).
- Stripe Customer Portal configured so members can update payment methods themselves (replacing the
  fake "Update payment method" button).
- A webhook endpoint (e.g. a Supabase Edge Function or a small serverless function) that listens for
  `invoice.paid` / `invoice.payment_failed` / `customer.subscription.updated` etc. and writes the
  resulting status into your `members` table — the app should read billing status from your database,
  which is synced from Stripe via webhooks, not compute it locally.

### QR code

Already done in Phase 1 — the Join page generates its QR code client-side with the `qrcode` npm
package (`src/components/QrCode.tsx`) instead of calling the third-party `api.qrserver.com` image API
the original prototype used. No further work needed here unless you want the encoded URL to point at a
real signup page once one exists.
