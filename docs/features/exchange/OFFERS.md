# Offers

**Status: Planned.** Table `exchange_offers`, trigger `enforce_exchange_offer_rules`,
`exchangeOfferInputSchema` and `canTransitionOffer()` implemented, unverified.

An offer is one organization's response to another's resource request, with a
proposed **Paradise Points amount** (positive integer) and a message.

## State machine

```
pending ──withdraw (offering org member)──────────► withdrawn
   │
   ├──accept (requesting org owner/admin)─────────► accepted
   └──decline (requesting org owner/admin)────────► declined
```

All end states are final. `responded_at` is set on any transition.

## Rules (database-enforced)

- An organization cannot offer on its own request.
- Offers only on `open` requests.
- One `pending` offer per organization per request; one `accepted` offer per request.
- Only the offering organization edits amount/message, and only while `pending`.
- Visible only to members of the two organizations involved.

## What acceptance means in the MVP

The two organizations have **agreed** on a point amount. **No points move.** The
accepted offer is a record that a future ledger can settle
([TRANSACTION_LEDGER.md](TRANSACTION_LEDGER.md)). The UI must say this plainly.
