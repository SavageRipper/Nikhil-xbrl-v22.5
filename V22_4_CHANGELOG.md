# V22.4 CHANGELOG

## Conditional applicability closure

- Fixed conditional-rule parsing for MCA wording where the condition is written in reverse form, e.g. `Yes is selected in "..."` / `No is selected in "..."`.
- Added explicit normalization for two supplied C&I rule-text variants:
  - `WheterThereAreContractsArrangementsTransactionsNotAtArmsLength` → the taxonomy controller with `Whether...` and `...Basis`.
  - `WhetherThereAreContractsArrangementsTransactionsAtArmslengthbasis` → the taxonomy's material-contract controller.
- Corrected multi-controller `or` conditions so the dependent table becomes applicable when any permitted controller satisfies the condition rather than requiring all controllers.
- Conditional applicability is evaluated independently for Current and Previous periods.
- Added exhaustive runtime coverage for all **22 supplied table-specific conditional rules**, producing **44 Current/Previous baseline cases** plus independent OR-controller cases.
- Related-party Yes/No control remains covered explicitly.

## Regression status

- JavaScript syntax: PASS.
- Exhaustive conditional-table runtime: PASS — 22 rules, 44 Current/Previous cases, no failures.
- V22.3 period/condition regression: PASS.
- Related-party conditional runtime: PASS.
- Workbook formula/dropdown/cross-sheet parity: PASS.
- Table model resolution: PASS.
- Rounding logic: PASS.
- Table rendering regressions: PASS.
- Import loading-overlay regression: PASS.

## XML compatibility boundary

V22.4 retains the V22.3 lossless XBRL context/fact model, taxonomy mapping, dimensions, calculations, business-rule checks and XML generation. However, a browser-side generator should not be described as **guaranteed fully MCA-compatible** until the exact generated instance is executed through the current MCA XBRL Validation Tool V5.1 and pre-scrutiny process. MCA's current portal notice states that V5.1 is the C&I/IND-AS validation tool and that the V3 schema URL is `https://www.mca.gov.in/V3XBRL/`.
