# V22.1 Regression Report

## Status

**PASS — V22.1 table-engine/workbook parity regression**

### Workbook reconciliation

- 185 workbook sheets inspected.
- 181 mapped to the 47 MCA filing ELRs.
- 134 current/prior table sheet instances.
- 87 unique workbook table identifiers.
- 92 taxonomy table structures in the supplied taxonomy table catalog.
- 0 taxonomy line-item omissions when reconciled against workbook table columns.
- 19,576 workbook formula cells audited.
- 93 cross-sheet formula references identified.
- 24 table sheets contain formula-bearing columns.
- 87 table schemas embedded in the application.

### Runtime renderer

`tests/v22_1_runtime.mjs`:

- 47/47 taxonomy ELRs rendered through the browserless runtime renderer.
- All resolved table models opened through the V22.1 popup table renderer.
- Borrowings classification table verified.
- Loans and advances table verified.
- Goods purchased table verified.
- Raw materials consumed table verified.
- Manufactured and traded goods table verified.
- Work-in-progress table verified.
- Borrowings has 3 axis selector columns.
- Dropdown option cardinalities verified:
  - time period: 2
  - classification of borrowings: 40
  - subclassification/security: 2
- Popup table column order comes from the supplied CompuxBRL schema.

### Retained regressions

- V22 conditional dependency test: PASS.
- Six-scale rounding test: PASS.
- V19 lossless XBRL table regression: PASS — 413 contexts / 3,939 facts / 61 typed contexts.
- V18 calculation regression: PASS — 122 calculation-parent checks, 0 mismatches.
- XML regression: PASS — 413 contexts / 3,939 fact occurrences / 61 typed members.
- CompuXBRL workbook cross-check: PASS — 134 table sheets / 87 unique table identifiers.
- Node syntax checks: PASS for `app.js` and `app-bundled.js`.

### Reference-data integrity

The bundled MCA taxonomy data remains the same V22 taxonomy/business-rule dataset:

- C&I Taxonomy 2016 V1.2 / 31-03-2016
- C&I Business Rules V1.3 / 06-08-2016
- 47 ELRs
- 3,616 taxonomy elements
- 4,092 presentation relationships
- 1,051 calculation relationships
- 2,967 definition relationships

### Environment note

Python spreadsheet tests emit an existing environment-level `artifact_tool` collaborative-document warmup traceback during interpreter startup. The tests themselves return exit code 0 and print their PASS markers. This warning is not treated as a product regression.

Actual MCA Validation Tool V5.1 execution was not performed because its executable is not available in this environment. The supplied `charvak_1.xml` regression remains a structural/XBRL regression, not an official MCA validator execution.
