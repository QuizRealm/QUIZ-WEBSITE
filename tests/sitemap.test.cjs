const {test}=require('node:test'),assert=require('node:assert/strict');
const {spawnSync}=require('node:child_process'),path=require('node:path');
test('sitemap publishing regressions: discovery, exclusions, canonicals and XML',()=>{
 const result=spawnSync(require('../tools/python.cjs')(),['-m','unittest','discover','-s','tests','-p','test_sitemap.py'],{cwd:path.resolve(__dirname,'..'),encoding:'utf8',windowsHide:true});
 assert.equal(result.status,0,result.error?.message||result.stdout+result.stderr);
});
