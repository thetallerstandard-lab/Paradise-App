# Paradise Points

**Status: Planned.** In the MVP, points are only a **unit of denomination** on
requests (`budget_points`) and offers (`points_amount`). There are no balances,
no issuance, and no transfers.

## Intent

An internal unit that lets contractors trade equipment, labor and help without
cash at every step, and that rewards participation.

## Open product questions (must be answered before the ledger)

- How are points issued? (Sign-up grant, purchase, earned through exchanges, referrals?)
- Can points be bought or redeemed for cash? If yes, money-transmission and tax
  implications require legal review before launch.
- Can balances go negative (credit)? Limits per organization?
- Do points expire?
- Who can spend an organization's points (owners only? admins?)

## Guardrails

- Points are always whole numbers (`integer`), never floats.
- Points belong to **organizations**, not users.
- Until the ledger ships, no code may imply a balance exists.

Next: [TRANSACTION_LEDGER.md](TRANSACTION_LEDGER.md).
