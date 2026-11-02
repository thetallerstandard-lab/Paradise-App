# User journeys

Design principle: a contractor with a phone in one hand and ten minutes between jobs. Every signed-in screen
answers "what do I do next?" with one obvious button, in trade language (business, request, offer, crew,
points), never system terms (organization, resource request, exchange offer, membership).

Navigation: **Home · Requests · My business** — bottom tab bar on phones, header tabs on desktop.
**＋ Post** joins when the Exchange ships.

## 1. Join Paradise — Implemented (live)

1. Landing page → **Join Paradise**.
2. Name, email, password (10+ characters) → 6-digit code by email → verified.
3. Onboarding, one guided flow with a progress bar (target: under 3 minutes):
   1. **Your business** — name, town, phone. Web address is chosen automatically.
   2. **Your trade** — main trade, other trades as chips, how far you travel (10/25/50 miles).
   3. **Go live** — preview exactly what others will see → **Go live** (or "finish later").
4. Home shows "You're live", a copy-link button for the public page, and **Strengthen your profile**
   (headline, years in business, insurance, licence, about) — each item jumps straight into its field.

## 2. Find a contractor — Partially implemented

Public profile pages (`/c/<slug>`) are live. The map and trade search are Milestone 2b.

## 3. Ask for help — Planned (Milestone 3)

1. **＋ Post** → pick one of four big tiles: Equipment, Labor, Materials, Subcontractor.
2. Short form with smart defaults (town from profile, "Today / This week / Pick dates", optional points) → Post.
   Target: under 60 seconds.
3. Offers arrive (email + Home card). Each offer card shows trades, years, insured badge, distance;
   **Accept** or **Decline**. Accepting reveals both phone numbers, states that no points move yet,
   and declines the other pending offers.

## 4. Offer help — Planned (Milestone 3)

Requests tab → open request → **Make an offer** (points + one-line message) → done. Withdraw while pending,
with undo. Email when accepted or declined.

## 5. Grow the crew — Later

Owner invites an employee by email; they join as a member.

## Open product decisions

1. When phone numbers show: always on the public profile (today) vs. only after an accepted offer.
2. Whether offers may be 0 points ("just helping out") — the database currently requires > 0.
3. Whether signed-out visitors can browse open requests (currently signed-in only).
