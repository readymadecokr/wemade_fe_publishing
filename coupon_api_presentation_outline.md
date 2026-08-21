# Ragnarok Universe Coupon API Integration Guide

## Cover

Ragnarok Universe Coupon API Integration Guide

Admin Console · My Page Coupon · Game Server Reward Delivery

## Slide 1

### One Coupon Flow, Three Integration Surfaces

- Admin Console creates and operates event-based coupon campaigns.
- My Page validates a player's code, server, and character selection.
- Game Server delivers item rewards with an idempotent fulfillment workflow.

## Slide 2

### Data Model Separates Codes from Usage

- `coupons` stores event, code, validity, server scope, rewards, issue quantity, and activation.
- `couponUses` records the portal user, selected server, character, code snapshot, and usage time.
- Bonus rCoin is written to the balance and transaction ledger after successful validation.

## Slide 3

### Authentication Depends on Caller Context

- Admin procedures require `x-admin-key: username:password`.
- My Page procedures use the authenticated portal OAuth session; clients do not send a user ID.
- External services should keep admin credentials and service secrets in server-side secret management only.

## Slide 4

### Admin APIs Manage Events at Scale

- `coupons.eventSummaries` returns SQL-aggregated event summaries for large campaigns.
- `coupons.list` returns individual coupon codes with used/unused status, User ID, nickname, and usage time.
- `coupons.eventDetail`, `coupons.updateEventActive`, `coupons.delete`, and `coupons.deleteEvents` support operations.

## Slide 5

### Random Coupon Generation Uses Safe Batches

- Use `coupons.createRandomBatch` for random campaigns from 1 to 500,000 codes.
- Recommended batch size: 250 codes normally, 500 codes for campaigns of 100,000 or more.
- Persist the job ID and completed batch count; retry only batches with no successful response.

## Slide 6

### Editing Preserves Every Random Coupon Code

- `coupons.update` accepts the representative coupon ID and the campaign settings.
- For random events, rewards, dates, server scope, activation, and issue settings update across the event.
- Existing unique random codes are retained even when the edit form sends an empty code field.

## Slide 7

### Coupon Redemption Is a Server-Side Gate

- `coupon.redeem` validates code, activation, date range, usage capacity, and server scope.
- Reuse of the same code is blocked; random-event rewards are limited to one redemption per account.
- Success creates a usage record, increments the usage count, and returns the item reward payload.

## Slide 8

### Bonus rCoin Is Applied Immediately

- When `bonusRcoin` is positive, the portal increments the user Bonus rCoin balance.
- The ledger records before/after balances, the delta, game code, and the Coupon source.
- `coupon.myHistory` returns the authenticated user's Coupon Use History in newest-first order.

## Slide 9

### Game Item Delivery Must Be Idempotent

- The portal preserves `rewardItems`, but game inventory or mailbox delivery is a game-server responsibility.
- Use `couponId + userId` or the coupon-code snapshot as the idempotency key.
- Record fulfilled, failed, and retry states separately from coupon validation to enable safe recovery.

## Slide 10

### Integration Checklist

- Implement administrator authentication and authenticated player-session handling.
- Batch random generation, persist progress, and avoid retrying successful batches.
- Revalidate eligibility on the server and build a durable, idempotent game reward delivery worker.
