# marketplace

Paradise Exchange: resource requests (equipment rental, labor, materials,
subcontracting) and point-denominated offers on them.

- Tables: `resource_requests`, `exchange_offers`.
- Offer state rules (who may accept, decline, withdraw) are enforced in the database
  by the `enforce_exchange_offer_rules` trigger, and mirrored in `canTransitionOffer()`
  so the UI can hide impossible actions.
- An accepted offer records an agreed point amount. **No points move.** Transfers
  belong to the future `points` module and its ledger.
- Implemented: validation schemas and offer transition rules (`schemas.ts`).
- Planned (Milestone 3): request board, request detail, offer submission and responses.

Docs: [features/exchange](../../../docs/features/exchange/OVERVIEW.md)
