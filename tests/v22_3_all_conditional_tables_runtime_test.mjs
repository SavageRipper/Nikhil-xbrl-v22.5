import fs from 'node:fs'; import vm from 'node:vm';
const root=new URL('..',import.meta.url);
const bundle=fs.readFileSync(new URL('app-bundled.js',root),'utf8').replace(/\nload\(\);\s*$/,'\n');
const els=new Map(), mk=id=>{if(!els.has(id))els.set(id,{id,innerHTML:'',value:'',dataset:{},style:{},classList:{add(){},remove(){},contains(){return false}},addEventListener(){},querySelector(){return null},querySelectorAll(){return []}});return els.get(id)};
const documentStub={getElementById:mk,querySelectorAll(){return []},querySelector(){return null},createElement:tag=>mk(tag),addEventListener(){}};
const ctx={window:{addEventListener(){}},document:documentStub,localStorage:{getItem(){return null},setItem(){},removeItem(){}},console,Blob:function(){},URL:{createObjectURL(){return ''},revokeObjectURL(){}},setInterval,clearInterval,setTimeout,clearTimeout,performance:{now:()=>Date.now()},confirm:()=>true,FileReader:function(){},DOMParser:function(){},XMLSerializer:function(){},TextEncoder,TextDecoder,btoa:s=>Buffer.from(s,'binary').toString('base64'),atob:s=>Buffer.from(s,'base64').toString('binary'),unescape,encodeURIComponent};
vm.createContext(ctx); vm.runInContext(bundle,ctx,{timeout:120000}); ctx.MCA_DATA=ctx.window.MCA_DATA;
const result=vm.runInContext(`(()=>{
 Object.assign(state,{meta:MCA_DATA.meta,elements:MCA_DATA.elements,presentation:MCA_DATA.presentation,calculations:MCA_DATA.calculations,definitions:MCA_DATA.definitions,rules:MCA_DATA['business-rules'],elrs:MCA_DATA.elrs,values:{},prior:{},contexts:[],units:[],dimTables:{},profile:{cin:'',companyName:'',fyStart:'2025-04-01',fyEnd:'2026-03-31',currency:'Indian rupee',firstYear:false,financialStatements:'Standalone',inputScale:'Actuals',generalInfoEnabled:true,cashFlowMethod:''}});
 normalizeState();
 const models=v15AllTableModels(), rows=specificRuleRows(), checked=[], skipped=[];
 for(const m of models){
   const host=v22TableHostRole(m), candidates=rows.filter(r=>r.element===m.name||r.element===String(m.tableQ).split(':').pop());
   for(const rr of candidates){
     const names=conceptNameFromText(rr.rule); const quoted=[...String(rr.rule).matchAll(/[\"']([A-Za-z][A-Za-z0-9_]*)[\"']/g)].map(x=>x[1]); const control=(quoted.find(n=>n!==m.name)||names.find(n=>n!==m.name));
     if(!control||!/\b(?:yes|no)\b/i.test(rr.rule))continue;
     const ce=elementForName(control); if(!ce)continue;
     const ck=ce.prefix+':'+ce.name;
     state.values[ck]='false'; const no=v22TableApplicable(host,m,'current')===false;
     state.values[ck]='true'; const yes=v22TableApplicable(host,m,'current')===true;
     if(!no||!yes)checked.push({table:m.name,rule:rr.rule,control, no,yes});
   }
 }
 return {conditionalTables:checked.length, failures:checked.slice(0,10)};
})()`,ctx,{timeout:120000});
if(result.failures.length)throw new Error(JSON.stringify(result.failures));
console.log('PASS: conditional dimensional-table rules tested:',JSON.stringify(result));
