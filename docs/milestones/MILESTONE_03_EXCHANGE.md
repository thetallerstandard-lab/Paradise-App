# Milestone 3 — Exchange

**Status: Planned.**

## Scope

1. Create, edit, post, cancel resource requests ([RESOURCE_REQUESTS.md](../features/exchange/RESOURCE_REQUESTS.md)).
2. Request board: open requests near me, filter by kind and trade; request detail page.
3. Submit, edit, withdraw offers; accept/decline as requesting owner/admin ([OFFERS.md](../features/exchange/OFFERS.md)).
4. `accept_offer(offer_id)` Postgres function: accepts one offer, marks the request `fulfilled`, declines other pending offers — atomically.
5. Notifications for new offers and responses (email via a Workers-compatible provider; decide in this milestone).
6. Request expiry job.
7. pgTAP tests for every Exchange policy and trigger.

## Exit criteria

Two organizations can complete a request → offer → accept cycle end to end on the deployed Worker,
with the UI stating clearly that no points were transferred.
