
const fs=require('fs'),vm=require('vm'),assert=require('assert');
const code=fs.readFileSync(require('path').resolve(__dirname,'..','app.js'),'utf8').replace(/\nload\(\);\s*$/,'\n')+
'\nglobalThis.S=state;globalThis.scale=scaleFactor;globalThis.entry=scaledForEntry;globalThis.xml=valueForXml;globalThis.dec=decimalsForFact;';
const sandbox={
 console,setTimeout,clearTimeout,setInterval,clearInterval,URL,Blob,FileReader:function(){},DOMParser:function(){},XMLSerializer:function(){},
 CSS:{escape:s=>String(s)},atob:s=>Buffer.from(s,'base64').toString('binary'),btoa:s=>Buffer.from(s,'binary').toString('base64'),
 confirm:()=>true,alert:()=>{},prompt:()=>null,localStorage:{getItem:()=>null,setItem:()=>{},removeItem(){}},
 document:{getElementById:()=>({onclick:null,click(){},value:'',textContent:'',style:{},classList:{add(){},remove(){}}}),querySelector:()=>null,querySelectorAll:()=>[],addEventListener(){},createElement(){return {}},implementation:{createDocument(){return {}}}},
 window:{addEventListener(){},removeEventListener(){}},navigator:{},indexedDB:null
};
sandbox.globalThis=sandbox;vm.createContext(sandbox);vm.runInContext(code,sandbox,{timeout:30000});
const money={type:'xbrli:monetaryItemType'};
const nonMoney={type:'xbrli:sharesItemType'};
const expected={Actuals:373531000,Thousands:373531000,Lakhs:373531000,Millions:373531000,Crores:373531000,Billions:373531000};
for(const [scale,canonical] of Object.entries(expected)){
 sandbox.S.profile.inputScale=scale;
 const ui={Actuals:'373531000',Thousands:'373531',Lakhs:'3735.31',Millions:'373.531',Crores:'37.3531',Billions:'0.373531'}[scale];
 assert.strictEqual(Number(sandbox.entry(canonical,money)),Number(ui),scale+' UI conversion');
 assert.strictEqual(Number(sandbox.xml(ui,money)),canonical,scale+' XML conversion');
 assert.strictEqual(sandbox.entry('100',nonMoney),'100',scale+' non-monetary');
}
sandbox.S.profile.inputScale='Lakhs';
assert.strictEqual(sandbox.dec({value:'3735.31',element:money}),'-3');
assert.strictEqual(sandbox.dec({value:'360',element:money}),'-5');
console.log('PASS: V22 rounding logic across six presentation scales');
