
const fs=require('fs'), vm=require('vm'), assert=require('assert');
const code=fs.readFileSync(require('path').resolve(__dirname,'..','app.js'),'utf8').replace(/\nload\(\);\s*$/,'\n')+
'\n;globalThis.__TEST_STATE=state;globalThis.__v213ConditionalInactive=v213ConditionalInactive;globalThis.__v213ClearInactiveFacts=v213ClearInactiveFacts;globalThis.__v213ConditionalTargets=v213ConditionalTargets;globalThis.__v213FactAllowedForGeneration=v213FactAllowedForGeneration;';
const sandbox={
  console,setTimeout,clearTimeout,setInterval,clearInterval,URL,Blob,FileReader:function(){},DOMParser:function(){},XMLSerializer:function(){},
  CSS:{escape:s=>String(s)},atob:s=>Buffer.from(s,'base64').toString('binary'),btoa:s=>Buffer.from(s,'binary').toString('base64'),
  confirm:()=>true,alert:()=>{},prompt:()=>null,
  localStorage:{getItem:()=>null,setItem:()=>{},removeItem:()=>{}},
  document:{getElementById:()=>({onclick:null,click:()=>{},value:'',textContent:'',style:{},classList:{add:()=>{},remove:()=>{}},hidden:false}),
            querySelector:()=>null,querySelectorAll:()=>[],addEventListener:()=>{},createElement:()=>({}),implementation:{createDocument:()=>({})}},
  window:{addEventListener:()=>{},removeEventListener:()=>{}},navigator:{},indexedDB:null
};
sandbox.globalThis=sandbox;
vm.createContext(sandbox);
vm.runInContext(code,sandbox,{timeout:15000});
const S=sandbox.__TEST_STATE;

function reset(rules, values={}, prior={}){
  S.elements=[]; S.values=values; S.prior=prior;
  S.rules={'Specific rules for elements':rules};
  S.dimTables={}; S.richText={}; S.priorRichText={};
}
function addEl(name,type='xbrli:stringItemType',abstract='false'){
  S.elements.push({prefix:'in-ca',name,label:name,type,abstract});
}
const rules=[['SectionUnderWhichCompanyIsSubsidiary','Mandatory if WhetherCompanyIsSubsidiaryCompany is yes.']];

reset(rules,{
  'in-ca:WhetherCompanyIsSubsidiaryCompany':'No',
  'in-ca:SectionUnderWhichCompanyIsSubsidiary':'Section 186'
});
addEl('WhetherCompanyIsSubsidiaryCompany','xbrli:booleanItemType');
addEl('SectionUnderWhichCompanyIsSubsidiary');
assert.strictEqual(sandbox.__v213ConditionalInactive('in-ca:SectionUnderWhichCompanyIsSubsidiary','current'),true);
sandbox.__v213ClearInactiveFacts();
assert.strictEqual(S.values['in-ca:SectionUnderWhichCompanyIsSubsidiary'],undefined);
assert.strictEqual(sandbox.__v213FactAllowedForGeneration('in-ca:SectionUnderWhichCompanyIsSubsidiary','current'),false);

reset(rules,{'in-ca:WhetherCompanyIsSubsidiaryCompany':'Yes'});
addEl('WhetherCompanyIsSubsidiaryCompany','xbrli:booleanItemType');
addEl('SectionUnderWhichCompanyIsSubsidiary');
assert.strictEqual(sandbox.__v213ConditionalInactive('in-ca:SectionUnderWhichCompanyIsSubsidiary','current'),false);
assert.strictEqual(sandbox.__v213ConditionalTargets().has('in-ca:SectionUnderWhichCompanyIsSubsidiary'),true);

console.log('PASS: V22 conditional dependency unit test');
