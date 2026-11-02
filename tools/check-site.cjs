/* Static publishing gate: syntax, local resources, metadata, redirects and sitemap. */
const fs=require('node:fs'),path=require('node:path'),acorn=require('acorn');
const root=path.resolve(__dirname,'..'),errors=[];
const {assetVersion,localAsset,importReferences}=require('./version-assets.cjs');
const ignore=new Set(['.git','node_modules','.cache','site','tests','test-results','playwright-report']);
function walk(dir){return fs.readdirSync(dir,{withFileTypes:true}).flatMap(e=>e.isDirectory()?(ignore.has(e.name)?[]:walk(path.join(dir,e.name))):[path.join(dir,e.name)]);}
const files=walk(root),htmlFiles=files.filter(f=>f.endsWith('.html'));let scripts=0;
const publicPaths=new Set(files.map(file=>path.relative(root,file).replace(/\\/g,'/'))),checkedAssets=new Set();
function error(file,message){errors.push(path.relative(root,file)+': '+message);}
function syntax(source,file,module=false){try{acorn.parse(source,{ecmaVersion:'latest',sourceType:module?'module':'script',allowHashBang:true});}catch(e){error(file,e.message);}}
function checkRevision(reference,file){const target=localAsset(reference,file);if(target&&target.url.searchParams.get('v')!==assetVersion(target.file))error(file,'Missing or stale asset revision: '+reference);}
function checkAsset(reference,file,css=false){
 if(!reference||/^(?:[a-z]+:|\/\/|#)/i.test(reference)||/[${}\\<>]/.test(reference))return;
 let pathname;try{pathname=decodeURIComponent(reference.split(/[?#]/)[0]);}catch{error(file,'Invalid asset encoding: '+reference);return;}
 if(!/\.(?:png|jpe?g|webp|gif|svg|ico|avif|mp4|webm|woff2?|ttf|json|js|css)$/i.test(pathname))return;
 const target=pathname.startsWith('/')?path.resolve(root,'.'+pathname):css?path.resolve(path.dirname(file),pathname):path.resolve(root,pathname.replace(/^\.\//,''));
 const relative=path.relative(root,target).replace(/\\/g,'/'),key=path.relative(root,file)+':'+relative;if(checkedAssets.has(key))return;checkedAssets.add(key);
 if(!publicPaths.has(relative))error(file,'Missing or incorrectly cased asset: '+reference);
}
for(const file of files.filter(file=>/\.(?:html|js|json|css)$/.test(file))){
 const source=fs.readFileSync(file,'utf8');
 for(const match of source.matchAll(/(["'`])((?:\/?assets\/)[^"'`\n]+)\1/g))checkAsset(match[2],file);
 if(file.endsWith('.css')||file.endsWith('.html'))for(const match of source.matchAll(/url\(\s*["']?([^"')]+)["']?\s*\)/gi))checkAsset(match[1].trim(),file,file.endsWith('.css'));
}
for(const file of files.filter(f=>f.endsWith('.js'))){const text=fs.readFileSync(file,'utf8');syntax(text,file,/^\s*(?:import|export)\s/m.test(text));for(const reference of importReferences(text))checkRevision(reference.value,file);}
for(const file of htmlFiles){
  const text=fs.readFileSync(file,'utf8');const alias=/http-equiv=["']refresh/i.test(text);
  const titles=[...text.matchAll(/<title\b[^>]*>([\s\S]*?)<\/title>/gi)];if(titles.length!==1||!titles[0]?.[1].trim())error(file,'Expected exactly one nonempty title');
  const canonical=[...text.matchAll(/<link\b(?=[^>]*rel=["']canonical["'])[^>]*href=["']([^"']+)["'][^>]*>/gi)];
  if(canonical.length!==1||!canonical[0]?.[1].startsWith('https://thequizrealm.com/'))error(file,'Missing or conflicting canonical URL');
  if(!alias&&!/<meta\b[^>]*name=["']description["']/i.test(text))error(file,'Missing description');
  const loaded=new Set();let classic='';
  for(const m of text.matchAll(/<script\b([^>]*)>([\s\S]*?)<\/script>/gi)){
    const src=m[1].match(/\bsrc=["']([^"']+)["']/i)?.[1];const type=m[1].match(/\btype=["']([^"']+)["']/i)?.[1]||'';
    if(src){if(loaded.has(src))error(file,'Duplicate script '+src);loaded.add(src);if(/\.html(?:[?#]|$)/.test(src))error(file,'HTML loaded as script: '+src);continue;}
    if(['application/ld+json','importmap','application/json'].includes(type)){try{JSON.parse(m[2]);}catch(e){error(file,'Invalid script JSON: '+e.message);}continue;}
    if(type&&type!=='module'&&type!=='text/javascript')continue;
    scripts++;syntax(m[2],file,type==='module');if(type!=='module')classic+='\n'+m[2];
    for(const reference of importReferences(m[2]))checkRevision(reference.value,file);
  }
  if(classic)syntax(classic,file);
  const markup=text.replace(/<script\b[^>]*>[\s\S]*?<\/script>/gi,'').replace(/<style\b[^>]*>[\s\S]*?<\/style>/gi,'');
  const styles=new Set();for(const match of markup.matchAll(/<link\b(?=[^>]*\brel=["']stylesheet["'])[^>]*\bhref=["']([^"']+)["'][^>]*>/gi)){if(styles.has(match[1]))error(file,'Duplicate stylesheet '+match[1]);styles.add(match[1]);}
  for(const tag of markup.matchAll(/<[a-z][^>]*>/gi))if([...tag[0].matchAll(/\bid\s*=\s*["'][^"']+["']/gi)].length>1)error(file,'Duplicate ID attributes on '+tag[0].slice(0,100));
  for(const m of markup.matchAll(/\b(?:href|src|poster)\s*=\s*["']([^"']+)["']/gi)){
    const ref=m[1].replace(/&amp;/g,'&');if(/^(?:[a-z]+:|\/\/|#)/i.test(ref)||!ref||/[${}]/.test(ref))continue;
    checkRevision(ref,file);
    let url;try{url=new URL(ref,'https://local.test/'+path.relative(root,file).replace(/\\/g,'/'));}catch{error(file,'Invalid URL '+ref);continue;}
    const dest=path.join(root,decodeURIComponent(url.pathname));if(!fs.existsSync(dest))error(file,'Missing local reference '+ref);
    else if(!fs.statSync(dest).isDirectory()&&!publicPaths.has(path.relative(root,dest).replace(/\\/g,'/')))error(file,'Incorrect reference casing '+ref);
  }
  if(/cdn\.tailwindcss\.com/.test(text))error(file,'Runtime Tailwind CDN remains');
  if(/<script[^>]*src=["'][^"']*(?:pagead2|googletagmanager)/.test(text))error(file,'Unconditional tracking/advertising loader remains');
}
const sitemap=fs.readFileSync(path.join(root,'sitemap.xml'),'utf8');const urls=[...sitemap.matchAll(/<loc>(.*?)<\/loc>/g)].map(m=>m[1]);
const sitemapCheck=require('node:child_process').spawnSync(require('./python.cjs')(),['tools/sitemap.py','--check'],{cwd:root,encoding:'utf8',windowsHide:true});
if(sitemapCheck.error||sitemapCheck.status!==0)error(path.join(root,'sitemap.xml'),sitemapCheck.error?.message||sitemapCheck.stderr.trim()||'Sitemap audit failed');
const catalog=JSON.parse(fs.readFileSync(path.join(root,'site','catalog.json'),'utf8'));for(const game of catalog){for(const name of [game.url.split('?')[0],game.image])if(!fs.existsSync(path.join(root,name)))error('site/catalog.json','Missing '+name);}
const summary={htmlPages:htmlFiles.length,inlineScripts:scripts,sitemapURLs:urls.length,errors:errors.length};console.log(JSON.stringify(summary,null,2));if(errors.length){console.error(errors.slice(0,100).join('\n'));process.exitCode=1;}
