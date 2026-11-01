# Offer Compare Board

A property shortlist is more than an advertised price. This open-source browser board compares two to four offers using explicit closing costs, fit-out costs, area definitions and purchase-price payment milestones. Published by [NovAsia Estate](https://novasia.estate/), covering property projects and buyer research in Cambodia, Thailand and Bali.

**[Open the free live board](https://novasia.estate/tools/offer-compare/)** · [MIT licence](LICENSE) · [Report an issue](https://github.com/novasia-estate/offer-compare-board/issues)

No account or installation is needed. Select **Load synthetic example** to see a complete offer alongside one with missing costs. You can then replace the examples with your own inputs.

## A concrete decision workflow

1. Enter each original currency and price. Keep unknown fees blank; use zero only for a confirmed zero.
2. Add transfer/closing, furnishing and other upfront costs. The board distinguishes a known subtotal from a complete total.
3. Note the area definition and questions. Price per m² is useful only when those definitions match.
4. Optionally enter dated purchase-price instalments. They must add up exactly; the deadline view does not imply a payment has been made.
5. Export the comparison as CSV, save the whole board as JSON or print a decision sheet. Optional browser storage is explicit.

The included examples are synthetic. Example A has THB3,500,000 price +40,000 closing +180,000 fit-out +0 other =THB3,720,000 confirmed upfront cost. At80m² the purchase price is43,750/m². Example B deliberately leaves costs unknown. No tax rates, exchange rates, return forecasts or live availability are supplied.

## Run and modify

Open `index.html` directly, or serve this directory with any static server. No installation, API keys, network requests or runtime libraries. `node --test tests.cjs` verifies exact arithmetic, missing costs, milestone reconciliation and CSV export. Source is split into `core.js`, `app.js` and `style.css`.

Money is nonnegative, plain decimal input with at most two places and12 integer digits, evaluated using integer arithmetic. Area accepts four places. Dates2000–2100; at most60 milestones. Currency labels are syntax-checked, not a claim about legal settlement precision. Different currencies are never ranked against one another. Imported JSON is limited to100KB.

## Rebuild the single-file edition

Run `node build.cjs` to produce `standalone.html` from the three source files. This edition includes its CSS and application scripts and can be opened offline. The live board uses the same generated file.

## Contributing

Open an issue with an example input and the expected result before changing calculation rules. Keep unknown costs distinct from zero, retain original currencies, and run `npm test` for arithmetic changes. Report only synthetic inputs in public issues; do not upload client offers or personal notes.

## Related work

- [Payment Milestone Studio](https://github.com/novasia-estate/payment-milestone-studio) produces a detailed instalment calendar after a shortlist is chosen.
- [Evidence Freshness Ledger](https://gitlab.com/novasia/evidence-freshness-ledger) tracks the source and review date behind figures.
- [NovAsia Estate](https://novasia.estate/) provides the publisher's Southeast Asia property context.

Local processing does not make a downloaded file public: JSON exports can contain your notes, so share deliberately. MIT licence, no advertising SDK or telemetry.
