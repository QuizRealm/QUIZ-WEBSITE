/* Consolidate the repeated legacy achievement hooks into the shared result API. */
const fs=require('node:fs'),path=require('node:path'),acorn=require('acorn');const root=path.resolve(__dirname,'..');
const games={
 'quiz-batman-trivia.html':['showResults','Batman Trivia','sessionScore','10'],
 'quiz-superhero-visual.html':['showResults','Superhero Visual Quiz','score','10'],
 'quiz-superman-legacy.html':['showResults','Superman Legacy','sessionScore','10'],
 'quiz-webslinger.html':['showResults','Webslinger Quiz','sessionScore','10'],
 'quiz-xmas-history.html':['showResults','Christmas History','score','questions.length'],
 'quiz-xmas-quotes.html':['showResults','Christmas Quotes','score','quizQuestions.length'],
 'quiz-xmas-visual.html':['endGame','Christmas Visual Quiz','correctCount','10'],
 'quiz-xmas-songs.html':['showResults','Christmas Music Style','0','0'],
 'quiz-gotham-villain.html':['showResults','Gotham Villain Match','0','0'],
 'quiz-dc-vs-marvel.html':['calculateResults','DC or Marvel','0','0']
};
function walk(node,fn){if(!node||typeof node!=='object')return;if(node.type)fn(node);for(const [key,value] of Object.entries(node)){if(['start','end'].includes(key))continue;if(Array.isArray(value))value.forEach(x=>walk(x,fn));else if(value&&typeof value==='object')walk(value,fn);}}
for(const [name,[fn,title,score,total]] of Object.entries(games)){
 const file=path.join(root,name);let html=fs.readFileSync(file,'utf8');
 html=html.replace(/<script\b([^>]*)>([\s\S]*?)<\/script>/gi,(full,attrs,code)=>{
  if(/\bsrc\s*=/.test(attrs)||/application\//.test(attrs))return full;
  const tree=acorn.parse(code,{ecmaVersion:'latest',sourceType:attrs.includes('module')?'module':'script'}),edits=[];
  walk(tree,node=>{if(node.type==='FunctionDeclaration'&&node.id?.name==='checkGameAchievements')edits.push([node.start,node.end,'']);
   if(node.type==='FunctionDeclaration'&&node.id?.name===fn&&!code.slice(node.start,node.end).includes('/* realm:completion */'))edits.push([node.body.end-1,node.body.end-1,`\n/* realm:completion */\nwindow.GameEngine?.saveGameResult(${JSON.stringify(title)}, ${score}, ${total}, {scored:${total==='0'?'false':'true'}});\n`]);
  });
  for(const [a,b,r] of edits.sort((a,b)=>b[0]-a[0]))code=code.slice(0,a)+r+code.slice(b);
  code=code.replace(/^\s*checkGameAchievements\([^;\n]*\);\s*$/gm,'');
  return `<script${attrs}>${code}</script>`;
 });fs.writeFileSync(file,html);
}
const file=path.join(root,'rapid.html');let text=fs.readFileSync(file,'utf8');
text=text.replace(/<script\b([^>]*)>([\s\S]*?)<\/script>/gi,(full,attrs,code)=>{if(!code.includes('function processGameResults'))return full;const tree=acorn.parse(code,{ecmaVersion:'latest'});let target;walk(tree,n=>{if(n.type==='FunctionDeclaration'&&n.id?.name==='processGameResults')target=n;});if(target){const replacement=`function processGameResults(finalScore, bestStreak, category) { const xpGained = Math.max(0, finalScore * 15 + bestStreak * 10); window.GameEngine?.addXP(xpGained); window.GameEngine?.saveGameResult('Rapid Fire', finalScore, 0, {scored:false}); return {xpGained,newUnlocks:[]}; }`;code=code.slice(0,target.start)+replacement+code.slice(target.end);}return `<script${attrs}>${code}</script>`;});fs.writeFileSync(file,text);console.log('Consolidated eleven retained game result handlers.');
const drawFile=path.join(root,'minigames.html');let drawing=fs.readFileSync(drawFile,'utf8');drawing=drawing.replace(/<script\b([^>]*)>([\s\S]*?)<\/script>/gi,(full,attrs,code)=>{if(!code.includes('function saveXP('))return full;const tree=acorn.parse(code,{ecmaVersion:'latest'});let target;walk(tree,n=>{if(n.type==='FunctionDeclaration'&&n.id?.name==='saveXP')target=n;});if(target)code=code.slice(0,target.start)+`function saveXP(amount) { window.GameEngine?.addXP(amount); window.GameEngine?.saveGameResult('Neural Draw', state.scoreA + state.scoreB, 0, {scored:false}); }`+code.slice(target.end);return `<script${attrs}>${code}</script>`;});fs.writeFileSync(drawFile,drawing);
