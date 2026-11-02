const test=require('node:test'),assert=require('node:assert/strict'),vm=require('node:vm'),fs=require('node:fs'),path=require('node:path');
const code=fs.readFileSync(path.join(__dirname,'../assets/privacy.js'),'utf8');
function load(gpc=false){
 const values=new Map(),scripts=[],location={hostname:'thequizrealm.com',reload(){location.reloaded=true;}};
 const document={addEventListener(){},getElementById:()=>null,createElement:()=>({}),head:{append:script=>scripts.push(script)}};
 const window={dataLayer:[]},localStorage={getItem:k=>values.get(k)||null,setItem:(k,v)=>values.set(k,v)};
 vm.runInNewContext(code,{window,document,location,localStorage,navigator:{globalPrivacyControl:gpc},Date,JSON,Boolean});return{window,scripts,values,location};
}
test('production GTM is blocked until opt-in and excludes earlier queued events',()=>{
 const {window,scripts,location}=load();assert.equal(scripts.length,0);window.dataLayer.push({event:'before_consent'});window.RealmPrivacy.choose(true);assert.equal(scripts.length,1);assert.equal(scripts[0].src,'https://www.googletagmanager.com/gtm.js?id=GTM-ML3F7KLZ');assert.ok(!window.dataLayer.some(e=>e.event==='before_consent'));const consent=window.dataLayer.filter(e=>e[0]==='consent');assert.ok(consent.every(e=>e[2].ad_storage==='denied'&&e[2].ad_user_data==='denied'&&e[2].ad_personalization==='denied'));assert.equal(window.RealmPrivacy.analyticsAllowed(),true);window.RealmPrivacy.choose(false);assert.equal(window.RealmPrivacy.analyticsAllowed(),false);assert.equal(location.reloaded,true);
});
test('Global Privacy Control keeps analytics disabled',()=>{
 const {window,scripts}=load(true);window.RealmPrivacy.choose(true);assert.equal(scripts.length,0);assert.equal(window.RealmPrivacy.analyticsAllowed(),false);
});
