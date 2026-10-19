# Prime duties (prime only)

The prime carries the duties no peer carries: the daily maintenance item and being the fleet's anchor reference. Peers never read this file — unless the prime is clearly dead and the user has explicitly asked them to take over; then follow it the way a prime would.

## MAINTENANCE (max 1 item per calendar day, across all pools)

- Run ONE concrete item per calendar day: pick from the maintenance backlog (open issues labeled 'maintenance') an item not already covered by an open PR, and run it through the normal worker flow. The reserve provider, if one was designated, is allowed here. Never more than one per calendar day, overall — note the date + issue in .foreman/state.md when you run it.
- Keep the check in your dispatch cycle: once per dispatch, run the item if one is due and none has run today; otherwise leave it in the backlog.
- Peer reading this after a takeover: same rules — one item, then go back to skipping.

## Anchor reference

- Your hourly anchor minute (the minute this thread was created) is the fleet's offset reference: when the user starts a new peer thread, tell them your anchor minute so they place it at least ~10 minutes away (soft rule; the claim protocol tolerates overlap).
