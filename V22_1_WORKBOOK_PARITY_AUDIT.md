# V22.1 CompuxBRL Workbook Parity Audit

## Scope

The supplied `charvak XBRL 31-3-26.xls` was inspected programmatically sheet-by-sheet using the converted workbook representation.

- Workbook sheets inspected: **185**
- Sheets mapped to the 47 MCA filing ELRs: **181**
- Non-filing/reference sheets: 4 (`MiscData`, `Macro_Warning`, `Main`, `TaxonomyElements`)
- Table sheet instances: **134** (including current/prior variants)
- Unique workbook table identifiers: **87**
- MCA taxonomy table structures in the supplied model/catalog: **92** (some structures reuse the same workbook table identifier)
- Workbook formula cells audited: **19,576**
- Cross-sheet formula references identified: **93**
- Table sheets containing formulas: **24**
- Taxonomy line-item coverage against the workbook: **0 missing taxonomy line items**

## Design decision

The workbook is treated as the **user-interface/column-order reference**, while the supplied MCA taxonomy and business-rule material remain authoritative for XBRL concepts, dimensions, calculations and validation.

The V22.1 table engine therefore uses the workbook's column order and labels, but maps every XBRL input column back to its taxonomy QName.

Technical workbook helper columns which do not correspond to taxonomy facts are retained as read-only helper columns where useful; they are never exported as invented XBRL facts.

## Dimensional controls

The workbook's explicit-axis selector columns are now rendered **inside the popup table engine**.

For example, `ClassificationOfBorrowingsTable` contains:

1. Classification based on time period — dropdown
2. Classification of borrowings — dropdown
3. Subclassification of borrowings — dropdown
4. Borrowings
5. Nature of security
6. Details of personal security...
7. ...

The dropdown option sets were extracted from the workbook's axis/member lists and are retained in `WORKBOOK_TABLE_SCHEMA.json`.

## Related-party / typed dimensions

The related-party table has no user-facing axis/member column in the workbook. Its typed XBRL dimension is therefore kept internal. The user enters the business columns such as related-party name, PAN, CIN, relationship and transactions; the software maintains the typed XBRL context/member identity.

## Calculation audit

The workbook contains both ordinary row formulas and cross-sheet relationships. V22.1 preserves the existing MCA calculation-linkbase engine and additionally applies workbook-derived same-table formula patterns for formula-bearing table columns.

Calculated cells are rendered read-only in the popup table engine.

Cross-sheet workbook relationships were audited separately; they are not converted into arbitrary new taxonomy facts.

## User workflow

A filing tab now presents a compact `[Table]` card with **See dimensional table**. The table opens as a horizontal modal, analogous to the CompuxBRL workbook's `<<Details>>` link to a dedicated sheet.

This prevents a 30–100 column table from creating extreme vertical scrolling and keeps the table heading and its complete columns together.
