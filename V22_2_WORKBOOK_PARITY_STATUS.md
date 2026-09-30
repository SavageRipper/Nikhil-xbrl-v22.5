# V22.2 Workbook / Tool Parity Status

## Scope
This release addresses the V22.1 defects found by the CompuxBRL workbook parity audit and the reported dimensional-table UI defect.

## Fixed
- **87/87 current-year table models** retain workbook column count, labels and axis structure.
- **87/87 current-year table formula models** now match the workbook formula patterns for the 10 previously discrepant sheets:
  Table10, Table5, ClassesOfShareCapitalTable, DefinedBenefitPlans, DetailsPreproducingProprties, DetailsOfProducingProperties, DisclosrIntangibleAssets, OtherProvisions, DisclosrTangibleAssets, ChangesInReserves.
- **BreakupOfProvisions column M** now carries the workbook list-validation source `$B$4:$B$5`.
- The V22 formula evaluator no longer rejects `Sheet!Column#` references. The ClassesOfShareCapitalTable cross-sheet formulas now resolve through explicit workbook dependency metadata, including the current/prior source-column distinction.
- The workbook cross-sheet dependency registry is included as `WORKBOOK_CROSS_SHEET_DEPENDENCY_REGISTRY.json`.

## Table UX fixed
- Taxonomy `[Table]` structures are **not rendered as a separate filing section**.
- Each table is anchored to its taxonomy `[abstract]` in presentation order.
- The abstract row carries the table heading and **See dimensional table** button.
- The button opens a **modal horizontal table engine**, not an HTML dropdown/inline disclosure.
- Axis/member selectors are inside the modal table engine.
- Filing-page sequence remains taxonomy presentation order.
- Regression test confirms all **92 catalog table structures** are anchored and popup-renderable.

## Automated checks
- `tests/v22_2_ui_parity_test.mjs`: PASS — 92 catalog structures, 92 anchors, popup render, no separate table cards.
- `tests/v22_2_formula_parity_test.mjs`: PASS — formula parity, dropdown parity, cross-sheet table formula resolution.
- `tests/v22_logic_test.js`: PASS.
- `tests/v22_table_model_test.js`: PASS.
- `tests/v22_rounding_logic_test.js`: PASS.

## Important scope note
The workbook contains additional cross-sheet formulas on primary filing sheets. They are captured in the dependency registry for continued parity work. The V22.2 table-engine fix specifically closes the cross-sheet calculation gap that affected the current table formula models identified by the parity audit.
