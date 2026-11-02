# Next steps

## Owner decisions needed before the Exchange (Milestone 3)

See the open decisions in [product/USER_JOURNEYS.md](../product/USER_JOURNEYS.md):
phone visibility, 0-point offers, public request browsing.

## Next build: Milestone 3 — Exchange

Requests tab (open requests near me, filter by kind/trade), **＋ Post** flow (4 tiles → short form),
request detail, offers (make / withdraw / accept / decline), `accept_offer()` Postgres function, Home action
cards for offers, and email notifications via Resend. See
[milestones/MILESTONE_03_EXCHANGE.md](../milestones/MILESTONE_03_EXCHANGE.md).

## Housekeeping

- Move the repo out of OneDrive (KNOWN_ISSUES #4b) — it repeatedly breaks `.next` / `.open-next` builds.
- Add `NEXT_PUBLIC_SUPABASE_*` GitHub repository secrets.
- Milestone 2b — contractor map (Mapbox token, nonce-based CSP).
