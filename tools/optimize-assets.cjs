/* Re-encode large existing images in place; preserve filenames and proportions. */
const fs=require('node:fs'),path=require('node:path'),sharp=require('sharp');
const root=path.resolve(__dirname,'..');
function walk(dir){return fs.readdirSync(dir,{withFileTypes:true}).flatMap(e=>e.isDirectory()?walk(path.join(dir,e.name)):[path.join(dir,e.name)]);}
(async()=>{
  let before=0,after=0,count=0;
  const files=walk(path.join(root,'assets')).filter(f=>/\.(png|jpe?g|webp)$/i.test(f)&&!f.includes(path.sep+'thumbs'+path.sep)&&fs.statSync(f).size>180000);
  for(let i=0;i<files.length;i++){
    const file=files[i],input=fs.readFileSync(file);before+=input.length;
    let pipeline=sharp(input).rotate().resize({width:1600,height:1600,fit:'inside',withoutEnlargement:true});
    if(/\.png$/i.test(file))pipeline=pipeline.png({compressionLevel:9,adaptiveFiltering:true,palette:true,quality:95,effort:7});
    else if(/\.webp$/i.test(file))pipeline=pipeline.webp({quality:82,effort:5});else pipeline=pipeline.jpeg({quality:84,mozjpeg:true});
    const output=await pipeline.toBuffer();
    if(output.length<input.length*.9){fs.writeFileSync(file,output);after+=output.length;count++;}else after+=input.length;
    if((i+1)%70===0)console.log(`Images: ${i+1}/${files.length}`);
  }
  const catalog=JSON.parse(fs.readFileSync(path.join(root,'site','catalog.json'),'utf8'));
  fs.mkdirSync(path.join(root,'assets','thumbs'),{recursive:true});
  for(const image of new Set(catalog.map(g=>g.image))){const file=path.join(root,image);if(!fs.existsSync(file))continue;await sharp(file).resize(560,340,{fit:'cover'}).webp({quality:80}).toFile(path.join(root,'assets','thumbs',path.parse(image).name+'.webp'));}
  console.log(JSON.stringify({optimized:count,beforeMB:(before/1e6).toFixed(1),afterMB:(after/1e6).toFixed(1),savedMB:((before-after)/1e6).toFixed(1)}));
})().catch(error=>{console.error(error);process.exitCode=1;});
