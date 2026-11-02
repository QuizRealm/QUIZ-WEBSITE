(function(){
  'use strict';
  const el=document.getElementById('quiz-app');if(!el)return;
  const params=new URLSearchParams(location.search);
  const mode=params.get('mode')||'standard';
  const daily=mode==='daily';
  let subject=daily?'mixed':(params.get('category')||params.get('id')||'mixed').replace(/[^a-zA-Z0-9_-]/g,'');
  const difficulty=daily?'easy':['easy','medium','hard'].includes(params.get('difficulty')||params.get('diff')) ? (params.get('difficulty')||params.get('diff')) : 'easy';
  let seed=Array.from((daily?new Date().toISOString().slice(0,10):Date.now().toString())+subject).reduce((a,c)=>Math.imul(a^c.charCodeAt(0),16777619)>>>0,2166136261);
  const random=()=>{seed=(Math.imul(seed,1664525)+1013904223)>>>0;return seed/4294967296;};
  const shuffle=list=>{const a=[...list];for(let i=a.length-1;i>0;i--){const j=Math.floor(random()*(i+1));[a[i],a[j]]=[a[j],a[i]];}return a;};
  const escape=s=>String(s).replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
  const banks=typeof QUESTION_BANKS==='undefined'?{}:QUESTION_BANKS;
  const config=typeof CATEGORY_CONFIG==='undefined'?{}:CATEGORY_CONFIG;
  subject=Object.keys(banks).find(key=>key.toLowerCase()===subject.toLowerCase())||subject;
  const seen=new Set();
  function poolFor(key){const b=banks[key];return Array.isArray(b)?b:(b?.[difficulty]||b?.easy||[]);}
  let pool=daily&&typeof DAILY_BANK!=='undefined'?DAILY_BANK:subject==='mixed'?['science','geography','history','food','space','worldCapitals','programming','biology'].flatMap(poolFor):poolFor(subject);
  pool=pool.filter(q=>q&&q.question&&Array.isArray(q.options)&&q.options.length>=2&&Number.isInteger(q.correctIndex)&&q.options[q.correctIndex]!==undefined&&!seen.has(q.question)&&seen.add(q.question));
  const questions=shuffle(pool).slice(0,10).map(q=>{const answers=shuffle(q.options.map((text,i)=>({text,correct:i===q.correctIndex})));return{question:q.question,answers,explanation:q.explanation||q.explain||null};});
  let index=0,score=0,locked=false;
  const review=[];
  const attemptId=daily?'daily-'+new Date().toISOString().slice(0,10):'quiz-'+Date.now()+'-'+Math.random().toString(36).slice(2);
  const label=subject==='mixed'?'Mixed knowledge':(config[subject]?.label||subject.replace(/([a-z])([A-Z])/g,'$1 $2').replace(/[-_]/g,' '));
  document.getElementById('quiz-topic').textContent=daily?'Today’s Daily Ten':label;
  function render(){
    if(!questions.length){el.innerHTML='<div class="r-game-card"><h2>This topic is taking a break.</h2><p>Choose another topic from the library.</p><div class="r-actions"><a class="r-button" href="/categories.html">Find a quiz</a></div></div>';return;}
    locked=false;const q=questions[index];
    el.innerHTML=`<section class="r-game-card" aria-label="Quiz question"><div class="r-game-status"><span>Question ${index+1} of ${questions.length}</span><span>${score} correct · ${escape(difficulty)}</span></div><div class="r-progress" role="progressbar" aria-label="Quiz progress" aria-valuemin="0" aria-valuemax="${questions.length}" aria-valuenow="${index}"><span style="width:${index/questions.length*100}%"></span></div><h2 class="r-question" tabindex="-1">${escape(q.question)}</h2><div class="r-options">${q.answers.map((a,i)=>`<button class="r-option" data-answer="${i}"><small>${String.fromCharCode(65+i)}</small><span>${escape(a.text)}</span></button>`).join('')}</div><div id="answer-feedback" aria-live="polite"></div></section>`;
    el.querySelectorAll('[data-answer]').forEach(b=>b.onclick=()=>answer(Number(b.dataset.answer)));
    if(index>0)el.querySelector('.r-question').focus();
  }
  function answer(choice){
    if(locked)return;locked=true;const q=questions[index],correct=q.answers[choice].correct;if(correct)score++;
    review.push({question:q.question,correct:q.answers.find(a=>a.correct).text,yours:q.answers[choice].text,ok:correct});
    el.querySelectorAll('[data-answer]').forEach((b,i)=>{b.disabled=true;if(q.answers[i].correct)b.classList.add('correct');else if(i===choice)b.classList.add('wrong');});
    const feedback=el.querySelector('#answer-feedback');feedback.className='r-feedback';
    feedback.innerHTML=`<p><strong>${correct?'Correct!':'The answer is '+escape(q.answers.find(a=>a.correct).text)+'.'}</strong>${q.explanation?' '+escape(q.explanation):''}</p><div class="r-actions"><button class="r-button" id="quiz-next">${index===questions.length-1?'See my results':'Next question'} <span aria-hidden="true">→</span></button></div>`;
    feedback.querySelector('button').onclick=()=>{index++;index<questions.length?render():finish();};feedback.querySelector('button').focus();
  }
  function finish(){
    const recorded=window.GameEngine?.completeGame(daily?'Daily Challenge':label+' Quiz',score,questions.length,{daily,attemptId});
    el.innerHTML=`<section class="r-game-card r-result-card"><span class="r-eyebrow" style="justify-content:center">Round complete</span><h2>${score===questions.length?'A clean sweep.':score>=questions.length*.7?'Nicely played.':'Curiosity wins.'}</h2><div class="r-result-score">${score}<span style="font-size:30px;color:var(--r-muted)"> / ${questions.length}</span></div><p>${recorded?'Your XP and results have been saved in this browser.':daily?'Today’s challenge is already in your history. Replays are always welcome.':'Your round is complete.'}</p><div class="r-actions"><a class="r-button" href="/quiz.html?category=${encodeURIComponent(subject)}&difficulty=${difficulty}">Play another round</a><a class="r-button secondary" href="/profile.html">My progress</a><button class="r-button secondary" id="share-score">Copy result</button></div><p class="r-footnote" id="share-status" aria-live="polite"></p></section><section class="r-prose r-section"><h2>Your answer review</h2>${review.map((r,i)=>`<details><summary>${r.ok?'✓':'○'} ${i+1}. ${escape(r.question)}</summary><p>Correct answer: <strong>${escape(r.correct)}</strong>${r.ok?'':`<br>Your answer: ${escape(r.yours)}`}</p></details>`).join('')}</section>`;
    el.querySelector('#share-score').onclick=async()=>{const text=`I scored ${score}/${questions.length} on ${daily?'TheQuizRealm’s Daily Ten':label+' on TheQuizRealm'}. Try it: https://thequizrealm.com/${daily?'daily.html':'quiz.html?category='+encodeURIComponent(subject)}`;try{await navigator.clipboard.writeText(text);el.querySelector('#share-status').textContent='Result copied. Share it with a friend.';}catch{el.querySelector('#share-status').textContent=text;}};
    el.querySelector('h2').tabIndex=-1;el.querySelector('h2').focus();
  }
  document.addEventListener('keydown',event=>{if(locked||event.repeat||/input|textarea|select/i.test(document.activeElement?.tagName))return;const i=['1','2','3','4'].indexOf(event.key);if(i>=0&&questions[index]?.answers[i])answer(i);});
  window.GameEngine?.trackEvent('game_start',{game_name:daily?'Daily Challenge':label+' Quiz',game_type:'trivia'});
  render();
})();
