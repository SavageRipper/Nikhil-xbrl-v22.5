// V22.3 regression tests: period isolation + conditional table applicability.
const fs=require('fs');
const app=fs.readFileSync(require('path').join(__dirname,'..','app.js'),'utf8');

function assert(c,m){if(!c)throw new Error(m);}

assert(/function v15CreateBlankTableRow\(role,tableId,yearKind='current'\)/.test(app),
  'table row creation must be period-aware');
assert(/_years:\{current:yearKind==='current',prior:yearKind==='prior'\}/.test(app),
  'new table rows must belong only to the selected period');
assert(/v15CreateBlankTableRow\(r,t,yk\|\|yearKind\)/.test(app),
  'Add row must pass the selected period');
assert(/v15DeleteTableRow\(r,t,Number\(i\),yk\|\|yearKind\)/.test(app),
  'Delete row must affect only the selected period');
assert(/v22RowsForYear\(role,model,yearKind\)/.test(app),
  'table rendering must filter rows by period');
assert(/v22DimensionsForYear\(row,kind\)/.test(app),
  'table dimensions must be period-specific');
assert(/factsForGeneration\(kind\)[\s\S]*?v22DimensionsForYear\(row,kind\)/.test(app),
  'XML generation must use the dimensions for the selected period');

assert(/function v22ConditionalApplicability\(k,kind='current'\)/.test(app),
  'conditional applicability engine missing');
assert(/function isDisabledConcept\(k,e,role,isPrior=false\)\{const conditional=v22ConditionalApplicability/.test(app),
  'conditional business-rule disabling must be applied to ordinary filing fields');
assert(/function v22TableApplicable\(role,model,yearKind='current'\)/.test(app),
  'table applicability engine missing');
assert(/if\(v22TableApplicable\(role,model,yearKind\)===false\)\{toast\(/.test(app),
  'disabled tables must be blocked from opening');
assert(/data-v22-add=.*applicable/.test(app),
  'Add row must be disabled when the table is not applicable');
assert(/tableDisabled=v22TableApplicable\(role,model,kind\)===false/.test(app),
  'table cells must become non-editable when the condition is false');

console.log('PASS: V22.3 period-isolated table rows/dimensions and conditional applicability guards are present.');
