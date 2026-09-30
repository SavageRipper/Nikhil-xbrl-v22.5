#!/usr/bin/env python3
import json, os, re, subprocess, zipfile, xml.etree.ElementTree as ET
ROOT=os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
errors=[]
def ok(name,cond,detail=''):
    if not cond: errors.append(f'{name}: {detail}')
app=open(os.path.join(ROOT,'app.js'),encoding='utf8').read()
bundle=open(os.path.join(ROOT,'app-bundled.js'),encoding='utf8').read()
index=open(os.path.join(ROOT,'index.html'),encoding='utf8').read()
ok('APP_VERSION','APP_VERSION=\'22.5.0\'' in app)
ok('INDEX_VERSION','22.5.0' in index and '22.2.0' not in index and '22.4.0' not in index)
ok('SINGLE_TABLE_OPENER',len(re.findall(r'function openDimensionalTable',app))==1)
ok('SINGLE_TABLE_OPENER_BUNDLED',len(re.findall(r'function openDimensionalTable',bundle))==1)
ok('TYPED_SERIALIZER','xbrldi:typedMember' in app)
ok('TYPED_CONTEXT_SIGNATURE','dimensions:v19DimensionSignature' in app)
ok('DIMENSION_GATE','v22_5DimensionalValidation' in app and 'Table NotAll dimensional constraint' in app)
ok('DEFAULT_MEMBER_GATE','default members must be inferred, not serialized' in app)
ok('ADVANCED_RULE_ENGINE','v22_5AdvancedRuleChecks' in app)
constraints=json.load(open(os.path.join(ROOT,'MCA_CNI_DIMENSIONAL_CONSTRAINTS.json'),encoding='utf8'))
ok('ALL_COUNT',len(constraints['all'])==92,str(len(constraints['all'])))
ok('NOTALL_COUNT',len(constraints['notAll'])==74,str(len(constraints['notAll'])))
ok('DEFAULT_COUNT',len(constraints['dimensionDefaults'])==45,str(len(constraints['dimensionDefaults'])))
tm=json.load(open(os.path.join(ROOT,'TAXONOMY_MODEL.json'),encoding='utf8'))
ok('TABLE_MODEL_COUNT',len(tm['tables'])==92,str(len(tm['tables'])))
ok('TYPED_AXIS_COUNT',len(tm['typedDomainElements'])==44,str(len(tm['typedDomainElements'])))
# Golden MCA-validated instance regression
xml=os.path.join(ROOT,'tests','fixtures','charvak_1.xml')
if os.path.exists(xml):
    X=ET.parse(xml).getroot()
    ns={'x':'http://www.xbrl.org/2003/instance','d':'http://xbrl.org/2006/xbrldi'}
    contexts=X.findall('x:context',ns)
    facts=[n for n in X if n.tag.split('}')[-1] not in {'context','unit'} and not n.tag.endswith('schemaRef') and not n.tag.endswith('footnoteLink')]
    typed=X.findall('.//d:typedMember',ns)
    ok('GOLDEN_CONTEXTS',len(contexts)==413,str(len(contexts)))
    ok('GOLDEN_FACTS',len(facts)==3939,str(len(facts)))
    ok('GOLDEN_TYPED_FACTS',len(typed)==61,str(len(typed)))
# JS syntax
for f in ['app.js','app-bundled.js']:
    p=subprocess.run(['node','--check',os.path.join(ROOT,f)],capture_output=True,text=True)
    ok('NODE_CHECK_'+f,p.returncode==0,p.stderr[:200])
if errors:
    print('FAIL')
    print('\n'.join(errors))
    raise SystemExit(1)
print('PASS: V22.5 release static/source regression')
print(json.dumps({'allHypercubes':len(constraints['all']),'notAll':len(constraints['notAll']),'defaults':len(constraints['dimensionDefaults']),'tables':len(tm['tables']),'typedAxes':len(tm['typedDomainElements']),'goldenContexts':413,'goldenFacts':3939,'goldenTypedMembers':61}))
