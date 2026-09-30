# V22.1 Changelog

## Purpose

V22.1 corrects the dimensional-table architecture after the V22 review. The goal is to reproduce the supplied CompuxBRL workbook's user-facing table workflow while preserving the MCA C&I taxonomy/business-rule model.

### Changes

1. **Popup table engine**
   - Filing tabs no longer render complete dimensional tables inline.
   - `[Table]` entries use a compact `See dimensional table` action.
   - The action opens a horizontal modal/table engine analogous to the workbook's `<<Details>>` links.

2. **Workbook column parity**
   - All 185 workbook sheets were inspected.
   - 134 current/prior table sheet instances and 87 unique table identifiers were reconciled.
   - The 92 taxonomy table structures all map to a workbook table schema.

3. **Axis/member dropdowns**
   - Explicit axes are represented as user-facing dropdown columns inside the popup.
   - Borrowings classification now exposes:
     - Classification based on time period
     - Classification of borrowings
     - Subclassification of borrowings
   - The dropdown options come from the corresponding workbook member lists.
   - Typed dimensions remain internal and are generated/maintained by the XBRL model.

4. **Column sequence**
   - Table columns follow the CompuxBRL workbook order.
   - Taxonomy QNames remain the underlying storage/export identity.

5. **Calculations**
   - Existing MCA calculation-linkbase logic is retained.
   - Workbook-derived same-table formula patterns are carried in the table schema.
   - Calculated table cells are read-only and recalculated after input changes.

6. **Regression**
   - Added `tests/v22_1_workbook_parity.py`.
   - Added `WORKBOOK_TABLE_SCHEMA.json`.
   - Added `V22_1_WORKBOOK_PARITY_AUDIT.md`.
