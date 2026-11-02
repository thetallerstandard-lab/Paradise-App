# Milestone 4 — Monetization

**Status: Planned.** Scope to be confirmed with the project owner.

## Candidate scope

1. **Paid plans for organizations** (`src/modules/billing`): e.g. free profile + paid tier with
   promotion, more requests, team seats. Payment provider must offer HTTP APIs and webhooks usable from
   Workers (Stripe fits); webhook signature verification with Web Crypto.
2. **Paradise Points ledger design** — answer the questions in
   [PARADISE_POINTS.md](../features/exchange/PARADISE_POINTS.md), legal review, ADR, then build the
   ledger in [TRANSACTION_LEDGER.md](../features/exchange/TRANSACTION_LEDGER.md).
3. Featured listings (bridge to Paradise Media).

## Preconditions

Network and Exchange live with real Lancaster County usage; success metrics instrumented.
