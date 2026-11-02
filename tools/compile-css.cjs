/* Compile each retained game's existing Tailwind theme into a local stylesheet. */
const fs=require('node:fs'),path=require('node:path'),vm=require('node:vm'),crypto=require('node:crypto');
const postcss=require('postcss'),tailwind=require('tailwindcss');
const root=path.resolve(__dirname,'..'),output=path.join(root,'assets','styles');fs.mkdirSync(output,{recursive:true});
const write=require('./write-file.cjs');
function files(dir){return fs.readdirSync(dir,{withFileTypes:true}).flatMap(e=>e.isDirectory() ? (['.git','node_modules','.cache','site','tests','test-results','playwright-report'].includes(e.name)?[]:files(path.join(dir,e.name))) : e.name.endsWith('.html')?[path.join(dir,e.name)]:[]);}
const groups=new Map();
for(const file of files(root)){
  let html=fs.readFileSync(file,'utf8');if(!html.includes('tailwind.config')&&!html.includes('cdn.tailwindcss.com')&&!html.includes('realm:legacy-css'))continue;
  const context={tailwind:{config:{},colors:require('tailwindcss/colors'),defaultTheme:require('tailwindcss/defaultTheme')},console:{log(){},warn(){},error(){}}};
  for(const m of html.matchAll(/<script\b[^>]*>([\s\S]*?)<\/script>/gi))if(m[1].includes('tailwind.config')){
    try{vm.runInNewContext(m[1],context,{timeout:1500});}catch(error){throw new Error(path.relative(root,file)+': invalid theme: '+error.message);}
  }
  const config=context.tailwind.config;
  const id=crypto.createHash('sha256').update(JSON.stringify(config)).digest('hex').slice(0,12);
  if(!groups.has(id))groups.set(id,{config,content:[],files:[]});
  const group=groups.get(id);group.content.push({raw:html,extension:'html'});group.files.push(file);
  const loader=`<!-- realm:legacy-css --><link rel="stylesheet" href="/assets/styles/${id}.css"><script>var tailwind = window.tailwind || {config:{}};</script>`;
  html=html.replace(/<!-- realm:legacy-css -->\s*<link[^>]+>\s*<script>var tailwind[\s\S]*?<\/script>/g,'');
  let first=true;
  html=html.replace(/<script\b[^>]*src=["']https:\/\/cdn\.tailwindcss\.com[^"']*["'][^>]*>\s*<\/script>/gi,()=>{if(!first)return '';first=false;return loader;});
  if(first)html=html.replace(/<head\b[^>]*>/i,m=>m+loader);
  write(file,html);
}
(async()=>{
  for(const [id,group] of groups){
    const config={...group.config,content:group.content,corePlugins:{...(group.config.corePlugins||{}),preflight:true}};
    const result=await postcss([tailwind(config)]).process('@tailwind base; @tailwind components; @tailwind utilities;',{from:undefined});
    write(path.join(output,id+'.css'),'/*! tailwindcss v3.4.19 | MIT License | https://tailwindcss.com */\n'+result.css.replace(/\/\*[\s\S]*?\*\//g,'').replace(/\s+/g,' ').trim()+'\n');
  }
  const used=new Set([...groups.keys()].map(k=>k+'.css'));
  for(const entry of fs.readdirSync(output))if(/^[a-f0-9]{12}\.css$/.test(entry)&&!used.has(entry))fs.unlinkSync(path.join(output,entry));
  fs.copyFileSync(path.join(root,'node_modules','tailwindcss','LICENSE'),path.join(output,'tailwind.LICENSE.txt'));
  console.log(`Compiled ${[...groups.values()].reduce((n,g)=>n+g.files.length,0)} game pages into ${groups.size} local theme bundles.`);
})().catch(error=>{console.error(error);process.exitCode=1;});
