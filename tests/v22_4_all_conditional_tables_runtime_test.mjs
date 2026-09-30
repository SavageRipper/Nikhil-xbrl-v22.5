import fs from 'node:fs'; import vm from 'node:vm';
const root=new URL('..',import.meta.url);
const bundle=fs.readFileSync(new URL('app-bundled.js',root),'utf8').replace(/\nload\(\);\s*$/,'\n');
const els=new Map(), mk=id=>{if(!els.has(id))els.set(id,{id,innerHTML:'',value:'',dataset:{},style:{},classList:{add(){},remove(){},contains(){return false}},addEventListener(){},querySelector(){return null},querySelectorAll(){return []}});return els.get(id)};
const documentStub={getElementById:mk,querySelectorAll(){return []},querySelector(){return null},createElement:tag=>mk(tag),addEventListener(){}};
const ctx={window:{addEventListener(){}},document:documentStub,localStorage:{getItem(){return null},setItem(){},removeItem(){}},console,Blob:function(){},URL:{createObjectURL(){return''},revokeObjectURL(){}},setInterval,clearInterval,setTimeout,clearTimeout,performance:{now:()=>Date.now()},confirm:()=>true,FileReader:function(){},DOMParser:function(){},XMLSerializer:function(){},TextEncoder,TextDecoder,btoa:s=>Buffer.from(s,'binary').toString('base64'),atob:s=>Buffer.from(s,'base64').toString('binary'),unescape,encodeURIComponent};
vm.createContext(ctx); vm.runInContext(bundle,ctx,{timeout:120000}); ctx.MCA_DATA=ctx.window.MCA_DATA;
const result=vm.runInContext(`(()=>{
Object.assign(state,{meta:MCA_DATA.meta,elements:MCA_DATA.elements,presentation:MCA_DATA.presentation,calculations:MCA_DATA.calculations,definitions:MCA_DATA.definitions,rules:MCA_DATA['business-rules'],elrs:MCA_DATA.elrs,values:{},prior:{},contexts:[],units:[],dimTables:{},profile:{cin:'',companyName:'',fyStart:'2025-04-01',fyEnd:'2026-03-31',currency:'Indian rupee',firstYear:false,financialStatements:'Standalone',inputScale:'Actuals',generalInfoEnabled:true,cashFlowMethod:''}});
normalizeState();
const models=v15AllTableModels(), byName=new Map(models.map(m=>[m.name,m]));
const rules=specificRuleRows().filter(r=>/table/i.test(r.element)&&/\\b(?:yes|no|greater than zero|more than zero)\\b/i.test(r.rule));
const cases=[], failures=[]; let currentRule='';
function setControls(names,kind,on){const src=kind==='prior'?state.prior:state.values;for(const n of names){const e=elementForName(n);if(!e)continue;src[e.prefix+':'+e.name]=/greater than zero|more than zero/i.test(currentRule)?(on?'1':'0'):(on?'true':'false');}}
for(const r of rules){
  const m=byName.get(r.element); if(!m){failures.push({table:r.element,reason:'no table model'});continue;}
  const names=conceptNameFromText(r.rule);
  if(!names.length){failures.push({table:r.element,rule:r.rule,reason:'controller not resolved'});continue;}
  for(const kind of ['current','prior']){
    currentRule=r.rule; setControls(names,kind,false); const off=v22TableApplicable(v22TableHostRole(m),m,kind);
    setControls(names,kind,true); const on=v22TableApplicable(v22TableHostRole(m),m,kind);
    const ok=off===false&&on===true; cases.push({table:r.element,controller:names.join('|'),kind,off,on,ok}); if(!ok)failures.push(cases[cases.length-1]);
    if(/\\bor\\b/i.test(r.rule)&&names.length>1){
      for(const n of names){const src=kind==='prior'?state.prior:state.values; for(const other of names){const e=elementForName(other); if(e)src[e.prefix+':'+e.name]=(other===n)?(/greater than zero|more than zero/i.test(r.rule)?'1':'true'):(/greater than zero|more than zero/i.test(r.rule)?'0':'false');}
        const partial=v22TableApplicable(v22TableHostRole(m),m,kind); if(partial!==true)failures.push({table:r.element,kind,controller:n,partial,rule:r.rule});
      }
    }
  }
}
return {rules:rules.length,cases:cases.length,failures};
})()`,ctx,{timeout:120000});
if(result.failures.length) throw new Error(JSON.stringify(result,null,2));
console.log('PASS: exhaustive conditional-table runtime coverage',JSON.stringify(result));