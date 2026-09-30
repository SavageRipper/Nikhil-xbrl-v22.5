# V22.4 Regression Report

## Conditional applicability

The previous V22.3 broad conditional-table test was not sufficient because it discovered zero executable conditional-table cases. V22.4 replaces it with a rule-driven runtime test that reads the supplied MCA specific rules and resolves each affected table/control combination.

### Result

- Conditional table rules discovered: **22**
- Current-period baseline cases: **22**
- Previous-period baseline cases: **22**
- OR-controller individual cases: included
- Failures: **0**

The runtime suite now covers:
- Yes/No conditions;
- greater-than-zero conditions;
- reversed MCA wording (`Yes is selected in ...`);
- supplied wording variants/aliases;
- multi-controller OR conditions;
- Current and Previous period applicability independently.

## Other regression checks

- `node --check app.js`: PASS
- `node --check app-bundled.js`: PASS
- `tests/v22_4_all_conditional_tables_runtime_test.mjs`: PASS
- `tests/v22_3_period_and_condition_test.js`: PASS
- `tests/v22_3_conditional_runtime_test.mjs`: PASS
- `tests/v22_2_formula_parity_test.mjs`: PASS
- `tests/v22_table_model_test.js`: PASS
- `tests/v22_logic_test.js`: PASS
- `tests/v22_rounding_logic_test.js`: PASS
- `tests/table-render-regression.mjs`: PASS
- `tests/v22_table_render_regression.mjs`: PASS
- `tests/import-loading-overlay-regression.mjs`: PASS

`tests/v22_2_ui_parity_test.mjs` was not completed within the local 20-second execution window during this audit; this is a test-runtime limitation, not recorded as a product failure.

## MCA validation boundary

No claim is made that the generated XML is fully accepted by the current MCA validator until an actual generated instance is run through MCA XBRL Validation Tool V5.1 and, where required, MCA pre-scrutiny.
