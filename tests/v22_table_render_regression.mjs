
import fs from 'node:fs'; import vm from 'node:vm'; import assert from 'node:assert/strict';
const root=new URL('..',import.meta.url);
const bundle=fs.readFileSync(new URL('app-bundled.js',root),'utf8').replace(/\nload\(\);\s*$/,'\n');
const elements=new Map();
function makeElement(id){return {id,innerHTML:'',textContent:'',value:'',hidden:false,dataset:{},style:{},classList:{add(){},remove(){},contains(){return false}},addEventListener(){},removeEventListener(){},querySelector(){return null},querySelectorAll(){return []},setAttribute(){},getAttribute(){return ''},focus(){},click(){}}}
const documentStub={getElementById(id){if(!elements.has(id))elements.set(id,makeElement(id));return elements.get(id)},querySelectorAll(){return []},querySelector(){return null},createElement(tag){return makeElement(tag)},addEventListener(){}};
const ctx={window:{addEventListener(){}},btoa(s){return Buffer.from(s,'binary').toString('base64')},atob(s){return Buffer.from(s,'base64').toString('binary')},unescape,encodeURIComponent,document:documentStub,localStorage:{getItem(){return null},setItem(){},removeItem(){}},console,Blob:function(){},URL:{createObjectURL(){return ''},revokeObjectURL(){}},setInterval,clearInterval,setTimeout,clearTimeout,performance:{now:()=>Date.now()},confirm:()=>true,FileReader:function(){},DOMParser:function(){},XMLSerializer:function(){},TextEncoder,TextDecoder};
vm.createContext(ctx); vm.runInContext(bundle,ctx,{timeout:120000}); ctx.MCA_DATA=ctx.window.MCA_DATA;
const result=vm.runInContext(`(()=>{
  Object.assign(state,{meta:MCA_DATA.meta,elements:MCA_DATA.elements,presentation:MCA_DATA.presentation,calculations:MCA_DATA.calculations,definitions:MCA_DATA.definitions,rules:MCA_DATA['business-rules'],elrs:MCA_DATA.elrs,active:'filing',section:0,values:{},prior:{},contexts:[],units:[],errors:[],warnings:[],dimTables:{},profile:{cin:'',companyName:'',fyStart:'2025-04-01',fyEnd:'2026-03-31',currency:'Indian rupee',firstYear:false,financialStatements:'Standalone',inputScale:'Actuals',generalInfoEnabled:true,cashFlowMethod:''}});
  normalizeState();
  const models=v15AllTableModels();
  if(models.length!==92)throw new Error('expected 92 hosted table models, found '+models.length);
  const hostRows=new Map();
  let rendered=0;
  for(const model of models){
    const host=v22TableHostRole(model);
    const html=v15TableCard(host,model,'FY 2025-26','FY 2024-25');
    if(!html.includes('v22-table-link-card') || !html.includes('See dimensional table'))throw new Error('popup trigger missing: '+model.tableQ);
    const popup=v22TableModal(host,model,'current');
    if(!popup.includes(model.tableQ) && !popup.includes('v22-popup-table'))throw new Error('popup not rendered: '+model.tableQ);
    if(!popup.includes('Add row'))throw new Error('popup add-row control missing: '+model.tableQ);
    if(model.lineItems.length<1)throw new Error('no line items: '+model.tableQ);
    if(/v15-axis-head|Dimension \\/ member|select[^>]*data-target="dimension"/i.test(html))
      throw new Error('axis/member exposed in user table: '+model.tableQ);
    if(html.includes('taxonomy table could not be resolved'))throw new Error('unresolved table message in '+model.tableQ);
    hostRows.set(host,(hostRows.get(host)||0)+1); rendered++;
  }
  const goodsRole=v15RoleForFact('in-gaap:GoodsPurchased',[{axis:'in-gaap:CategoriesOfGoodsPurchasedAxis',kind:'explicit',member:'in-gaap:GoodsPurchased1Member'}]);
if(goodsRole!=='[300600] Notes - Additional information statement of profit and loss')throw new Error('imported GoodsPurchased not mapped to 300600');
const loansRole=v15RoleForFact('in-gaap:LoansAndAdvancesGross',[
 {axis:'in-gaap:ClassificationBasedOnTimePeriodAxis',kind:'explicit',member:'in-gaap:ClassificationBasedOnTimePeriodMember'},
 {axis:'in-gaap:ClassificationOfLoansAndAdvancesAxis',kind:'explicit',member:'in-gaap:SecurityDepositsMember'},
 {axis:'in-gaap:ClassificationOfAssetsBasedOnSecurityAxis',kind:'explicit',member:'in-gaap:UnsecuredConsideredGoodMember'}
]);
if(loansRole!=='[200600] Notes - Subclassification and notes on liabilities and assets')throw new Error('imported LoansAndAdvances not mapped to 200600');
const p200=v15TableForConcept('[200600] Notes - Subclassification and notes on liabilities and assets','in-gaap:LoansAndAdvancesGross');
  if(!p200||p200.tableQ!=='in-gaap:LoansAndAdvancesTable')throw new Error('LoansAndAdvances concept not resolved');
  for(const q of ['in-gaap:DetailsOfGoodsPurchasedTable','in-gaap:DetailsOfManufacturedAndTradedGoodsTable','in-gaap:DetailsOfWorkInProgressTable']){
    if(!v15TableModels('[300600] Notes - Additional information statement of profit and loss').some(m=>m.tableQ===q))
      throw new Error('300600 child table not hosted: '+q);
  }
  return {rendered,hostCount:hostRows.size,hosts:Object.fromEntries(hostRows)};
})()`,ctx,{timeout:120000});
console.log('V22 table render regression:',JSON.stringify(result));
