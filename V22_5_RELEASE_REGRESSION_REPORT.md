# V22.5.0 CHANGELOG / RELEASE REGRESSION REPORT

## Scope

V22.5 is the release-hardening pass over V22.4. The objective is to remove the remaining P0/P1 defects identified in the V22.4 audit while retaining the existing scaling, applicability, calculation, cash-flow and horizontal-table engines.

## MCA authority inventory

Source package supplied for this release:

- C&I Taxonomy 2016 V1.2 / 31-03-2016
- C&I Business Rules V1.3
- MCA C&I Filing Manual V4.0
- Supplied CompuxBRL workbook
- MCA-validated/reference XBRL instances

The taxonomy definition source was independently inventoried during the build:

| Definition control | Count |
|---|---:|
| `all` hypercube relationships | 92 |
| `notAll` relationships | 74 |
| dimension-default relationships | 45 |
| typed-domain elements | 44 |
| taxonomy table models | 92 |

## V22.4 defects addressed

### Fixed

- Duplicate unguarded dimensional-table opener removed.
- Table applicability is now enforced by the actual UI entry button.
- Typed-axis UI moved into the horizontal table engine.
- Typed members serialize as `xbrldi:typedMember`.
- Typed member values participate in context identity.
- Imported context IDs are collision-safe and retain source IDs.
- Imported prior-year ordinary facts synchronize their canonical occurrence when edited.
- Source decimals remain associated with imported occurrences/table rows.
- MCA definition `all`/`notAll`/default constraints are embedded in the release and used by the generated-instance structural gate.
- Default members are excluded from explicit selector options and explicit default serialization is blocked.
- Advanced rule evaluator adds conditional blanking, alternative mandatory fields, equality/matching, relational, positive-value, date-sequencing and repetitive-dimensional uniqueness checks.
- Stale V22.2/V22.3 release assertions were replaced by V22.5 release checks.
- Bundled runtime was repaired so its canonical `factsForGeneration()` and `ensureBaseContexts()` functions are present and the V22.5 typed/context changes are included.

### Retained

- Six financial presentation scales.
- Canonical values separate from presentation scale.
- Direct/indirect cash-flow isolation.
- Calculation-linkbase and workbook formula/cross-sheet logic.
- Current/prior independent table rows and dimensions.
- Taxonomy-driven 92-table catalog.
- Local browser persistence/project export.
- Internal XML structural gate.

## Regression evidence

Executed successfully:

1. `tests/v22_5_release_regression.py`
2. `tests/v22_smoke.mjs`
3. `tests/v22_general_info.mjs`
4. `tests/v22_4_all_conditional_tables_runtime_test.mjs`
5. `tests/v22_2_formula_parity_test.mjs`
6. `tests/v22_rounding_logic_test.js`
7. `tests/v22_table_model_test.js`
8. `tests/v22_3_conditional_runtime_test.mjs`
9. `tests/v22_3_period_and_condition_test.js`
10. `tests/v22_2_ui_parity_test.mjs`
11. `tests/xml-regression.py /mnt/data/charvak_1.xml`

Observed results:

- all 92 taxonomy table models available;
- all 92 definition `all` controls loaded;
- all 74 `notAll` controls loaded;
- all 45 dimension defaults loaded;
- 44 typed-domain elements loaded;
- golden reference XML: 413 contexts / 3,939 fact occurrences / 61 typed-member contexts;
- conditional runtime: 22 rules × 2 periods = 44 cases, 0 failures;
- formula parity: pass;
- dropdown parity: pass;
- cross-sheet parity: pass;
- six-scale rounding: pass;
- table UI parity: 92/92;
- related-party No/Yes runtime: pass;
- current/prior period isolation: pass.

## Important external limitation

The MCA V5.1 executable was not run as part of this build. The workbench therefore makes no claim that every possible filing will pass MCA V5.1.

The release is designed so that:

**Taxonomy + Business Rules + Filing Manual → canonical filing model → generated XBRL → internal structural gate → MCA V5.1 final validation.**

Any MCA validator finding remains authoritative and must be incorporated into the next regression cycle.

## Release decision

V22.5 is the candidate final preparation build for independent MCA V5.1 validation.

