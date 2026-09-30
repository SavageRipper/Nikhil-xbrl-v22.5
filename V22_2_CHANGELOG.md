# V22.2 CHANGELOG

## Defect fixes
- Fixed the V22.1 dimensional-table opening regression: `See dimensional table` now opens the horizontal modal table engine.
- Removed the legacy `The dimensional table engine is not rendered in this filing` path from the active V22.2 table-opening flow.
- Restored presentation-order table hosting: `[Table]` disclosures are anchored below their taxonomy `[abstract]` instead of being rendered in a separate section.
- Moved axis/member selectors into the popup table engine.

## Workbook parity
- Corrected the 10 workbook formula-schema discrepancies identified by the V22.1 parity audit.
- Added the missing `BreakupOfProvisions` column-M list validation.
- Added metadata-aware cross-sheet formula resolution for table-engine formulas, including current/prior source-column handling.
- Added `WORKBOOK_CROSS_SHEET_DEPENDENCY_REGISTRY.json` for the workbook's explicit inter-sheet formulas.

## Regression coverage
- Added `v22_2_ui_parity_test.mjs`.
- Added `v22_2_formula_parity_test.mjs`.
- Updated runtime version to V22.2.0.
