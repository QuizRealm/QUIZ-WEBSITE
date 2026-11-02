const {spawnSync}=require('node:child_process');
function run(command,args){const r=spawnSync(command,args,{stdio:'inherit',shell:false});if(r.error||r.status!==0){if(r.error)console.error(r.error.message);process.exit(r.status||1);}}
let python=process.env.PYTHON;
if(!python){for(const cmd of ['python','python3']){const r=spawnSync(cmd,['--version'],{encoding:'utf8',windowsHide:true});if(!r.error&&r.status===0&&/Python 3\./.test(r.stdout||r.stderr)){python=cmd;break;}}}
if(!python){console.error('Python 3 is needed to rebuild the static pages. Set PYTHON to its executable path.');process.exit(1);}
run(process.execPath,['tools/fix-data.cjs']);
run(python,['tools/fix-legacy.py']);
run(process.execPath,['tools/repair-game-results.cjs']);
run(python,['tools/refresh-legacy.py']);
run(python,['tools/clean-content.py']);
run(python,['tools/rebuild_site.py']);
run(process.execPath,['tools/compile-css.cjs']);
run(process.execPath,['tools/check-site.cjs']);
run(process.execPath,['tools/check-globals.cjs']);
run(process.execPath,['tools/check-links.cjs']);
