# Transaction ledger

**Status: Planned — not part of the first release.** No tables or code exist.
`src/modules/points` is a placeholder.

## Design direction

- **Append-only, double-entry.** Every transfer writes balanced entries (debit one
  account, credit another) in one transaction. Entries are never updated or deleted;
  corrections are new reversing entries.
- **Accounts** per organization plus system accounts (issuance, fees).
- **Balances are derived** from entries (optionally cached in a table maintained by the same transaction).
- **Idempotency key** on every transfer request so retries never double-spend.
- **Atomic in Postgres.** Transfers run in a single `SECURITY DEFINER` function with row locks on the
  accounts involved, called from the server with the user's session; never from the browser directly.
- **Settlement link.** A transfer may reference the `exchange_offers.id` it settles; an offer settles at most once.
- **Audit.** Who initiated, on behalf of which organization, when, and why.

## Sketch (not final)

```
points_accounts(id, organization_id null, kind, created_at)
points_transfers(id, idempotency_key unique, offer_id null unique, initiated_by, memo, created_at)
points_entries(id, transfer_id, account_id, amount integer, created_at)
  -- sum(amount) per transfer_id = 0
```

## Before building

Answer the questions in [PARADISE_POINTS.md](PARADISE_POINTS.md), get legal review if
points have cash value, write an ADR, and plan property-based tests for balance invariants.
