const {chromium}=require('@playwright/test');const fs=require('node:fs'),path=require('node:path');
const root=path.resolve(__dirname,'..');
(async()=>{
 const browser=await chromium.launch({channel:'chrome',headless:true,args:['--mute-audio']});
 const mobile=process.argv.includes('--mobile');const context=await browser.newContext({viewport:{width:mobile?390:1365,height:mobile?844:1000},isMobile:mobile,hasTouch:mobile});
 await context.route('**/*',route=>{const u=new URL(route.request().url());if(!['127.0.0.1','localhost'].includes(u.hostname))return route.fulfill({status:200,body:'',contentType:u.pathname.endsWith('.css')?'text/css':'text/javascript'});return route.continue();});
 await context.addInitScript(()=>localStorage.setItem('qr_consent_v1','{"analytics":false}'));
 const names=fs.readdirSync(root).filter(f=>f.endsWith('.html')&&!/http-equiv=["']refresh/i.test(fs.readFileSync(path.join(root,f),'utf8')));
 const errors=[],overflows=[];let done=0;
 async function worker(){const page=await context.newPage();let current='';page.on('pageerror',e=>errors.push({page:current,error:e.message}));while(names.length){current=names.shift();try{await page.goto('http://127.0.0.1:4173/'+current,{waitUntil:'domcontentloaded',timeout:15000});await page.waitForTimeout(250);const overflow=await page.evaluate(()=>document.documentElement.scrollWidth>innerWidth+5);if(overflow)overflows.push(current);}catch(e){errors.push({page:current,error:e.message});}done++;if(done%50===0)console.log('Checked '+done+' pages');}await page.close();}
 await Promise.all([worker(),worker(),worker()]);await browser.close();fs.mkdirSync(path.join(root,'.cache'),{recursive:true});fs.writeFileSync(path.join(root,'.cache',mobile?'browser-smoke-mobile.json':'browser-smoke.json'),JSON.stringify({checked:done,errors,overflows},null,2));console.log(JSON.stringify({checked:done,errors:errors.length,overflows:overflows.length,examples:errors.slice(0,25)}));if(errors.length)process.exitCode=1;
})().catch(e=>{console.error(e);process.exitCode=1;});
