# V22.5 Final Validation Checklist

## Before generating XML

- [ ] Enter/verify CIN, company name, reporting period and standalone/consolidated status.
- [ ] Select reporting currency and financial-statement rounding level.
- [ ] Select Direct or Indirect cash-flow method; do not populate the inactive method.
- [ ] Run pre-scrutiny and resolve all errors.
- [ ] Review all applicable filing tabs.
- [ ] Open every applicable `[Table]` from its taxonomy abstract and complete its horizontal table rows.
- [ ] For typed dimensions, enter the typed member value directly in the axis column.
- [ ] Verify Current and Previous Year independently.
- [ ] Verify calculated totals against the taxonomy calculation relationships.
- [ ] Verify scale is presentation-only and that XML values are canonical.

## XML gate

The workbench blocks XML generation when its internal structural gate finds:

- invalid CIN/entity context;
- invalid dates;
- duplicate axes;
- explicit default members;
- invalid explicit axis/member combinations;
- typed dimension used on a non-typed axis;
- empty typed member;
- typed-domain QName mismatch;
- invalid hypercube context;
- `notAll` violation;
- duplicate fact concept/context;
- missing unit on numeric fact;
- prohibited `precision`/`scale`;
- unused contexts/units;
- invalid rich-text HTML.

## External MCA gate

The generated XML must still be opened in the official MCA XBRL Validation Tool V5.1.

If MCA V5.1 reports an error:

1. Preserve the exact validator message.
2. Identify the QName/context/table/rule responsible.
3. Reproduce it in the V22.5 regression fixture.
4. Fix the engine, not only the individual filing data.
5. Re-run the complete release regression suite.
6. Generate the XML again.
7. Re-run MCA V5.1.

The official validator result is authoritative.
