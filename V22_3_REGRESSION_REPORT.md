# V22.3 Regression Report

## Fixed defects
- Current-year and previous-year dimensional table row creation is isolated by period.
- Current/prior table dimensions are isolated by period.
- XML fact generation reads dimensions from the selected period.
- Conditional MCA applicability is enforced for normal filing fields and dimensional tables.
- Selecting No on a controlling disclosure question disables the dependent table and prevents opening/editing it.

## Automated checks
- `node --check app.js`: PASS
- `node --check app-bundled.js`: PASS
- `tests/v22_3_period_and_condition_test.js`: PASS
- `tests/v22_3_conditional_runtime_test.mjs`: PASS (related-party No/Yes control path)
- `tests/v22_table_model_test.js`: PASS
- `tests/v22_logic_test.js`: PASS
- `tests/v22_rounding_logic_test.js`: PASS
- `tests/v22_2_ui_parity_test.mjs`: PASS
- `tests/v22_2_formula_parity_test.mjs`: PASS
- `tests/table-render-regression.mjs`: PASS
- `tests/v22_table_render_regression.mjs`: PASS after updating its expected renderer marker to the V22 popup architecture
- `tests/import-loading-overlay-regression.mjs`: PASS
- `tests/v18_date_and_dimensional_regression.mjs`: PASS
- `tests/v18_ui_regression.mjs`: PASS

Legacy V21/V18 smoke tests containing historical version assertions were not treated as product failures.
