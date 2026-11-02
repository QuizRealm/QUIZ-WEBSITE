/* A timed trivia round. Progress stays in the shared local player profile. */
(function(){
  'use strict';
  const app=document.getElementById('rapid-app');if(!app)return;
  const banks=typeof QUESTION_BANKS==='undefined'?{}:QUESTION_BANKS;
  const config=typeof CATEGORY_CONFIG==='undefined'?{}:CATEGORY_CONFIG;
  const escape=value=>String(value).replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
  const shuffle=list=>{const result=[...list];for(let i=result.length-1;i>0;i--){const j=Math.floor(Math.random()*(i+1));[result[i],result[j]]=[result[j],result[i]];}return result;};
  function questionsFor(category){
    const bank=banks[category],all=Array.isArray(bank)?bank:Object.values(bank||{}).flat();const seen=new Set();
    return all.filter(q=>q&&typeof q.question==='string'&&Array.isArray(q.options)&&q.options.length>=2&&new Set(q.options).size===q.options.length&&Number.isInteger(q.correctIndex)&&q.correctIndex>=0&&q.correctIndex<q.options.length&&!seen.has(q.question)&&seen.add(q.question));
  }
  const categories=Object.keys(config).filter(key=>config[key].group!=='locked'&&questionsFor(key).length);
  const requested=new URLSearchParams(location.search).get('category')||'science';
  let category=categories.includes(requested)?requested:(categories.find(key=>key.toLowerCase()===requested.toLowerCase())||categories[0]);
  let pool=[],question=null,review=[],correct=0,streak=0,bestStreak=0,deadline=0,interval=null,nextTimer=null,active=false,locked=false,attemptId='';
  function stopTimers(){clearInterval(interval);clearTimeout(nextTimer);interval=null;nextTimer=null;}
  function setup(){
    stopTimers();active=false;
    app.innerHTML=`<section class="r-game-card"><h2>Choose your round</h2><p>60 seconds. Each wrong answer takes another five seconds off the clock.</p><form id="rapid-setup"><div class="r-form-row"><label for="rapid-category">Topic</label><select class="r-select" id="rapid-category">${categories.map(key=>`<option value="${escape(key)}"${key===category?' selected':''}>${escape(config[key].label||key)}</option>`).join('')}</select></div><div class="r-actions"><button class="r-button" type="submit">Start the 60-second round</button><a class="r-button secondary" href="/quiz.html?category=${encodeURIComponent(category||'mixed')}">Try an untimed quiz</a></div></form><p class="r-footnote">The clock keeps running if you switch tabs. A round with no answers does not earn XP.</p></section>`;
    const form=app.querySelector('form'),select=app.querySelector('select');
    select.onchange=()=>{category=select.value;form.querySelector('a').href='/quiz.html?category='+encodeURIComponent(category);};
    form.onsubmit=event=>{event.preventDefault();category=select.value;start();};
    if(!categories.length){form.querySelector('button').disabled=true;app.querySelector('p').textContent='The question bank is unavailable. Please try another game.';}
  }
  function start(){
    stopTimers();pool=shuffle(questionsFor(category));review=[];correct=0;streak=0;bestStreak=0;locked=false;active=true;
    attemptId='rapid-'+Date.now()+'-'+Math.random().toString(36).slice(2);deadline=Date.now()+60000;
    app.innerHTML=`<section class="r-game-card" aria-label="Rapid Fire round"><div class="r-game-status"><span>${escape(config[category]?.label||category)}</span><span><output id="rapid-clock" role="timer" aria-label="Seconds remaining" aria-live="off">60</output>s left</span><span id="rapid-score">0 correct</span></div><div class="r-progress" role="progressbar" aria-label="Time remaining" aria-valuemin="0" aria-valuemax="60" aria-valuenow="60"><span id="rapid-time-bar" style="width:100%"></span></div><div id="rapid-question"></div><p id="rapid-feedback" class="r-footnote" aria-live="polite"></p><div class="r-actions"><button class="r-button secondary" id="rapid-finish" type="button">Finish this round</button></div></section>`;
    app.querySelector('#rapid-finish').onclick=finish;renderQuestion();interval=setInterval(tick,100);
    window.GameEngine?.trackEvent('game_start',{game_name:'Rapid Fire',game_type:'timed_trivia'});
  }
  function tick(){
    if(!active)return;
    const remaining=Math.max(0,deadline-Date.now()),seconds=Math.ceil(remaining/1000);
    app.querySelector('#rapid-clock').textContent=seconds;
    app.querySelector('#rapid-time-bar').style.width=remaining/600+'%';
    app.querySelector('[role="progressbar"]').setAttribute('aria-valuenow',seconds);
    if(remaining===0)finish();
  }
  function renderQuestion(){
    if(!active)return;if(Date.now()>=deadline){finish();return;}
    if(!pool.length)pool=shuffle(questionsFor(category));
    const source=pool.pop();if(!source){finish();return;}
    question={text:source.question,explanation:source.explanation||source.explain||'',answers:shuffle(source.options.map((text,index)=>({text,correct:index===source.correctIndex})))};
    locked=false;
    app.querySelector('#rapid-question').innerHTML=`<h2 class="r-question" tabindex="-1">${escape(question.text)}</h2><div class="r-options">${question.answers.map((answer,index)=>`<button class="r-option" type="button" data-rapid-choice="${index}"><small>${index+1}</small><span>${escape(answer.text)}</span></button>`).join('')}</div>`;
    app.querySelector('#rapid-feedback').textContent='';
    app.querySelectorAll('[data-rapid-choice]').forEach(button=>button.onclick=()=>answer(Number(button.dataset.rapidChoice)));
    if(review.length)app.querySelector('.r-question').focus();
  }
  function answer(index){
    if(!active||locked||!question.answers[index])return;
    if(Date.now()>=deadline){finish();return;}
    locked=true;const choice=question.answers[index],solution=question.answers.find(option=>option.correct);
    review.push({question:question.text,yours:choice.text,answer:solution.text,correct:choice.correct,explanation:question.explanation});
    if(choice.correct){correct++;streak++;bestStreak=Math.max(bestStreak,streak);}else{streak=0;deadline-=5000;}
    app.querySelectorAll('[data-rapid-choice]').forEach((button,i)=>{button.disabled=true;if(question.answers[i].correct)button.classList.add('correct');else if(i===index)button.classList.add('wrong');});
    app.querySelector('#rapid-score').textContent=correct+' correct';
    app.querySelector('#rapid-feedback').textContent=choice.correct?'Correct.':'Five-second penalty. The answer was '+solution.text+'.';
    tick();if(active)nextTimer=setTimeout(renderQuestion,350);
  }
  function finish(){
    if(!active)return;active=false;locked=true;stopTimers();
    const xp=review.length?Math.min(10000,20+correct*15+bestStreak*10):0;
    if(review.length)window.GameEngine?.completeGame('Rapid Fire',correct,review.length,{attemptId,xp});
    app.innerHTML=`<section class="r-game-card r-result-card"><span class="r-eyebrow">Round complete</span><h2 tabindex="-1">That was a quick round.</h2><div class="r-result-score">${correct}<span style="font-size:24px;color:var(--r-muted)"> / ${review.length}</span></div><p>${review.length?'Your answered questions and '+xp+' XP have been saved in this browser.':'No answers were submitted. Start another round when you are ready.'}</p><p class="r-footnote">Best correct-answer streak: ${bestStreak}. Unanswered questions do not enter your accuracy.</p><div class="r-actions"><button class="r-button" id="rapid-again" type="button">Play again</button><a class="r-button secondary" href="/profile.html">My progress</a><button class="r-button secondary" id="rapid-copy" type="button">Copy result</button></div><p class="r-footnote" id="rapid-copy-status" aria-live="polite"></p></section>${review.length?`<section class="r-prose r-section"><h2>Your answer review</h2>${review.map((item,index)=>`<details><summary>${item.correct?'✓':'○'} ${index+1}. ${escape(item.question)}</summary><p>Correct answer: <strong>${escape(item.answer)}</strong>${item.correct?'':'<br>Your answer: '+escape(item.yours)}${item.explanation?'<br>'+escape(item.explanation):''}</p></details>`).join('')}</section>`:''}`;
    app.querySelector('#rapid-again').onclick=setup;
    app.querySelector('#rapid-copy').onclick=async()=>{const text=`I scored ${correct}/${review.length} on TheQuizRealm’s Rapid Fire. Try it: https://thequizrealm.com/rapid.html?category=${encodeURIComponent(category)}`;try{await navigator.clipboard.writeText(text);app.querySelector('#rapid-copy-status').textContent='Result copied.';}catch{app.querySelector('#rapid-copy-status').textContent=text;}};
    app.querySelector('h2').focus();
  }
  document.addEventListener('visibilitychange',()=>{if(!document.hidden)tick();});
  document.addEventListener('keydown',event=>{if(event.repeat||event.ctrlKey||event.altKey||event.metaKey||/input|textarea|select/i.test(document.activeElement?.tagName))return;const index=['1','2','3','4'].indexOf(event.key);if(index>=0&&active&&!locked){event.preventDefault();answer(index);}});
  setup();
})();
