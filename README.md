# MCA C&I XBRL Workbench V22.5.0

V22.5 is the release-hardening build of the local-first MCA C&I XBRL preparation and instance-generation workbench.

## Authority order

The implementation is governed by the supplied MCA C&I source material:

1. C&I Taxonomy 2016 V1.2 / 31-03-2016
2. C&I Business Rules V1.3
3. MCA C&I Filing Manual V4.0
4. Supplied MCA-validated/reference XBRL instances
5. Supplied CompuxBRL workbook and its formulas/cross-sheet relationships

The official MCA XBRL Validation Tool remains the final external authority. This package does **not** claim official MCA V5.1 validation execution.

## V22.5 P0 fixes

- Added the complete taxonomy definition constraint inventory: **92 `all` hypercubes, 74 `notAll` constraints, and 45 dimension-default relationships**.
- Generated-instance validation now checks dimensional contexts against those MCA definition constraints.
- Explicit default members are blocked; default members are omitted from UI selectors and are treated as inferred rather than serialized.
- Typed dimensions remain first-class context data and are serialized as `xbrldi:typedMember` with the taxonomy typed-domain QName.
- Typed axes are editable directly inside the horizontal dimensional table engine rather than through explicit-member dropdowns.
- Typed values participate in context/row identity.
- Imported contexts are retained alongside filing contexts, with source context IDs preserved and collision-safe export IDs.
- Imported prior-year ordinary facts synchronize their canonical occurrence when the user edits the Previous Year field.
- Source decimals remain attached to imported fact occurrences and dimensional table rows.
- The generated context serializer now retains typed dimensions instead of silently dropping them.
- The internal dimensional gate checks duplicate axes, valid axis/member combinations, typed-domain compatibility, hypercube compatibility and `notAll` exclusions.

## V22.5 P1 fixes

- One authoritative `openDimensionalTable()` path remains; the previous duplicate unguarded opener is removed.
- Table buttons now visibly respect MCA applicability conditions.
- Conditional table evaluation supports the existing Yes/No, entered, `> 0`, `= 0`, AND/OR and standalone/consolidated forms.
- Advanced business-rule checks cover conditional mandatory/blanking, alternatives, equality/matching, relational comparisons, direct positive-value constraints, CIN/PAN validity, date sequencing, 18-month duration checks and repetitive-dimensional uniqueness.
- Current/prior values remain independently stored.
- Six presentation scales remain supported: Actuals, Thousands, Lakhs, Millions, Crores and Billions.
- Direct and indirect cash-flow disclosures remain mutually exclusive.
- The CompuxBRL horizontal table/formula/cross-sheet engine remains in place.
- 92 taxonomy tables remain catalogued and anchored to their taxonomy presentation abstracts.
- V22.5 includes the complete supplied taxonomy source ZIP, Filing Manual, business-rule workbook and authority manifest under `MCA_CNI_AUTHORITY/`.

## Release QA

The V22.5 release regression suite was run against the package:

- Node syntax check: PASS
- V22.5 release/source regression: PASS
- Taxonomy table model: **92/92**
- Definition `all` hypercubes: **92**
- Definition `notAll` constraints: **74**
- Dimension defaults: **45**
- Typed-domain elements: **44**
- Golden MCA-validated reference XML: **413 contexts, 3,939 fact occurrences, 61 typed-member contexts**
- Conditional table runtime coverage: **22 rules / 44 current-prior cases / 0 failures**
- Formula parity: PASS
- Dropdown parity: PASS
- Cross-sheet parity: PASS
- Six-scale rounding regression: PASS
- V22 table hosting/UI parity: **92/92**
- Related-party conditional runtime: PASS
- Current/prior period-isolation regression: PASS

The official MCA validator has not been executed in this environment. The intended final workflow is:

1. Build/enter the filing in V22.5.
2. Run the workbench pre-scrutiny until there are no errors.
3. Generate the XBRL instance.
4. Run the generated XML through the MCA XBRL Validation Tool V5.1.
5. Treat every MCA validator finding as authoritative and feed any finding back into the V22.5 regression suite before filing.

## Local/GitHub Pages deployment

Serve or publish the package as a static site. No application server is required for the filing workflow; user data remains in the browser/local project file.

Do not file generated XML solely on the basis of this internal regression suite. MCA V5.1 is the final compliance gate.

