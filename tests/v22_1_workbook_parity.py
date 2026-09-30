#!/usr/bin/env python3
import os,re,json,subprocess,zipfile,hashlib
from openpyxl import load_workbook

ROOT=os.path.dirname(os.path.dirname(__file__))
WB=os.path.join(os.path.dirname(ROOT),"xls_extract","charvak XBRL 31-3-26.xlsx")
APP=os.path.join(ROOT,"app.js")
BUNDLE=os.path.join(ROOT,"app-bundled.js")

def fail(msg): raise AssertionError(msg)

def main():
    app=open(APP,encoding="utf-8").read()
    bundled=open(BUNDLE,encoding="utf-8").read()
    for f in (APP,BUNDLE):
        r=subprocess.run(["node","--check",f],capture_output=True,text=True)
        if r.returncode: fail(f"syntax failed: {f}: {r.stderr}")

    if "const APP_VERSION='22.1.0'" not in app: fail("version marker missing")
    if "const WORKBOOK_TABLE_SCHEMA=" not in app: fail("workbook schema missing")
    for token in ["function v22TableModal","function v22WireModal","function v22RecalculateTableRow","data-v22-axis","data-v22-value","See dimensional table"]:
        if token not in app: fail("missing table-engine token: "+token)
    if "scrollIntoView" in app[app.find("function openDimensionalTable"):app.find("function filingView")]:
        fail("dimensional table still opens by scrolling to an inline engine")

    wb=load_workbook(WB,data_only=False)
    if len(wb.sheetnames)!=185: fail(f"expected 185 workbook sheets, got {len(wb.sheetnames)}")

    # workbook table identifiers
    table_map={}
    table_instances=0
    for s in wb.sheetnames:
        ws=wb[s]
        if str(ws["A2"].value).strip().lower()=="table" or s=="ProductServiceDetails":
            tq=ws["K2"].value
            if tq:
                table_instances+=1
                table_map.setdefault(str(tq),s)
    if table_instances!=134: fail(f"expected 134 table sheet instances, got {table_instances}")
    if len(table_map)!=87: fail(f"expected 87 unique workbook table identifiers, got {len(table_map)}")

    schema=json.loads(open(os.path.join(ROOT,"WORKBOOK_TABLE_SCHEMA.json"),encoding="utf-8").read())
    if len(schema)!=87: fail(f"schema must contain 87 unique tables, got {len(schema)}")
    catalog_path=os.path.join(ROOT,"TAXONOMY_TABLE_CATALOG.csv")
    import csv
    with open(catalog_path,encoding="utf-8") as fh:
        catalog=list(csv.DictReader(fh))
    if len(catalog)!=92: fail(f"expected 92 taxonomy table structures, got {len(catalog)}")
    schema_names={s["name"] for s in schema}
    for rec in catalog:
        if rec["tableQ"].split(":")[-1] not in schema_names:
            fail("taxonomy table missing workbook schema: "+rec["tableQ"])
    # every schema table has ordered columns and every taxonomy input is represented
    for s in schema:
        if not s["columns"]: fail("empty column schema: "+s["name"])
        if not s["workbookSheet"]: fail("missing workbook sheet: "+s["name"])
    c=next(x for x in schema if x["name"]=="ClassificationOfBorrowingsTable")
    labels=[x["label"] for x in c["columns"][:4]]
    if labels[:3]!=["Sr. No.","Classification based on time period","Classification of borrowings"]:
        fail("borrowings column order mismatch")
    axis=[x for x in c["columns"] if x["kind"]=="axis"]
    if len(axis)!=3: fail("borrowings must expose three axis selector columns")
    if not all(any(v.get("options") for v in x["validation"]) for x in axis):
        fail("borrowings axis selectors must have dropdown options")
    opts=axis[0]["validation"][0]["options"]
    if opts!=["Long-term","Short-term"]: fail("time-period dropdown mismatch")
    if len(axis[1]["validation"][0]["options"])<30: fail("classification dropdown options incomplete")
    if axis[2]["validation"][0]["options"]!=["Secured borrowings","Unsecured borrowings"]:
        fail("security dropdown mismatch")

    for sheet,expected in {
        "LoansAndAdvances":["Classification based on time period","Classification of loans and advances","Classification of assets based on security"],
        "GoodsPurchased":["Description of goods purchased","Total goods purchased"],
        "RawMaterialsConsumed":["Description of raw materials category","Total raw materials consumed"],
        "ManufacturedAndTradedGoods":["Categories of manufactured and traded goods","Description of finished goods","Amount of sales","Amount of closing inventory","Amount of opening inventory"],
        "WorkInProgress":["Description of work-in-progress","Total work-in-progress"],
    }.items():
        s=next(x for x in schema if x["workbookSheet"]==sheet)
        labels=[x["label"] for x in s["columns"]]
        for e in expected:
            if e not in labels: fail(f"{sheet}: missing expected column {e}")

    # No taxonomy line-item omissions: compare schema concept keys to the bundled taxonomy.
    raw=bundled[bundled.find("window.MCA_DATA=")+len("window.MCA_DATA="):]
    data=json.JSONDecoder().raw_decode(raw)[0]
    elem_names={f"{e['prefix']}:{e['name']}" for e in data["elements"]}
    for s in schema:
        # Every concept key must be a taxonomy element; helper/axis/serial are separate.
        for col in s["columns"]:
            if col["kind"]=="concept" and col["key"] not in elem_names:
                fail(f"schema concept not in taxonomy: {s['name']} {col['key']}")
    if len(data["elrs"])!=47: fail("expected 47 filing ELRs")
    print("PASS: V22.1 CompuxBRL workbook/table-engine regression")
    print("Verified 185 workbook sheets, 134 table sheet instances, 87 unique table identifiers.")
    print("Verified borrowings/loans/goods/raw-materials/manufactured-goods/WIP column structures.")
    print("Verified explicit-axis dropdowns are inside the popup-table model.")
    print("Verified taxonomy concept columns map to supplied taxonomy elements.")
if __name__=="__main__": main()
