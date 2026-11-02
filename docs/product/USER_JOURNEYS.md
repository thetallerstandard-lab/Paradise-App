# User journeys

**Status: Planned.** None of these journeys are implemented.

## 1. Join Paradise (Milestone 2)

1. Contractor lands on the home page, reads the value proposition, taps **Join**.
2. Signs up with email + password (or magic link); confirms email.
3. Creates their **organization** (business name → slug suggested by `slugify`). Becomes owner.
4. Builds a **contractor profile**: trades, headline, years in business, insurance, approximate map point, service area.
5. Publishes the profile → appears on the map.

## 2. Find a contractor (Milestone 2)

1. Opens the map, centred on Lancaster County.
2. Filters by trade, pans to an area, opens a pin.
3. Views the profile; contacts them (contact method TBD: in-app message vs. phone/email reveal).

## 3. Ask for help (Milestone 3)

1. Signed-in member opens **New request**: kind, title, details, dates, location, optional point budget.
2. Saves as draft or posts as open.
3. Receives offers; an owner/admin compares and **accepts** one (others can be declined).
4. Request marked fulfilled. The agreed points are recorded; nothing transfers.

## 4. Offer help (Milestone 3)

1. Browses open requests near them.
2. Submits an offer with a point amount and message.
3. Can edit or withdraw while pending; sees accepted/declined result.

## 5. Grow the crew (later)

Owner invites an employee by email; employee joins as `member`.
