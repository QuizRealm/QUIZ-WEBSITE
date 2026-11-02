(function(){
  'use strict';
  const esc=s=>String(s).replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
  const engine=window.GameEngine;
  const library=document.getElementById('library-grid');
  if(library){
    const cards=[...library.querySelectorAll('[data-title]')];let kind=library.dataset.kind||'all';
    const search=document.getElementById('game-search'),sort=document.getElementById('game-sort'),count=document.getElementById('library-count');
    function apply(){const query=(search?.value||'').toLowerCase().trim();let visible=cards.filter(c=>(kind==='all'||c.dataset.kind===kind)&&(c.dataset.title+' '+c.dataset.tags).toLowerCase().includes(query));cards.forEach(c=>c.hidden=!visible.includes(c));if(sort?.value==='az')visible.sort((a,b)=>a.dataset.title.localeCompare(b.dataset.title));else visible.sort((a,b)=>Number(a.dataset.order)-Number(b.dataset.order));visible.forEach(c=>library.append(c));count.textContent=`${visible.length} ${visible.length===1?'game':'games'} to explore`;document.getElementById('library-empty').hidden=visible.length>0;}
    search?.addEventListener('input',apply);sort?.addEventListener('change',apply);
    document.querySelectorAll('[data-filter]').forEach(button=>button.onclick=()=>{kind=button.dataset.filter;document.querySelectorAll('[data-filter]').forEach(b=>b.setAttribute('aria-pressed',String(b===button)));apply();});
    const initial=new URLSearchParams(location.search).get('filter');if(initial)document.querySelector(`[data-filter="${CSS.escape(initial)}"]`)?.click();apply();
  }
  function renderProgress(){
    if(!engine)return;const s=engine.getUserSnapshot();
    const stats=document.getElementById('player-stats');
    if(stats)stats.innerHTML=[['Level',s.level],['Total XP',s.xp.toLocaleString()],['Games finished',s.stats.games],['Day streak',s.streak]].map(([label,value])=>`<div class="r-stat"><strong>${value}</strong><span>${label}</span></div>`).join('');
    const name=document.getElementById('player-name');if(name)name.textContent=s.nickname;
    const rank=document.getElementById('player-rank');if(rank)rank.textContent=`${s.rank} · ${s.nextLevelXP-s.xp} XP to level ${s.level+1}`;
    const level=document.getElementById('level-progress');if(level){level.style.width=`${(s.xp-s.levelStartXP)/(s.nextLevelXP-s.levelStartXP)*100}%`;level.parentElement.setAttribute('aria-valuenow',String(s.xp-s.levelStartXP));level.parentElement.setAttribute('aria-valuemax',String(s.nextLevelXP-s.levelStartXP));}
    const history=document.getElementById('game-history');
    if(history)history.innerHTML=s.history.length?`<table class="r-history"><thead><tr><th>Game</th><th>Result</th><th>XP</th><th>Date</th></tr></thead><tbody>${s.history.slice(-20).reverse().map(h=>`<tr><td>${esc(h.game)}</td><td>${h.accuracy===null?'Completed':h.score+'/'+h.total}</td><td>+${h.xp}</td><td>${new Date(h.timestamp).toLocaleDateString(undefined,{month:'short',day:'numeric'})}</td></tr>`).join('')}</tbody></table>`:'<div class="r-empty"><h3>Your first game is waiting.</h3><p>Finish a round to start your history.</p><div class="r-actions"><a class="r-button" href="/daily.html">Try the Daily Ten</a></div></div>';
    const badges=document.getElementById('achievement-grid');if(badges)badges.innerHTML=engine.achievementProgress().map(b=>`<article class="r-badge ${b.unlocked?'unlocked':''}"><span class="r-badge-icon" aria-hidden="true">${b.unlocked?'✦':'◇'}</span><h3>${esc(b.title)}</h3><p>${esc(b.description)}</p><div class="r-progress" role="progressbar" aria-label="${esc(b.title)}" aria-valuemin="0" aria-valuemax="${b.goal}" aria-valuenow="${b.current}"><span style="width:${b.current/b.goal*100}%"></span></div><small>${b.unlocked?'Unlocked':b.current.toLocaleString()+' / '+b.goal.toLocaleString()}</small></article>`).join('');
    const daily=document.getElementById('daily-status');if(daily)daily.textContent=s.dailyDates.includes(engine.dailyKey())?'Today’s challenge is complete. Come back tomorrow for a new set, or replay for fun.':'Ten questions. One fresh set every day. Your first completion earns XP.';
  }
  renderProgress();window.addEventListener('realm:progress',renderProgress);
  const form=document.getElementById('nickname-form');if(form){form.addEventListener('submit',e=>{e.preventDefault();engine.setNickname(form.elements.nickname.value);document.getElementById('profile-message').textContent='Name saved.';});form.elements.nickname.value=engine.getUserSnapshot().nickname;}
  document.getElementById('export-progress')?.addEventListener('click',()=>{const url=URL.createObjectURL(new Blob([engine.exportData()],{type:'application/json'}));const a=document.createElement('a');a.href=url;a.download='quizrealm-progress.json';a.click();setTimeout(()=>URL.revokeObjectURL(url),1000);});
  document.getElementById('import-progress')?.addEventListener('change',async e=>{const f=e.target.files[0];if(!f)return;try{if(f.size>1000000)throw new Error('Choose a backup smaller than 1 MB.');engine.importData(await f.text());document.getElementById('profile-message').textContent='Progress restored.';}catch(error){document.getElementById('profile-message').textContent=error.message;}e.target.value='';});
  const importLabel=document.querySelector('label[for="import-progress"]');if(importLabel){importLabel.tabIndex=0;importLabel.setAttribute('role','button');importLabel.classList.add('r-file-label');importLabel.addEventListener('keydown',event=>{if(event.key==='Enter'||event.key===' '){event.preventDefault();document.getElementById('import-progress').click();}});}
  document.getElementById('reset-progress')?.addEventListener('click',()=>{document.getElementById('reset-confirm').hidden=false;});
  document.getElementById('reset-cancel')?.addEventListener('click',()=>{document.getElementById('reset-confirm').hidden=true;});
  document.getElementById('reset-yes')?.addEventListener('click',()=>{engine.reset();document.getElementById('reset-confirm').hidden=true;document.getElementById('profile-message').textContent='This browser’s progress has been reset.';});
  const date=document.getElementById('daily-date');if(date)date.textContent=new Date().toLocaleDateString(undefined,{weekday:'long',month:'long',day:'numeric',timeZone:'UTC'});
  const timer=document.getElementById('daily-countdown');if(timer){const tick=()=>{const now=new Date();const next=Date.UTC(now.getUTCFullYear(),now.getUTCMonth(),now.getUTCDate()+1);const seconds=Math.floor((next-now)/1000);timer.textContent=`${String(Math.floor(seconds/3600)).padStart(2,'0')}:${String(Math.floor(seconds%3600/60)).padStart(2,'0')}:${String(seconds%60).padStart(2,'0')}`;};tick();setInterval(tick,1000);}
})();
