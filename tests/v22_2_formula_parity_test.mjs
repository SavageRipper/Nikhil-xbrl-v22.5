
import fs from 'node:fs'; import vm from 'node:vm';
const root=new URL('..',import.meta.url);
const bundle=fs.readFileSync(new URL('app-bundled.js',root),'utf8').replace(/\nload\(\);\s*$/,'\n');
const els=new Map(); const mk=id=>({id,innerHTML:'',textContent:'',value:'',hidden:false,dataset:{},style:{},classList:{add(){},remove(){},contains(){return false}},addEventListener(){},removeEventListener(){},querySelector(){return null},querySelectorAll(){return []},setAttribute(){},getAttribute(){return ''},focus(){},click(){}});
const document={getElementById(id){if(!els.has(id))els.set(id,mk(id));return els.get(id)},querySelectorAll(){return []},querySelector(){return null},createElement(){return mk('x')},addEventListener(){}};
const ctx={window:{addEventListener(){}},document,btoa:s=>Buffer.from(s,'binary').toString('base64'),atob:s=>Buffer.from(s,'base64').toString('binary'),unescape,encodeURIComponent,localStorage:{getItem(){return null},setItem(){},removeItem(){}},console,Blob:function(){},URL:{createObjectURL(){return ''},revokeObjectURL(){}},setInterval,clearInterval,setTimeout,clearTimeout,performance:{now:()=>Date.now()},confirm:()=>true,FileReader:function(){},DOMParser:function(){},XMLSerializer:function(){},TextEncoder,TextDecoder};
vm.createContext(ctx);vm.runInContext(bundle,ctx,{timeout:120000});ctx.MCA_DATA=ctx.window.MCA_DATA;
const out=vm.runInContext(`(()=>{
 Object.assign(state,{meta:MCA_DATA.meta,elements:MCA_DATA.elements,presentation:MCA_DATA.presentation,calculations:MCA_DATA.calculations,definitions:MCA_DATA.definitions,rules:MCA_DATA['business-rules'],elrs:MCA_DATA.elrs,active:'filing',section:0,values:{},prior:{},contexts:[],units:[],errors:[],warnings:[],dimTables:{},profile:{cin:'',companyName:'',fyStart:'2025-04-01',fyEnd:'2026-03-31',currency:'Indian rupee',firstYear:false,financialStatements:'Standalone',inputScale:'Actuals',generalInfoEnabled:true,cashFlowMethod:''}});
 normalizeState();
 const sheets=['Table10','Table5','ClassesOfShareCapitalTable','DefinedBenefitPlans','DetailsPreproducingProprties','DetailsOfProducingProperties','DisclosrIntangibleAssets','OtherProvisions','DisclosrTangibleAssets','ChangesInReserves'];
 const expected={
 Table10:{Q:'=SUM(N#:P#)',T:'=R#-S#',X:'=SUM(U#:W#)'},
 Table5:{P:'=N#+O#',T:'=R#+S#'},
 ClassesOfShareCapitalTable:{AA:'=W#+Y#',CU:'=SubclsifictionLiabilitisAssets!L#',CV:'=SubclsifictionLiabilitisAssets!L#'},
 DefinedBenefitPlans:{AG:undefined,Q:undefined},
 DetailsPreproducingProprties:{O:undefined,U:'=P#-Q#-R#-S#+T#'},
 DetailsOfProducingProperties:{N:undefined,R:'=O#-P#+Q#'},
 DisclosrIntangibleAssets:{Q:undefined,U:'=R#+S#+T#'},
 OtherProvisions:{N:undefined,T:'=P#+Q#-R#-S#'},
 DisclosrTangibleAssets:{Q:undefined,W:'=U#+V#'},
 ChangesInReserves:{N:undefined,Q:'=SUM(O#:P#)'}
 };
 const schema=WORKBOOK_TABLE_SCHEMA;
 for(const sh of sheets){
   const m=schema.find(x=>x.workbookSheet===sh); if(!m)throw new Error('missing '+sh);
   const formulas=Object.fromEntries(m.columns.filter(c=>c.formula?.length).map(c=>[c.excelCol,c.formula[0][0]]));
   const ref=expected[sh];
   for(const [col,val] of Object.entries(ref)){ if(val!==undefined&&formulas[col]!==val)throw new Error(sh+' '+col+' formula mismatch: '+formulas[col]+' != '+val); }
 }
 const bp=schema.find(x=>x.workbookSheet==='BreakupOfProvisions');
 const vm=bp.columns.find(c=>c.excelCol==='M');
 if(!vm.validation?.length||vm.validation[0].formula1!=='$B$4:$B$5')throw new Error('BreakupOfProvisions M validation missing');
 const target=v15AllTableModels().find(m=>v22WorkbookSchema(m)?.workbookSheet==='ClassesOfShareCapitalTable');
 if(!target)throw new Error('target model missing');
 const tr={current:{},prior:{},dimensions:[],__rowIndex:0};
 const sourceEl=state.elements.find(e=>e.name==='ApplicationMoneyReceivedForAllotmentOfSecuritiesAndDueForRefundPrincipal');
 if(!sourceEl)throw new Error('source concept missing');
 state.values[sourceEl.prefix+':'+sourceEl.name]='123';
 const cu= v22ColumnModel(target).find(c=>c.excelCol==='CU'); if(!cu?.crossSheetRefs?.length)throw new Error('CU cross ref missing'); const dbg=WORKBOOK_CROSS_SHEET_ROW_CONCEPTS['SubclsifictionLiabilitisAssets']['34']; const dbgEl=state.elements.find(e=>e.name===dbg); if(!dbgEl)throw new Error('debug element missing '+dbg); const dbgQ=dbgEl.prefix+':'+dbgEl.name; if(state.values[dbgQ]!=='123')throw new Error('debug state mismatch '+dbgQ+'='+state.values[dbgQ]); const cuFormula=cu.formula[0][0]; const rr=/([A-Za-z0-9_. ]+)!([A-Z]{1,3})#/gi.exec('SubclsifictionLiabilitisAssets!L#'); if(!rr)throw new Error('regex no match'); if(rr[1]!=='SubclsifictionLiabilitisAssets'||rr[2]!=='L')throw new Error('regex '+rr[1]+' '+rr[2]); if(cuFormula!=='=SubclsifictionLiabilitisAssets!L#')throw new Error('CU formula '+cuFormula); const ownerCheck=v22ColumnModel(target).find(c=>(c.formula||[]).some(p=>String(Array.isArray(p)?p[0]:p).replace(/^=/,'')===String(cuFormula).replace(/^=/,''))); if(ownerCheck!==cu)throw new Error('owner mismatch'); const v=v22FormulaExpression('=SubclsifictionLiabilitisAssets!L#',tr,'current',target); if(v!==123)throw new Error('cross-sheet formula resolved to '+v);
 return {formulaParity:'pass',dropdownParity:'pass',crossSheet:'pass'};
})()`,ctx);
console.log(JSON.stringify(out));
