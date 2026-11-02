/* Resolve the same Python runtime for the build and the publishing gate. */
const {spawnSync}=require('node:child_process');
module.exports=function python(){
 if(process.env.PYTHON)return process.env.PYTHON;
 for(const command of ['python','python3']){
  const result=spawnSync(command,['--version'],{encoding:'utf8',windowsHide:true});
  if(!result.error&&result.status===0&&/Python 3\./.test(result.stdout||result.stderr))return command;
 }
 throw new Error('Python 3 is needed. Set PYTHON to its executable path.');
};
