/* Publish matching local scripts/styles together, including module dependencies. */
const fs=require('node:fs'),path=require('node:path'),crypto=require('node:crypto'),acorn=require('acorn');
const root=path.resolve(__dirname,'..'),origin='https://thequizrealm.com';
const ignored=new Set(['.git','node_modules','site','tools','tests','docs','.cache','test-results','playwright-report']);
const write=require('./write-file.cjs');
function files(directory){return fs.readdirSync(directory,{withFileTypes:true}).flatMap(entry=>entry.isDirectory()?(ignored.has(entry.name)?[]:files(path.join(directory,entry.name))):[path.join(directory,entry.name)]);}
function assetVersion(file){return crypto.createHash('sha256').update(fs.readFileSync(file,'utf8').replace(/\r\n/g,'\n')).digest('hex').slice(0,12);}
function localAsset(reference,document){
 let url;try{url=new URL(reference,origin+'/'+path.relative(root,document).replace(/\\/g,'/'));}catch{return null;}
 if(url.origin!==origin||! /\.(?:js|css)$/i.test(url.pathname))return null;
 const file=path.resolve(root,'.'+decodeURIComponent(url.pathname));
 if(!file.startsWith(root+path.sep)||!fs.existsSync(file)||!fs.statSync(file).isFile())return null;
 return {file,url};
}
function walk(node,visit){if(!node||typeof node!=='object')return;if(node.type)visit(node);for(const value of Object.values(node)){if(Array.isArray(value))value.forEach(child=>walk(child,visit));else if(value&&typeof value==='object')walk(value,visit);}}
function importReferences(source){
 if(!/\b(?:import|export)\b/.test(source))return [];
 const ast=acorn.parse(source,{ecmaVersion:'latest',sourceType:/^\s*(?:import|export)\s/m.test(source)?'module':'script'}),references=[];
 walk(ast,node=>{if(['ImportDeclaration','ExportNamedDeclaration','ExportAllDeclaration','ImportExpression'].includes(node.type)&&node.source?.type==='Literal'&&typeof node.source.value==='string')references.push(node.source);});
 return references;
}
function run(){
 const publicFiles=files(root),versions=new Map(),visiting=new Set();let changedModules=0,changedPages=0;
 function revision(file){
  if(versions.has(file))return versions.get(file);
  if(visiting.has(file))throw new Error('Circular local module imports need an explicit bundle: '+path.relative(root,file));
  visiting.add(file);
  if(file.endsWith('.js')){
   let source=fs.readFileSync(file,'utf8');const edits=[];
   for(const reference of importReferences(source)){
    const target=localAsset(reference.value,file);if(!target)continue;
    target.url.searchParams.set('v',revision(target.file));
    edits.push([reference.start,reference.end,JSON.stringify(target.url.pathname+target.url.search+target.url.hash)]);
   }
   for(const [start,end,replacement] of edits.sort((a,b)=>b[0]-a[0]))source=source.slice(0,start)+replacement+source.slice(end);
   if(write(file,source))changedModules++;
  }
  const value=assetVersion(file);visiting.delete(file);versions.set(file,value);return value;
 }
 for(const file of publicFiles.filter(file=>/\.(?:js|css)$/i.test(file)))revision(file);
 for(const file of publicFiles.filter(file=>file.endsWith('.html'))){
  let source=fs.readFileSync(file,'utf8');
  source=source.replace(/<script\b([^>]*)>([\s\S]*?)<\/script>/gi,(full,attributes,code)=>{
   if(/\bsrc\s*=|type=["'](?:application\/|importmap)/i.test(attributes))return full;
   const edits=[];for(const reference of importReferences(code)){const target=localAsset(reference.value,file);if(!target)continue;target.url.searchParams.set('v',revision(target.file));edits.push([reference.start,reference.end,JSON.stringify(target.url.pathname+target.url.search+target.url.hash)]);}
   for(const [start,end,replacement] of edits.sort((a,b)=>b[0]-a[0]))code=code.slice(0,start)+replacement+code.slice(end);
   return `<script${attributes}>${code}</script>`;
  });
  source=source.replace(/(\b(?:src|href)\s*=\s*["'])([^"']+)(["'])/gi,(full,start,reference,end)=>{
   const target=localAsset(reference.replace(/&amp;/g,'&'),file);if(!target)return full;
   target.url.searchParams.set('v',revision(target.file));return start+(target.url.pathname+target.url.search+target.url.hash).replace(/&/g,'&amp;')+end;
  });
  const styles=new Set();source=source.replace(/<link\b(?=[^>]*\brel=["']stylesheet["'])[^>]*>/gi,tag=>{const href=tag.match(/\bhref=["']([^"']+)["']/i)?.[1];if(!href)return tag;if(styles.has(href))return '';styles.add(href);return tag;});
  if(write(file,source))changedPages++;
 }
 console.log(JSON.stringify({revisionedAssets:versions.size,updatedModules:changedModules,updatedPages:changedPages}));
}
module.exports={assetVersion,localAsset,importReferences};if(require.main===module)run();
