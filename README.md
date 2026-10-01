# MCA C&I XBRL Workbench V22.6.0

V22.6 is the hardened, validator-ready release of the local-first MCA C&I XBRL preparation and instance-generation workbench.

This release is designed to generate an MCA C&I XBRL instance from filing inputs while preserving taxonomy structure, dimensions, periods, units, source context identity, and source decimals. The official MCA XBRL Validator V5.1 remains the final external validation authority. V22.6 does not claim that an instance is MCA-compliant until that exact generated XML has passed MCA V5.1.

## Authority order

1. C&I Taxonomy 2016 V1.2 / 31-03-2016
2. C&I Business Rules V1.3
3. MCA C&I Filing Manual V4.0
4. MCA-validated/reference XBRL instances supplied for regression
5. Supplied CompuxBRL workbook, formulas and cross-sheet relationships

## V22.6 hardening

### One authoritative XML importer

The previous layered importer generations have been removed from app.js. The authoritative path is now:

parse XML → normalize contexts/units/facts → resolve source context → classify source period → resolve dimensions → resolve taxonomy table → project latest source year to Previous Year → retain canonical source occurrences

app.js contains one importXml() implementation and one V22.6 importer implementation. The old baseImportXmlRaw, baseImportXml and undefined exportCtxId paths are gone.

### Context identity and year projection

Imported context objects preserve the original XML context ID in sourceId and use collision-safe normalized IDs internally. Fact lookup resolves against the original source ID before the normalized ID, eliminating the V22.5 context mismatch.

For an imported FY 2024-25 instance, the latest source reporting year (2025) is mapped into the workbench Previous Year column. The 2024 comparison year remains retained in the canonical imported source store rather than being silently selected as the previous-year value.

### Dimensional reconstruction

Explicit and typed dimensions are preserved as part of occurrence identity. Dimensional facts are mapped to taxonomy table models using axis/member signatures rather than concept-only keys.

Typed-member values remain attached to the relevant axis and typed domain. Source context identity, dimension signature, unit reference and source decimals remain available in the canonical import store.

### [200500] Current investments

The current-investments table is an explicit regression target. Imported CurrentInvestments facts using ClassificationOfCurrentInvestmentsAxis reconstruct the table/member combination instead of leaving the table disabled merely because the current filing-year Yes/No controller has not yet been entered.

The import does not copy the imported previous-year answer into the current-year field. It only uses the source data to reconstruct the imported previous-year disclosure and its applicability evidence.

### Business-rule handling

The V22.6 rule engine continues to execute the supported classes already implemented in the workbench: conditional mandatory/blanking, alternatives, equality/matching, relational comparisons, positive/non-negative constraints, CIN/DIN/PAN checks, date sequencing, standalone/consolidated conditions, uniqueness and related dimensional checks.

A source-clause coverage inventory is generated from the supplied Specific_rules_for_elements.csv. In the current source-text classification baseline there are 637 expanded rule clauses, of which 574 are classified as locally handled by the current executable rule patterns and 63 are not. This is a source-text engineering metric, not an official MCA coverage percentage.

For relevant unsupported clauses, V22.6 blocks XML generation rather than silently treating the clause as satisfied. This deliberately favors review over false confidence.

## Infobahn regression fixture

The supplied Infobahn 2024-25 XBRL instance is the principal importer regression fixture.

| Check | Result |
|---|---:|
| XML contexts | 371 |
| XML units | 4 |
| Non-empty fact occurrences | 2,772 |
| Latest source-year facts | 1,464 |
| Comparison-year facts | 1,308 |
| Latest source year | 2025 |
| Comparison year | 2024 |
| Latest-year dimensional facts | 1,070 |
| Latest-year typed-dimensional facts | 149 |
| Typed-dimensional facts, all source years | 225 |
| Explicit-member occurrences, all source years | 3,510 |
| Precision attributes | 0 |
| Scale attributes | 0 |
| Invalid unit references | 0 |
| Duplicate same concept/context occurrences | 0 |

Specific acceptance observations include:

- [200500] Notes - Current investments: CurrentInvestments is 24,677,000 for FY 2024-25 and 30,139,000 for FY 2023-24, using ClassificationOfCurrentInvestmentsAxis.
- Borrowings contain multi-axis explicit dimensional contexts and source decimals of -3.
- Tangible and intangible asset disclosures contain explicit dimensional contexts.
- Typed dimensions are present in the source and are retained by the V22.6 importer model.
- Related-party typed identities in the golden regression include RelatedParty1 through RelatedParty7 across current/prior contexts.

The full measured regression is recorded in V22.6_REGRESSION_REPORT.md.

## Deployment architecture

The Pages entry point remains the simple root package:

index.html
app.js
app-bundled.js
styles.css

app-bundled.js contains the bundled MCA authority data followed by the authoritative app.js application suffix. A GitHub Actions build step reconstructs the bundle from that MCA data prefix plus app.js, avoiding drift between source and deployed runtime.

## Regression automation

tests/v226_static_regression.py verifies:

- Node syntax for app.js and app-bundled.js
- exactly one authoritative importer in source and bundle
- absence of legacy importer identifiers
- V22.6 version markers
- exact bundle/source suffix parity
- one external Pages runtime script
- MCA authority-data counts
- 92 taxonomy table models
- 44 typed-domain elements
- the supplied business-rule clause inventory baseline

GitHub Actions runs the build and regression gate on changes to the authoritative source/runtime files.

## Final validation workflow

1. Enter or import the filing in V22.6.
2. Run the workbench pre-scrutiny until the internal dashboard has no blocking errors.
3. Generate the XBRL instance.
4. Run that exact XML through MCA XBRL Validator V5.1.
5. Treat every MCA validator finding as authoritative.
6. Feed every reproducible finding back into the regression suite before filing.

V22.6 is not declared officially MCA-compliant by this repository. The release is intended to be materially stronger and validator-ready; the final compliance determination comes from MCA V5.1 on the generated instance.
