import fs from 'node:fs';
import vm from 'node:vm';
import assert from 'node:assert/strict';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const root=path.dirname(fileURLToPath(import.meta.url));
const bundle=fs.readFileSync(path.join(root,'..','app-bundled.js'),'utf8');
const source=bundle.replace(/\nload\(\);\s*$/,'\n');
const elements=new Map();
function makeElement(id){return {id,innerHTML:'',textContent:'',value:'',hidden:false,dataset:{},style:{},classList:{add(){},remove(){},contains(){return false}},addEventListener(){},removeEventListener(){},querySelector(){return null},querySelectorAll(){return []},setAttribute(){},getAttribute(){return ''},focus(){},click(){}};}
const documentStub={
 getElementById(id){if(!elements.has(id))elements.set(id,makeElement(id));return elements.get(id)},
 querySelectorAll(){return []},querySelector(){return null},addEventListener(){},createElement(tag){return makeElement(tag)}
};
const context={window:{addEventListener(){}},btoa(s){return Buffer.from(s,'binary').toString('base64')},atob(s){return Buffer.from(s,'base64').toString('binary')},unescape,encodeURIComponent,document:documentStub,localStorage:{getItem(){return null},setItem(){},removeItem(){}},console,Blob:function(){},URL:{createObjectURL(){return ''},revokeObjectURL(){}},setInterval,clearInterval,setTimeout,clearTimeout,performance:{now:()=>Date.now()},confirm:()=>true,FileReader:function(){},DOMParser:function(){},XMLSerializer:function(){},TextEncoder,TextDecoder};
vm.createContext(context);
vm.runInContext(source,context,{timeout:120000});

const result=vm.runInContext(`
(() => {
 Object.assign(state,{
   meta:window.MCA_DATA.meta,elements:window.MCA_DATA.elements,presentation:window.MCA_DATA.presentation,
   calculations:window.MCA_DATA.calculations,definitions:window.MCA_DATA.definitions,
   rules:window.MCA_DATA['business-rules'],elrs:window.MCA_DATA.elrs,
   active:'filing',section:0,values:{},prior:{},contexts:[],units:[],errors:[],warnings:[],
   profile:{cin:'U51900DL1992PTC197034',companyName:'TEST',fyStart:'2024-04-01',fyEnd:'2025-03-31',
     currency:'INR',firstYear:false,financialStatements:'Standalone',inputScale:'Lakhs',
     generalInfoEnabled:true,cashFlowMethod:'Indirect'}
 });
 normalizeState();
 const roles=window.MCA_DATA.elrs.map(x=>x.name);
 for(let i=0;i<roles.length;i++){
   state.section=i; renderNav();renderTabs();render();
   const html=document.getElementById('content').innerHTML;
   if(!html.trim()) throw new Error('Blank filing tab '+roles[i]);
 }
 const allModels=v15AllTableModels();
 const uniqueModels=new Map(allModels.map(x=>[x.id,x]));
 if(uniqueModels.size<92)throw new Error('Expected at least 92 resolved table models, got '+uniqueModels.size);
 for(const model of uniqueModels.values()){
   const html=v22TableModal(model.role,model,'current');
   if(!html.includes('See') && !html.includes('Actions'))throw new Error('Popup table did not render for '+model.id);
   if(!v22ColumnModel(model).length)throw new Error('No workbook/taxonomy columns for '+model.id);
 }
 const role='[200300] Notes - Borrowings';
 const models=v15TableModels(role);
 const borrow=models.find(x=>x.name==='ClassificationOfBorrowingsTable');
 if(!borrow)throw new Error('Borrowings classification table missing');
 const card=v15TableCard(role,borrow,'2025-26','2024-25');
 if(!card.includes('See dimensional table'))throw new Error('Table link missing '+card.slice(0,500));
 const loan=v15TableModels('[200600] Notes - Subclassification and notes on liabilities and assets').find(x=>x.name==='LoansAndAdvancesTable');
 if(!loan)throw new Error('Loans and advances table missing');
 const goods=v15TableModels('[300600] Notes - Additional information statement of profit and loss').find(x=>x.name==='DetailsOfGoodsPurchasedTable');
 if(!goods)throw new Error('Goods purchased table missing');
 state.dimTables={};
 const row=v15CreateBlankTableRow(role,borrow.id);
 if(!row)throw new Error('Could not create borrowing row');
 const cols=v22ColumnModel(borrow);
 const axisCols=cols.filter(c=>c.kind==='axis');
 if(axisCols.length!==3)throw new Error('Borrowings axis selector count is '+axisCols.length);
 const axisOptions=axisCols.map(c=>v22AxisOptions(borrow,c.axisQ).length);
 if(axisOptions[0]!==2||axisOptions[1]<30||axisOptions[2]!==2)throw new Error('Borrowing dropdown option cardinality '+axisOptions.join(','));
 v22SetColumnValue(row,cols.find(c=>c.kind==='axis'&&c.axisQ.endsWith('ClassificationBasedOnTimePeriodAxis')),'current','in-gaap:ShortTermMember',borrow);
 v22SetColumnValue(row,cols.find(c=>c.kind==='axis'&&c.axisQ.endsWith('ClassificationOfBorrowingsAxis')),'current','in-gaap:LoansTakenForVehiclesMember',borrow);
 v22SetColumnValue(row,cols.find(c=>c.kind==='axis'&&c.axisQ.endsWith('SubclassificationOfBorrowingsAxis')),'current','in-gaap:SecuredBorrowingsMember',borrow);
 const bcol=cols.find(c=>c.key==='in-gaap:Borrowings');
 v22SetColumnValue(row,bcol,'current','100',borrow);
 const html=v22TableModal(role,borrow,'current');
 if(!html.includes('Classification based on time period')||!html.includes('Classification of borrowings')||!html.includes('Subclassification of borrowings'))throw new Error('Borrowing modal columns missing');
 if(!html.includes('select')||!html.includes('Loans taken for vehicles'))throw new Error('Borrowing dropdown not rendered');
 v22RecalculateTableRow(role,borrow,row,'current');
 return {filingTabs:roles.length,borrowModels:models.length,loan:!!loan,goods:!!goods,axisOptions};
})()
`,context,{timeout:120000});
assert.equal(result.filingTabs,47);
console.log(`V22.1 runtime renderer regression: PASS (${result.filingTabs} ELRs rendered; popup table engine, axes and dropdowns verified)`);
