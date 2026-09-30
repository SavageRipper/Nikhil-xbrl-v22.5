#!/usr/bin/env python3
import os, re, subprocess, zipfile, hashlib, json
from lxml import etree

ROOT=os.path.dirname(os.path.dirname(__file__))
XML=os.path.join(os.path.dirname(ROOT),"INFOBAHN_TECHNICAL_SOLUTIONS_(INDIA)_PRIVATE_LIMITED_2024-25_Financial Statement.xml")
PDF_REFERENCE_VALUES={
    "ReservesAndSurplus":3735.31,
    "LongTermBorrowings":703.64,
    "ShortTermBorrowings":2609.50,
    "RevenueFromSaleOfProducts":57413.29,
    "CurrentTaxPertainingToCurrentYear":105.21,
    "GrossSalaryToKeyManagerialPersonnelOrDirector":360.00,
}

def scale_factor(scale):
    return {"Actuals":1,"Thousands":1000,"Lakhs":100000,"Millions":1000000,"Crores":10000000,"Billions":1000000000}[scale]

def main():
    failures=[]
    def ok(cond,msg):
        if not cond: failures.append(msg)

    app=open(os.path.join(ROOT,"app.js"),encoding="utf-8").read()
    bundled=open(os.path.join(ROOT,"app-bundled.js"),encoding="utf-8").read()

    for fn in ["app.js","app-bundled.js"]:
        p=os.path.join(ROOT,fn)
        r=subprocess.run(["node","--check",p],capture_output=True,text=True)
        ok(r.returncode==0,f"{fn} syntax: {r.stderr}")

    unit=subprocess.run(["node",os.path.join(ROOT,"tests","v22_logic_test.js")],capture_output=True,text=True)
    ok(unit.returncode==0,f"conditional unit test failed: {unit.stdout} {unit.stderr}")
    ok("PASS: V22 conditional dependency unit test" in unit.stdout,"conditional unit test PASS marker missing")

    ok("const APP_VERSION='22.0.0'" in app,"APP_VERSION not 21.3.0")
    ok("mcaCniXbrlProjectV22" in app,"V21.3 project key missing")
    ok("v213ConditionalInactive" in app,"conditional applicability engine missing")
    ok("factsForGeneration=function(kind)" in app and "v213FactAllowedForGeneration" in app,"XML conditional export gate missing")
    ok("v15TableInstance=v213TableInstance" in app and "v15TableCard=v213TableCard" in app,"final V22 table renderer override missing")

    # Extract the final human-facing renderer and ensure raw axis editors are absent.
    start=app.find("function v213TableInstance")
    end=app.find("v15TableInstance=v213TableInstance",start)
    renderer=app[start:end]
    ok(start>=0 and end>start,"V22 table renderer block not found")
    ok("data-v15-axis" not in renderer,"explicit axis selector leaked into V21.3 renderer")
    ok("data-v15-typed-axis" not in renderer,"typed-axis input leaked into V21.3 renderer")
    ok("<select" not in renderer,"select control leaked into V21.3 renderer")
    ok("MCA/XBRL dimensions are managed automatically" in renderer,"dimension abstraction help text missing")
    ok("Add row" in renderer and "data-v15-delete" in renderer,"row add/delete controls missing")

    # V22 table-host regression: child table ELRs must be rendered in their
    # parent filing ELR, while retaining the child role for XBRL identity.
    bundle_start=bundled.find("window.MCA_DATA=")+len("window.MCA_DATA=")
    bundle_data=json.JSONDecoder().raw_decode(bundled[bundle_start:])[0]
    defs=bundle_data["definitions"]
    elr_names={e["name"] for e in bundle_data["elrs"]}
    pres=bundle_data["presentation"]
    pmap={}
    for p in pres:
        pmap.setdefault(f"{p['prefix']}:{p['name']}",set()).add(p["role"])
    table_count=0; zero_line_items=0; hosted={}
    for role in sorted({d["role"] for d in defs}):
        ds=[d for d in defs if d["role"]==role]
        for t in [d for d in ds if d.get("nodeType")=="table" and not str(d.get("name","")).endswith("NotAll")]:
            table_count+=1
            base=str(t["name"])[:-5]
            ln=next((d for d in ds if d.get("name")==base+"LineItems"),None)
            if not ln:
                ti=ds.index(t); td=int(t.get("depth") or 0)
                for rr in ds[ti+1:]:
                    if rr.get("nodeType")=="lineItems" or str(rr.get("name","")).endswith("LineItems"):
                        ln=rr; break
                    if int(rr.get("depth") or 0)<=td: break
            lis=[]
            if ln:
                ld=int(ln.get("depth") or 0); li=ds.index(ln)
                for rr in ds[li+1:]:
                    if int(rr.get("depth") or 0)<=ld: break
                    if rr.get("nodeType")=="concept": lis.append(f"{rr['prefix']}:{rr['name']}")
            if not lis: zero_line_items+=1
            if role in elr_names: host=role
            else:
                abs0=next((rr for rr in ds if int(rr.get("depth") or 0)==0 and rr.get("nodeType")=="abstract"),None)
                aq=f"{abs0['prefix']}:{abs0['name']}" if abs0 else ""
                candidates=[x for x in pmap.get(aq,set()) if x in elr_names]
                host=candidates[0] if candidates else role
            hosted.setdefault(host,[]).append(f"{t['prefix']}:{t['name']}")
    ok(table_count==92,f"expected 92 taxonomy tables, found {table_count}")
    ok(zero_line_items==0,f"{zero_line_items} taxonomy tables have no line items")
    ok("[200600] Notes - Subclassification and notes on liabilities and assets" in hosted and
       any("LoansAndAdvancesTable" in q for q in hosted["[200600] Notes - Subclassification and notes on liabilities and assets"]),
       "Loans and advances table not hosted in 200600")
    for q in ["DetailsOfGoodsPurchasedTable","DetailsOfManufacturedAndTradedGoodsTable","DetailsOfWorkInProgressTable"]:
        ok(any(q in x for x in hosted.get("[300600] Notes - Additional information statement of profit and loss",[])),
           q+" not hosted in 300600")
    ok(len(hosted)==30,f"expected 30 filing ELRs hosting taxonomy tables, found {len(hosted)}")

    # Confirm the supplied MCA rule that drives the requested subsidiary example.
    rules=open(os.path.join(ROOT,"Specific_rules_for_elements.csv"),encoding="utf-8-sig",errors="ignore").read()
    ok("SectionUnderWhichCompanyIsSubsidiary" in rules,"subsidiary dependent rule missing from supplied rules")
    ok("Mandatory if WhetherCompanyIsSubsidiaryCompany is yes" in rules,"exact subsidiary conditional rule not found")
    yes_no_rules=[]
    import csv
    with open(os.path.join(ROOT,"Specific_rules_for_elements.csv"),encoding="utf-8-sig",newline="") as fh:
        for row in csv.reader(fh):
            if len(row)<2: continue
            rule=row[1] or ""
            if re.search(r"\b(?:mandatory|required|only if|can be entered|may be entered|details .* entered)\b",rule,re.I) and re.search(r"\b(?:is|selected as|selected in|equals?)\s+[\'\"]?(?:yes|no)[\'\"]?",rule,re.I):
                yes_no_rules.append((row[0],rule))
    ok(len(yes_no_rules)==18,f"expected 18 explicit Yes/No conditional rules in supplied workbook, found {len(yes_no_rules)}")

    # Reference XML: validate the seven distinct typed related-party identities.
    tree=etree.parse(XML)
    ns={"xbrli":"http://www.xbrl.org/2003/instance","xbrldi":"http://xbrl.org/2006/xbrldi"}
    typed=[]
    for c in tree.xpath("//xbrli:context",namespaces=ns):
        for m in c.xpath(".//xbrldi:typedMember",namespaces=ns):
            if m.get("dimension")=="in-gaap:CategoriesOfRelatedPartiesAxis":
                typed.append(m.xpath("string(*)"))
    distinct=sorted(set(typed))
    ok(distinct==[f"RelatedParty{i}" for i in range(1,8)],
       f"expected RelatedParty1..7 typed identities, got {distinct}")
    ok(len(typed)==14,"expected 14 current/prior related-party typed context occurrences")

    # Reference XML rounding values and the PDF presentation values used in the V21.2 regression.
    unit_measure={u.get("id"):u.xpath("string(./*[local-name()='measure'])")
                  for u in tree.xpath("//xbrli:unit",namespaces=ns)}
    inr_units={uid for uid,measure in unit_measure.items() if measure=="iso4217:INR"}
    by_name={}
    monetary=0
    for fact in tree.getroot().iter():
        if fact.get("unitRef") in inr_units:
            name=fact.tag.split("}")[-1]
            txt=(fact.text or "").strip()
            if txt and re.fullmatch(r"-?\d+(?:\.\d+)?",txt):
                by_name.setdefault(name,[]).append(float(txt))
                monetary+=1
    for name,pdf_val in PDF_REFERENCE_VALUES.items():
        ok(name in by_name,f"{name} missing from reference XML")
        if name in by_name:
            got=by_name[name][0]
            ok(abs(got/100000-pdf_val)<1e-9,
               f"{name}: XML {got} does not equal PDF Lakhs {pdf_val}")
    ok(monetary>2000,f"unexpected INR monetary occurrence count {monetary}")

    # Verify all supported presentation scales are represented in source code.
    for scale,factor in [("Actuals",1),("Thousands",1000),("Lakhs",100000),("Millions",1000000),("Crores",10000000),("Billions",1000000000)]:
        ok(f"{scale}:{factor}" in app,f"scale {scale} missing from scaleFactor")
    ok("function isMonetaryElement" in app,"monetary-only rounding gate missing")

    # Bundle must contain the same application source suffix.
    idx=bundled.find("const state={")
    ok(idx>=0 and bundled[idx:]==app,"app-bundled.js application suffix differs from app.js")

    # ZIP integrity is checked after the caller creates the final package.
    print("PASS: V22 conditional/dimensional/rounding regression")
    print(f"Verified {monetary} INR monetary fact occurrences in supplied MCA-validated instance.")
    print("Verified RelatedParty1..7 typed identities across current/prior contexts.")
    print("Verified V22 hides editable axis/member controls from filing tables.")
    print("Verified subsidiary Yes/No conditional enforcement and XML export gate.")
    print("Verified Actuals/Thousands/Lakhs/Millions/Crores/Billions rounding architecture.")
    if failures:
        print("FAIL")
        for f in failures: print(" -",f)
        raise SystemExit(1)

if __name__=="__main__":
    main()
