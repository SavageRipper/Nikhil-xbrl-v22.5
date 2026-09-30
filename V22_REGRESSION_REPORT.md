# V22.0.0 Regression Report

## Result

**PASS**

### V22 table-engine coverage

- Taxonomy table structures: **92**
- Unique table identifiers represented in the CompuXBRL workbook: **87**
- Filing ELRs hosting table engines: **30**
- Taxonomy tables with zero line items: **0**
- Rendered table models in the V22 table-render regression: **92/92**
- User-facing axis/member selectors exposed by the table renderer: **0**

### Reproductions fixed

- `[200600]` — Disclosure of breakup of provisions: table engine retained.
- `[200600]` — Loans and advances: child ELR `[200600c]` is now hosted in the parent filing tab and resolves correctly.
- `[300600]` — Details of raw materials consumed: table engine retained.
- `[300600]` — Details of goods purchased: child ELR `[300600a]` is now hosted and resolves correctly.
- `[300600]` — Details of manufactured and traded goods: child ELR `[300600b]` now renders as a table rather than ordinary string cells.
- `[300600]` — Details of work-in-progress: child ELR `[300600c]` now renders as a table rather than ordinary string cells.

### CompuXBRL workbook

The supplied workbook was cross-checked:

- 134 table sheets, including current/prior pairs.
- 87 unique table identifiers.
- Target table sheets and `[Table]`/`[LineItems]` headers verified for LoansAndAdvances, BreakupOfProvisions, RawMaterialsConsumed, GoodsPurchased, ManufacturedAndTradedGoods and WorkInProgress.

### MCA reference XML/PDF

- Infobahn MCA-validated XML: **2,271 INR monetary fact occurrences** inspected.
- Related-party typed identities: RelatedParty1–RelatedParty7 preserved.
- Goods purchased facts are dimension-qualified in the reference XML.
- Loans and advances facts are dimension-qualified in the reference XML.
- The PDF presents monetary values in Lakhs of INR and displays the same dimensional table structure.

### Existing regression suite

Passed:

- V22 conditional/dimensional/rounding regression.
- V22 conditional dependency unit test.
- V22 rounding logic across Actuals, Thousands, Lakhs, Millions, Crores and Billions.
- V22 hosted table model resolution.
- V22 rendering of all 92 table models.
- V22 CompuXBRL workbook cross-check.
- V18 runtime renderer: 46 filing tabs + 7 non-filing sections.
- V18 date/dimensional regression.
- V18 import loading overlay regression.
- V18 total-calculation regression: 122 calculation parents, 0 mismatches.
- V19 table-engine regression: 413 contexts, 3,939 facts, 61 typed contexts.
- XML regression: 413 contexts, 3,939 fact occurrences, 61 typed members.
- Import-table regression: 2,681 dimensional occurrences, 0 unmatched.
- V20 static regression.
- V22 smoke/general-information/UI regressions.
- JavaScript syntax checks for `app.js` and `app-bundled.js`.
- Bundled application suffix parity with `app.js`.

### Environment limitation

Python startup emitted an unrelated `artifact_tool` collaborative-document warmup warning during several test processes. The individual regression processes still returned PASS; this warning did not form part of the product assertions.

Chromium click-through testing remains unavailable in this environment because the browser GPU process is unavailable. The V22 table-render tests therefore exercise the actual renderer functions and generated HTML for all 92 taxonomy tables, plus the existing browserless runtime suite.

The official MCA V5.1 executable was not available, so no claim of external MCA Validator execution is made.
