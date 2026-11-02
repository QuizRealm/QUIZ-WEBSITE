/* Registry repairs and stable answer shuffling. Questions retain their answers. */
(function(){
  QUESTION_BANKS.science=scienceBank;
  QUESTION_BANKS.belgianfacts=belgianFactsBank;
  QUESTION_BANKS.worldCcapitals=worldCapitalsBank;
  QUESTION_BANKS.belgianhistoy=belgianHistoryBank;
  QUESTION_BANKS.randomsciencescience=scienceBank;
  // Keep old query keys working while menus use one correctly named entry.
  for(const [legacy,canonical] of [['randomsciencescience','science'],['worldCcapitals','worldCapitals'],['belgianhistoy','belgianhistory']]){
    if(!CATEGORY_CONFIG[legacy])continue;
    if(!CATEGORY_CONFIG[canonical])CATEGORY_CONFIG[canonical]=CATEGORY_CONFIG[legacy];
    Object.defineProperty(CATEGORY_CONFIG,legacy,{value:CATEGORY_CONFIG[canonical],enumerable:false,configurable:true});
  }
  for(const key of ['basketball','flags','music'])if(!QUESTION_BANKS[key])delete CATEGORY_CONFIG[key];
  if(CATEGORY_CONFIG.avatar2025)CATEGORY_CONFIG.avatar2025.longDesc='Explore the characters, places, and stories of the Avatar films. Choose a difficulty and play a ten-question round.';
  const visited=new Set();
  for(const bank of Object.values(QUESTION_BANKS)){
    for(const q of (Array.isArray(bank)?bank:Object.values(bank).flat())){
      if(!q||!Array.isArray(q.options)||visited.has(q))continue;visited.add(q);
      const answers=q.options.map((text,i)=>({text,correct:i===q.correctIndex}));
      let seed=Array.from(q.question||'').reduce((a,c)=>Math.imul(a^c.charCodeAt(0),16777619)>>>0,2166136261);
      for(let i=answers.length-1;i>0;i--){seed=(Math.imul(seed,1664525)+1013904223)>>>0;const j=Math.floor(seed/4294967296*(i+1));[answers[i],answers[j]]=[answers[j],answers[i]];}
      q.options=answers.map(a=>a.text);q.correctIndex=answers.findIndex(a=>a.correct);
    }
  }
})();
