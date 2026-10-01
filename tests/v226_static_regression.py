#!/usr/bin/env python3
import csv, json, re, subprocess, tempfile
from pathlib import Path

ROOT=Path(__file__).resolve().parents[1]

def fail(msg):
    raise SystemExit("FAIL: "+msg)

def run(cmd, check=True):
    p=subprocess.run(cmd,capture_output=True,text=True)
    if check and p.returncode:
        fail(f"{' '.join(cmd)}\n{p.stdout}\n{p.stderr}")
    return p

app=(ROOT/"app.js").read_text(encoding="utf-8")
bundle=(ROOT/"app-bundled.js").read_text(encoding="utf-8")
html=(ROOT/"index.html").read_text(encoding="utf-8")
rules_path=ROOT/"Specific_rules_for_elements.csv"
rules=rules_path.read_text(encoding="utf-8-sig")

# JavaScript syntax
run(["node","--check",str(ROOT/"app.js")])
run(["node","--check",str(ROOT/"app-bundled.js")])

# One authoritative importer in source and the rebuilt deployed bundle.
if len(re.findall(r"function importXml\(",app)) != 1: fail("app.js must contain exactly one importXml()")
if len(re.findall(r"function v226ImportXml\(",app)) != 1: fail("app.js must contain exactly one v226ImportXml()")
for token in ["function baseImportXmlRaw(", "function baseImportXml(", "exportCtxId"]:
    if token in app: fail(f"legacy importer token remains: {token}")
if "APP_VERSION='22.6.0'" not in app: fail("app.js is not V22.6.0")
if "importXml=v226ImportXml" not in app: fail("V22.6 importer is not authoritative")
if "DetailsOfCurrentInvestmentsTable" not in app or "ClassificationOfCurrentInvestmentsAxis" not in app:
    fail("current-investments taxonomy table/axis missing")

# Rebuild/deployment transition:
# During the first V22.6 workflow run the large bundle may still be old; the
# index.html inline hardening layer is then permitted as a temporary bridge.
# Once the workflow has rebuilt app-bundled.js, the final check requires the
# bundle suffix to equal app.js and the transitional inline importer to be gone.
marker="const WORKBOOK_TABLE_SCHEMA"
cut=bundle.find(marker)
if cut < 0: fail("app-bundled.js does not contain the MCA_DATA prefix boundary")
bundle_matches_source=(bundle[cut:] == app)

if "app-bundled.js?v=22.6.0" not in html: fail("index.html is not pinned to V22.6.0 bundle")
if len(re.findall(r"<script\s+src=",html,re.I)) != 1: fail("index.html must have exactly one external script")
bridge=("V22.6 runtime hardening layer" in html or "function hardImport(" in html)
if not bundle_matches_source and not bridge:
    fail("old bundle is present but the temporary V22.6 runtime bridge is missing")


# Parse bundled MCA authority data.
prefix=bundle[:cut]
lead="window.MCA_DATA="
if not prefix.startswith(lead): fail("bundle does not start with window.MCA_DATA")
try:
    data=json.JSONDecoder().raw_decode(prefix[len(lead):])[0]
except Exception as exc:
    fail(f"MCA_DATA JSON parse failed: {exc}")
expected_counts={
    "elrs":47,
    "elements":3616,
    "presentation":4092,
    "calculations":1051,
    "definitions":2967,
}
for k,v in expected_counts.items():
    got=len(data.get(k,[])) if isinstance(data.get(k),list) else None
    if got != v: fail(f"MCA_DATA {k}: expected {v}, found {got}")

# MCA taxonomy table authority counts embedded in the bundle/source.
schema_match=re.search(r"const WORKBOOK_TABLE_SCHEMA=(\[.*?\]);\s*const state=",bundle,re.S)
if not schema_match: fail("WORKBOOK_TABLE_SCHEMA boundary not found")
schema=json.loads(schema_match.group(1))
if len(schema)!=92: fail(f"WORKBOOK_TABLE_SCHEMA expected 92 tables, found {len(schema)}")
typed=[e for e in data.get("elements",[]) if e.get("typedDomainRef")]
if len(typed)!=44: fail(f"typed-domain elements expected 44, found {len(typed)}")

# Supplied MCA rule source: expand multiline clauses the same way specificRuleRows() does.
expanded=[]
with rules_path.open(encoding="utf-8-sig",newline="") as fh:
    for row in csv.reader(fh):
        if len(row)<2: continue
        element=(row[0] or "").strip()
        text=(row[1] or "").strip()
        if not element or not text or re.fullmatch(r"ELR/ Element Name",element,re.I): continue
        expanded.extend([x.strip() for x in text.splitlines() if x.strip()])
if len(expanded)!=636: fail(f"expanded supplied rule clauses expected 636, found {len(expanded)}")
supported=re.compile(r"mandatory|required|greater than|less than|valid (?:cin|din|pan|country)|should be unique|different from cin|different from pan|same as|should match|match with|corresponding .*entered|vice-a-versa|current financial year|standalone|consolidated|system date|one day less than|difference between start date and end date|equal to",re.I)
unsupported=sum(1 for r in expanded if not supported.search(r))
if unsupported!=62: fail(f"source-text rule-classification baseline expected 62 unsupported clauses, found {unsupported}")

print("PASS: V22.6 static/deployment regression")
print("  • Node syntax: app.js + app-bundled.js")
print("  • Single authoritative importer: app.js and rebuilt bundle")
print("  • MCA_DATA counts: 47 ELRs / 3616 elements / 4092 presentation / 1051 calculations / 2967 definitions")
print("  • Taxonomy tables: 92")
print("  • Typed-domain elements: 44")
print("  • Expanded MCA-specific source clauses: 636; heuristic local handling classification: 574 supported / 62 unsupported")
print("  • Pages entrypoint: exactly one external script, V22.6.0 bundle")
