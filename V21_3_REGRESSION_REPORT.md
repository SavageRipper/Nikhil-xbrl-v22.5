# V21.3 Regression Report

## Scope

V21.3 was regression-tested against:

- V21.2 source package
- Supplied MCA-validated Infobahn XML instance
- Supplied Infobahn financial-statement PDF
- Supplied MCA Specific Rules workbook CSV
- MCA C&I taxonomy/table model already embedded in the workbench

## Tests

### 1. JavaScript syntax

- `app.js`: PASS
- `app-bundled.js`: PASS

### 2. Conditional applicability

The supplied MCA Specific Rules contain **18 explicit Yes/No conditional rules** of the form used for UI gating. The V21.3 engine discovers these from the rules rather than hard-coding only the subsidiary example.

Reference rule:

`SectionUnderWhichCompanyIsSubsidiary` — `Mandatory if WhetherCompanyIsSubsidiaryCompany is yes.`

Verified:

- Controller `No` makes the dependent field inapplicable.
- Existing dependent value is cleared from the filing projection.
- Controller `Yes` leaves the dependent field applicable.
- Inapplicable facts are blocked from XML generation.
- Conditional targets/controllers are discovered from the supplied rules rather than hard-coded only to the screenshot example.

### 3. Dimensional-table UX

Verified in source:

- Final V21.3 table renderer contains no editable `data-v15-axis` selector.
- Final V21.3 table renderer contains no editable `data-v15-typed-axis` input.
- XBRL dimensions remain in each row's `dimensions` object.
- `Add row` continues to allocate taxonomy-controlled member/typed-member identities.
- Imported rows can be deleted without editing raw axis/member values.
- Final table renderer is assigned through `v15TableInstance=v213TableInstance` and `v15TableCard=v213TableCard`.

### 4. Infobahn reference dimensional data

The supplied validated instance contains seven distinct related-party typed-member identities for `CategoriesOfRelatedPartiesAxis` across current/prior contexts:

`RelatedParty1` through `RelatedParty7`.

The PDF presents these as technical axis/member headings while the disclosure rows contain the business information such as related-party name, PAN, relationship, transaction description and amounts.

V21.3 therefore hides the technical member identity from normal data entry while retaining it for XBRL export.

### 5. Rounding regression

V21.2 rounding regression retained:

- 2,271 INR monetary fact occurrences in the supplied reference instance.
- Lakhs presentation values cross-checked against XML canonical INR values.
- UI-scale conversion remains monetary-only.
- Non-monetary concepts are not scaled.
- Source `decimals` remain preserved for imported facts.

### 6. ZIP integrity

The final ZIP is tested with Python `zipfile.testzip()` and SHA-256 is recorded in `SHA256SUMS.txt`.

## Browser-test limitation

A headless Chromium smoke attempt was made with the available environment, but Chromium's GPU process is unavailable in this runtime and the browser process cannot be used reliably for click-through testing. Therefore this report does not claim full interactive browser automation.

The official MCA XBRL Validation Tool V5.1 executable is also not present in this environment, so this report does not claim official MCA V5.1 execution.

## Result

V21.3 code-level, reference-data and package-integrity regression is PASS.

The automated suite also passed the retained V18/V19/V20/V21 regressions, including:
- 46 filing tabs + 7 non-filing sections rendered in the browserless runtime harness
- 413-context / 3,939-fact XML regression
- 61 typed-context dimensional regression
- 122 calculation-parent checks with 0 mismatches
- table reconstruction against the supplied Infobahn reference
- V21 comprehensive taxonomy/table checks
- V21.3 conditional/dimensional/rounding checks

The final release ZIP is regenerated after these checks; its SHA-256 is recorded externally with the release artifact.

Browser click-through remains environment-limited because Chromium's GPU process is unavailable in this runtime. Official MCA V5.1 execution is also not claimed because the official executable is not present.
