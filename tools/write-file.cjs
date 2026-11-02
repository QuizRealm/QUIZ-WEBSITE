/* Short retries tolerate Windows readers/scanners while retaining atomic writes. */
const fs=require('node:fs');const pause=new Int32Array(new SharedArrayBuffer(4));
function retry(operation){for(let attempt=0;;attempt++){try{return operation();}catch(error){if(attempt>=7||!['EPERM','EACCES','EBUSY','UNKNOWN'].includes(error.code))throw error;Atomics.wait(pause,0,0,50*(attempt+1));}}}
function write(file,text){if(fs.existsSync(file)&&retry(()=>fs.readFileSync(file,'utf8'))===text)return false;const temporary=file+'.build-tmp';retry(()=>fs.writeFileSync(temporary,text));retry(()=>fs.renameSync(temporary,file));return true;}
module.exports=write;
