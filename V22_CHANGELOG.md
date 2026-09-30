# V22.0.0 Change Log

## Purpose

V22 fixes the taxonomy-table rendering regression introduced by the V21.3 user-facing dimension changes.

## Root cause

The taxonomy contains 92 `[Table]` definition structures across 87 unique table identifiers. A number of tables live in child definition-link roles (for example `[200600c]` for Loans and advances and `[300600a/b/c]` for Goods purchased, Manufactured and traded goods, and Work-in-progress), while their parent filing ELR presents the corresponding abstract. The previous renderer resolved dimensional concepts only against the currently displayed ELR. Consequently a valid dimensional concept could be detected as dimensional but its table ID could not be resolved, producing `The taxonomy table could not be resolved`, or could fall back to an ordinary cell.

## V22 method

- Compile every taxonomy `[Table]` from its definition tree.
- Determine the hosting filing ELR from the table's immediate depth-0 abstract presentation.
- Expose hosted child tables in the parent filing tab.
- Retain the original child role/table ID for XBRL identity and storage.
- Resolve `v15TableForConcept`, `v15TableForDimensions`, `v15RoleForFact`, and table row storage through the hosted model.
- Keep axis/member values internal; the V21.3 business-record table renderer remains in place.
- Do not add ELR-wide concept fallbacks.
- Preserve the V19 lossless context/fact store, V21 cash-flow isolation, V21.2 monetary scaling, and V21.3 conditional applicability engine.
- Migrate V21.3/V21.2/V21.1/V21/V20/V19 project keys into V22 as legacy restore keys.

## Reference cross-checks

The supplied CompuXBRL workbook contains 134 table sheets representing 87 unique table identifiers, including dedicated sheets for LoansAndAdvances, BreakupOfProvisions, RawMaterialsConsumed, GoodsPurchased, ManufacturedAndTradedGoods and WorkInProgress.

The supplied MCA-validated Infobahn PDF shows the same taxonomy pattern: tables are displayed with `[Axis]` members and `[Abstract]` / `[LineItems]`, while the business values are the line-item disclosures. The reference also demonstrates multi-row dimensional tables such as related parties and the Loans and advances table. 

## Validation status

V22 tests cover all 92 taxonomy table structures, 30 filing ELRs that host table engines, hosted child-table resolution, all target 200600/300600 tables, conditional Yes/No enforcement, six monetary presentation scales, imported dimensional reconstruction, 413/3,939 Charvak XML structure, and the supplied Infobahn Lakhs reference.

The official MCA V5.1 executable was not available in this environment, so V22 does not claim official MCA Validator execution.
