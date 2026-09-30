# V21.3 Change Log

## Conditional applicability

- Added a reusable explicit Yes/No conditional applicability layer driven by the supplied MCA Specific Rules.
- Dependent facts are disabled when their controller is `No` or not yet affirmative.
- Inapplicable current/prior values are cleared from the user-facing filing projection.
- Validation catches stale inapplicable values if they bypass the UI.
- XML generation suppresses conditionally inapplicable facts as a final safety gate.
- The lossless imported `xbrlStore` is not mutated by this UI projection cleanup.

### Reference case

`SectionUnderWhichCompanyIsSubsidiary` is mandatory if `WhetherCompanyIsSubsidiaryCompany` is Yes. Therefore when the answer is No, the section field is disabled, empty, and not serialized.

## Dimensional-table UX

- Removed user-editable axis/member columns from the V15/V16 dimensional filing-table workflow.
- Typed-member inputs are also hidden from normal filing data entry.
- Imported dimensions remain intact in the canonical XBRL store.
- `Add row` automatically creates the next valid dimension/member identity.
- `Delete` removes the complete disclosure row.
- Added business-facing row identity summaries, using populated name/party/director/promoter/auditor fields where available.
- Related-party rows imported from the Infobahn reference therefore display the actual business party information rather than requiring the user to manipulate `RelatedParty1`, `RelatedParty2`, etc.

## Regression preservation

- V21.2 monetary presentation-scale architecture is retained.
- Actuals / Thousands / Lakhs / Millions / Crores / Billions remain presentation scales; canonical monetary XML values remain INR.
- Typed dimensions continue to use first-class `{axis, kind:"typed", typedDomain, typedValue}` representation.
