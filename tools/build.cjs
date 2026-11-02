const {spawnSync}=require('node:child_process');
function run(command,args){const r=spawnSync(command,args,{stdio:'inherit',shell:false});if(r.error||r.status!==0){if(r.error)console.error(r.error.message);process.exit(r.status||1);}}
const python=require('./python.cjs')();
run(process.execPath,['tools/fix-data.cjs']);
run(python,['tools/fix-legacy.py']);
run(process.execPath,['tools/repair-game-results.cjs']);
run(python,['tools/refresh-legacy.py']);
run(python,['tools/clean-content.py']);
run(python,['tools/rebuild_site.py']);
run(process.execPath,['tools/compile-css.cjs']);
run(process.execPath,['tools/version-assets.cjs']);
run(process.execPath,['tools/check-site.cjs']);
run(process.execPath,['tools/check-globals.cjs']);
run(process.execPath,['tools/check-links.cjs']);
