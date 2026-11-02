(function(){
  'use strict';
  const root=document.getElementById('new-game');if(!root)return;
  const game=root.dataset.game;
  const esc=s=>String(s).replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
  let run=0,timer=null;
  function layout(content){root.innerHTML='<div class="r-game-card">'+content+'</div>';}
  function button(label='Start playing'){return `<button class="r-button" id="game-start">${label} <span aria-hidden="true">→</span></button>`;}
  function intro(){clearTimeout(timer);run++;layout(game==='memory'?'<h2>A little test of attention.</h2><p>Watch the tiles light up. Repeat the sequence in order. Each round adds one tile.</p><div class="r-actions">'+button()+'</div>':'<h2>Wait for the green.</h2><p>Tap the target when it turns green. Complete five trials to see your median reaction time. A false start repeats the trial.</p><div class="r-actions">'+button()+'</div>');root.querySelector('#game-start').onclick=game==='memory'?memory:reaction;}
  function result(title,body,score,total,id){window.GameEngine?.completeGame(game==='memory'?'Memory Trail':'Reaction Five',score,total,{attemptId:id,scored:false});layout(`<div class="r-result-card"><span class="r-eyebrow" style="justify-content:center">Round complete</span><h2>${title}</h2><div class="r-result-score">${esc(body)}</div><p>Your result is saved in this browser. These games are for fun and practice, not a cognitive or medical assessment.</p><div class="r-actions" style="justify-content:center">${button('Play again')}<a class="r-button secondary" href="/profile.html">My progress</a></div></div>`);root.querySelector('#game-start').onclick=intro;}
  function reaction(){
    const token=++run,id='reaction-'+Date.now();let times=[],start=0,phase='idle';
    function next(){if(token!==run)return;if(times.length===5){const sorted=[...times].sort((a,b)=>a-b);result('Your median reaction',Math.round(sorted[2])+' ms',5,5,id);return;}
      layout(`<div class="r-game-status"><span>Trial ${times.length+1} / 5</span><span>${times.map(t=>Math.round(t)+' ms').join(' · ')}</span></div><button class="r-reaction-target waiting" id="reaction-target">Wait for green…</button><p class="r-footnote" id="reaction-message" aria-live="polite">Use a tap, click, Space or Enter.</p>`);phase='waiting';
      const target=root.querySelector('#reaction-target');
      timer=setTimeout(()=>{if(token!==run)return;phase='ready';target.className='r-reaction-target ready';target.textContent='Tap now!';start=performance.now();},1700+Math.random()*2600);
      target.onpointerdown=e=>{e.preventDefault();hit();};target.onkeydown=e=>{if((e.key===' '||e.key==='Enter')&&!e.repeat){e.preventDefault();hit();}};target.focus();
      function hit(){if(phase==='waiting'){clearTimeout(timer);phase='pause';target.className='r-reaction-target';target.textContent='A little early. Try again.';timer=setTimeout(next,1100);}else if(phase==='ready'){times.push(performance.now()-start);phase='pause';target.className='r-reaction-target';target.textContent=Math.round(times.at(-1))+' ms';timer=setTimeout(next,1000);}}
    }next();
  }
  function memory(){
    const token=++run,id='memory-'+Date.now();let sequence=[],input=0,phase='watch',level=0;
    layout('<div class="r-game-status"><span id="memory-round">Round 1</span><span id="memory-message" aria-live="polite">Watch the sequence</span></div><div class="r-memory-grid">'+Array.from({length:16},(_,i)=>`<button class="r-memory-tile" data-tile="${i}" aria-label="Tile ${i+1}" disabled>${i+1}</button>`).join('')+'</div><p class="r-footnote">Repeat the order. The numbered tiles work with touch, a mouse, or keyboard focus.</p>');
    const tiles=[...root.querySelectorAll('[data-tile]')],message=root.querySelector('#memory-message');
    const pause=ms=>new Promise(resolve=>setTimeout(resolve,ms));
    async function next(){phase='watch';input=0;sequence.push(Math.floor(Math.random()*16));tiles.forEach(t=>t.disabled=true);root.querySelector('#memory-round').textContent='Round '+sequence.length;message.textContent='Watch the sequence';await pause(600);for(const pos of sequence){if(token!==run)return;tiles[pos].classList.add('active');await pause(500);if(token!==run)return;tiles[pos].classList.remove('active');await pause(250);}if(token!==run)return;phase='input';tiles.forEach(t=>t.disabled=false);message.textContent='Your turn. Repeat the order.';}
    tiles.forEach((tile,i)=>tile.onclick=async()=>{if(phase!=='input')return;if(sequence[input]!==i){phase='end';run++;result('Sequence remembered',level+' '+(level===1?'round':'rounds'),level,Math.max(level+1,5),id);return;}input++;tile.classList.add('active');setTimeout(()=>tile.classList.remove('active'),160);if(input===sequence.length){phase='pause';level++;message.textContent='Correct. One more tile…';if(level===12){run++;result('Twelve rounds. Brilliant.',level+' rounds',12,12,id);return;}timer=setTimeout(next,900);}});next();
  }
  intro();
})();
