/* Verify canonical content is reachable and has real links from other pages. */
const fs=require('node:fs'),path=require('node:path');
const root=path.resolve(__dirname,'..'),origin='https://thequizrealm.com';
const sitemap=fs.readFileSync(path.join(root,'sitemap.xml'),'utf8');
const normalize=url=>{const parsed=new URL(url,origin);if(parsed.origin!==origin)return null;return decodeURIComponent(parsed.pathname).replace(/\/index\.html$/,'/');};
const urls=[...sitemap.matchAll(/<loc>(.*?)<\/loc>/g)].map(m=>normalize(m[1]));
const outgoing=new Map(urls.map(url=>[url,new Set()])),incoming=new Map(urls.map(url=>[url,new Set()]));
for(const source of urls){
 const file=path.join(root,source==='/'?'index.html':source);
 const html=fs.readFileSync(file,'utf8').replace(/<script\b[^>]*>[\s\S]*?<\/script>/gi,'').replace(/<style\b[^>]*>[\s\S]*?<\/style>/gi,'');
 for(const match of html.matchAll(/<a\b[^>]*\bhref=["']([^"']+)["']/gi)){
  try{const target=normalize(new URL(match[1].replace(/&amp;/g,'&'),origin+source));if(target&&target!==source&&incoming.has(target)){outgoing.get(source).add(target);incoming.get(target).add(source);}}catch{}
 }
}
const reached=new Set(['/']),queue=['/'];while(queue.length){for(const target of outgoing.get(queue.shift())||[])if(!reached.has(target)){reached.add(target);queue.push(target);}}
const orphans=urls.filter(url=>incoming.get(url).size===0),unreachable=urls.filter(url=>!reached.has(url));
const weaklyLinked=urls.filter(url=>incoming.get(url).size<2);
const summary={canonicalPages:urls.length,internalLinks:[...outgoing.values()].reduce((n,links)=>n+links.size,0),orphanPages:orphans.length,pagesWithFewerThanTwoIncomingLinks:weaklyLinked.length,unreachableFromHome:unreachable.length};
const report={...summary,orphans,unreachable,pages:urls.map(url=>({url,incoming:[...incoming.get(url)],outgoing:[...outgoing.get(url)]}))};
const readingPaths=JSON.parse(fs.readFileSync(path.join(root,'site','reading-paths.json'),'utf8'));
for(const route of readingPaths)for(const member of route.pages)if(!incoming.has('/'+member))throw new Error('Reading path points outside canonical content: '+member);
fs.mkdirSync(path.join(root,'.cache'),{recursive:true});fs.writeFileSync(path.join(root,'.cache','internal-links.json'),JSON.stringify(report,null,2));
console.log(JSON.stringify(summary,null,2));if(weaklyLinked.length||unreachable.length){console.error(JSON.stringify({orphans,weaklyLinked,unreachable}));process.exitCode=1;}
