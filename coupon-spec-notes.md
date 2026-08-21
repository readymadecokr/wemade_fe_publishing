# Coupon System Requirement Notes

Source: `ROU_쿠폰시스템_개발요청서_v4.pdf`, pages 1–13 reviewed on 2026-08-21.

## Confirmed requirements

- All coupon creation, retrieval, and usage data needs a **Game Code**. The current selectable value is `ROU`, while the data model must remain extensible for other portal games.
- Coupon types are **Common** (one shared freely entered code) and **Random** (one-time code automatically generated in `NNNN-NNNN-NNNN` uppercase alphanumeric form). Both types can be redeemed only once per account and cannot be reused through another server character.
- Coupon data fields are Game Code, Coupon Type, Event Name, Coupon Code, validity start/end, up to five reward item pairs, server code(s), and an active `1/0` flag.
- Event name is a display and grouping value, has a maximum of 20 English bytes, and the same code can exist under different event names.
- Server codes are optional. Blank means all servers; multiple codes are comma-separated.
- Bonus rCoin is optional. Without it, up to five item rewards may be configured; with it, up to four item rewards may be configured.
- Spreadsheet upload must support insert/update by matching coupon code, with the final uploaded row values taking precedence. The planned bulk spreadsheet use case can include very large random-coupon batches.
- Coupon history must support period, account AID, and event-name filters, an item-count choice, and CSV export. The example design shows a 100-item display option.

## Implementation scope for this iteration

Implement the administrator coupon data model, CRUD/status controls, common/random coupon registration, reward validation, searchable history, and CSV export. File upload may be represented by a template download/import-ready UI where a production-scale bulk ingestion pipeline needs a dedicated asynchronous import service.
