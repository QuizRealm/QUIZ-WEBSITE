/* Hosted trivia UI. Uses the existing Firebase project only after host/join. */
(function(){
  'use strict';const root=document.getElementById('room-app');if(!root)return;
  const role=root.dataset.role;const esc=s=>String(s).replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
  let fs,ref,uid,room,lastView='',unsubscribe=null,tick=null,hostBusy=false,code='',myName='';
  function normalizeRoom(value){
    if(!value||typeof value!=='object'||!['LOBBY','QUESTION','REVEAL','GAMEOVER'].includes(value.status))return null;
    if(!Number.isInteger(value.total)||value.total<1||value.total>50||!Number.isInteger(value.index)||value.index< -1||value.index>=value.total)return null;
    if(value.status!=='LOBBY'){
      const q=value.question;
      if(!q||typeof q.question!=='string'||q.question.length>2000||!Array.isArray(q.options)||q.options.length<2||q.options.length>8||!q.options.every(a=>typeof a==='string'&&a.length<=500)||!Number.isInteger(q.correctIndex)||q.correctIndex<0||q.correctIndex>=q.options.length)return null;
    }
    if(value.status==='QUESTION'&&(!Number.isFinite(value.deadline)||value.deadline<=0))return null;
    const players=Object.create(null),answers=Object.create(null);
    for(const [id,p] of Object.entries(value.players||{})){if(['__proto__','constructor','prototype'].includes(id)||!p||typeof p.name!=='string')continue;players[id]={name:p.name.slice(0,20),score:Number.isInteger(p.score)?Math.max(0,Math.min(value.total,p.score)):0};}
    for(const [id,a] of Object.entries(value.answers||{})){if(a&&Number.isInteger(a.round)&&a.round>=0&&a.round<value.total&&Number.isInteger(a.choice)&&a.choice>=0&&a.choice<8)answers[id]={round:a.round,choice:a.choice};}
    return {...value,players,answers};
  }
  function message(title,text){root.innerHTML=`<section class="r-game-card"><h2>${esc(title)}</h2><p style="margin-top:18px">${esc(text)}</p><div class="r-actions"><a class="r-button" href="/group-hub.html">Back to group games ↗</a></div></section>`;}
  async function service(){
    const load=async()=>{await import("/firebase-config.js?v=a86e2f61bb22");const user=await window.firebaseReady;if(!user)throw new Error('Guest sign-in is unavailable.');uid=user.uid;fs=await import('https://www.gstatic.com/firebasejs/10.7.1/firebase-firestore.js');};
    let timeout;try{await Promise.race([load(),new Promise((_,reject)=>{timeout=setTimeout(()=>reject(new Error('The multiplayer service did not respond.')),12000);})]);}finally{clearTimeout(timeout);}
  }
  function subscribe(){unsubscribe=fs.onSnapshot(ref,snapshot=>{if(!snapshot.exists()){clearInterval(tick);room=null;message('This room is no longer available.','Ask the host for a new room code.');return;}room=normalizeRoom(snapshot.data());if(!room){clearInterval(tick);lastView='';message('The room sent an invalid update.','Return to the group hub and create or join another room.');return;}render();},()=>{clearInterval(tick);message('The connection was interrupted.','Try joining again, or choose a same-device game.');});}
  function standings(){return Object.entries(room.players||{}).sort(([,a],[,b])=>(b.score||0)-(a.score||0));}
  function scores(){return standings().map(([id,p],i)=>`<div class="r-editorial"><span class="r-editorial-number">${i+1}</span><div><h3>${esc(p.name||'Player')}</h3><p>${Number(p.score)||0} points${id===uid?' · You':''}</p></div></div>`).join('')||'<p>No players have joined yet.</p>';}
  function render(){
    const player=room.players?.[uid];const view=room.status+'-'+room.index+'-'+Object.keys(room.answers||{}).length+'-'+Object.keys(room.players||{}).length;
    if(view===lastView)return;lastView=view;clearInterval(tick);
    const common=`<div class="r-game-status"><span>Room ${esc(code)}</span><span>${Object.keys(room.players||{}).length} players</span></div>`;
    if(room.status==='LOBBY'){
      root.innerHTML=`<section class="r-game-card">${common}<span class="r-eyebrow">${role==='host'?'Invite your people':'You’re in'}</span><h2>${role==='host'?'Join with '+esc(code):'Welcome, '+esc(myName)+'.'}</h2><p style="margin-top:15px">${role==='host'?'Open the group hub on each phone and enter this four-letter code.':'Keep this page open. The host will start the round.'}</p>${role==='host'?`<div style="margin-top:20px"><img src="https://api.qrserver.com/v1/create-qr-code/?size=180x180&amp;data=${encodeURIComponent(location.origin+'/play.html?code='+code)}" alt="Scan to join room ${esc(code)}" width="180" height="180" referrerpolicy="no-referrer" style="background:white;padding:10px;border-radius:10px"></div><div class="r-actions"><button class="r-button" id="room-start" ${Object.keys(room.players||{}).length?'':'disabled'}>Start the round ↗</button><button class="r-button secondary" id="room-copy">Copy joining link</button></div><p id="room-copy-message" role="status" class="r-footnote"></p>`:''}<div style="margin-top:28px">${scores()}</div></section>`;
      root.querySelector('#room-start')?.addEventListener('click',()=>nextQuestion(0));root.querySelector('#room-copy')?.addEventListener('click',async()=>{const link=location.origin+'/play.html?code='+code;try{await navigator.clipboard.writeText(link);root.querySelector('#room-copy-message').textContent='Joining link copied.';}catch{root.querySelector('#room-copy-message').textContent=link;}});return;
    }
    if(room.status==='QUESTION'){
      const q=room.question;const answered=room.answers?.[uid]?.round===room.index;
      root.innerHTML=`<section class="r-game-card">${common}<div class="r-game-status"><span>Question ${room.index+1} / ${room.total}</span><span id="room-time">30 seconds</span></div><h2 class="r-question">${esc(q.question)}</h2>${role==='host'?`<div class="r-options">${q.options.map((a,i)=>`<div class="r-option"><small>${String.fromCharCode(65+i)}</small>${esc(a)}</div>`).join('')}</div><p class="r-footnote">${Object.keys(room.answers||{}).length} answers received.</p><div class="r-actions"><button class="r-button" id="room-reveal">Reveal the answer ↗</button></div>`:answered?'<div class="r-note"><h3>Answer received.</h3><p>Wait for the host to reveal the answer.</p></div>':`<div class="r-options">${q.options.map((a,i)=>`<button class="r-option" data-room-answer="${i}"><small>${String.fromCharCode(65+i)}</small><span>${esc(a)}</span></button>`).join('')}</div><p class="r-message" id="room-answer-message" role="status"></p>`}</section>`;
      root.querySelector('#room-reveal')?.addEventListener('click',reveal);
      root.querySelectorAll('[data-room-answer]').forEach(b=>b.onclick=async()=>{root.querySelectorAll('[data-room-answer]').forEach(x=>x.disabled=true);const round=room.index;try{await fs.runTransaction(window.db,async transaction=>{const snap=await transaction.get(ref),latest=normalizeRoom(snap.data());if(!latest||latest.status!=='QUESTION'||latest.index!==round||Date.now()>latest.deadline)throw new Error('The time for this question has ended.');transaction.update(ref,{['answers.'+uid]:{choice:Number(b.dataset.roomAnswer),round}});});}catch(error){const m=root.querySelector('#room-answer-message');if(m)m.textContent=error.message;}});
      const update=()=>{const seconds=Math.max(0,Math.ceil((room.deadline-Date.now())/1000));const el=root.querySelector('#room-time');if(el)el.textContent=seconds+' seconds';if(!seconds){if(role==='host')reveal();else root.querySelectorAll('[data-room-answer]').forEach(b=>b.disabled=true);}};update();tick=setInterval(update,500);return;
    }
    if(room.status==='REVEAL'){
      const q=room.question;const answer=room.answers?.[uid];const correct=answer?.choice===q.correctIndex;
      root.innerHTML=`<section class="r-game-card">${common}<span class="r-eyebrow">The answer</span><h2>${esc(q.options[q.correctIndex])}</h2>${role==='player'?`<p style="margin-top:18px">${!answer?'No answer this time.':correct?'Correct. One point!':'No point this time. There is another question ahead.'}</p>`:''}<div style="margin-top:25px">${scores()}</div>${role==='host'?'<div class="r-actions"><button class="r-button" id="room-next">'+(room.index+1>=room.total?'Finish the round':'Next question')+' ↗</button></div>':''}</section>`;
      root.querySelector('#room-next')?.addEventListener('click',()=>nextQuestion(room.index+1));return;
    }
    if(room.status==='GAMEOVER'){
      if(role==='player'&&player)window.GameEngine?.completeGame('Hosted Trivia',Number(player.score)||0,room.total,{attemptId:'room-'+code+'-'+room.createdAt+'-'+uid});
      root.innerHTML=`<section class="r-game-card">${common}<span class="r-eyebrow">Good game</span><h2>That’s a round.</h2><div style="margin-top:25px">${scores()}</div><div class="r-actions"><a class="r-button" href="/group-hub.html">Play another round ↗</a><a class="r-button secondary" href="/profile.html">My progress</a></div></section>`;
    }
  }
  let hostQuestions=[];
  async function nextQuestion(index){
    if(hostBusy)return;hostBusy=true;
    try{await fs.runTransaction(window.db,async transaction=>{const snap=await transaction.get(ref),latest=normalizeRoom(snap.data());if(!latest||latest.hostUid!==uid)return;if(index===0?latest.status!=='LOBBY':latest.status!=='REVEAL'||latest.index+1!==index)return;if(index>=hostQuestions.length){transaction.update(ref,{status:'GAMEOVER'});return;}transaction.update(ref,{status:'QUESTION',index,question:hostQuestions[index],answers:{},deadline:Date.now()+30000});});}catch{message('The room could not advance.','The connection may have been interrupted. You can create a new room from the group hub.');}finally{hostBusy=false;}
  }
  async function reveal(){
    if(hostBusy||room?.status!=='QUESTION')return;hostBusy=true;clearInterval(tick);
    const round=room.index;
    try{await fs.runTransaction(window.db,async transaction=>{const snap=await transaction.get(ref),latest=normalizeRoom(snap.data());if(!latest||latest.status!=='QUESTION'||latest.index!==round||latest.hostUid!==uid)return;const players=JSON.parse(JSON.stringify(latest.players||{}));for(const [id,a] of Object.entries(latest.answers||{}))if(players[id]&&a.round===latest.index&&a.choice===latest.question.correctIndex)players[id].score=Math.min(latest.total,(players[id].score||0)+1);transaction.update(ref,{status:'REVEAL',players});});}catch{message('The answer could not be revealed.','Please check the connection and start a new room if needed.');}finally{hostBusy=false;}
  }
  async function host(){
    let settings;try{settings=JSON.parse(localStorage.getItem('qr_host_settings'));}catch{}
    if(!settings||!/^[A-Z]{4}$/.test(settings.roomCode||'')){message('Choose a topic first.','Create a room from the group hub to open your host screen.');return;}
    code=settings.roomCode;root.innerHTML='<div class="r-game-card"><h2>Opening your room…</h2><p>The existing multiplayer service may take a moment to connect.</p></div>';
    try{await service();ref=fs.doc(window.db,'group_rooms',code);const old=await fs.getDoc(ref);if(old.exists()){let saved;try{saved=JSON.parse(localStorage.getItem('qr_host_deck'));}catch{}if(old.data().hostUid===uid&&saved?.code===code&&Array.isArray(saved.questions)){hostQuestions=saved.questions;subscribe();return;}message('That room code is already in use.','Create another room to get a fresh code.');return;}
      const key=settings.categoryKey==='general_easy'?'mixed':settings.categoryKey;const keys=key==='mixed'?['science','history','geography','food','space']:[key];const pool=keys.flatMap(k=>{const b=QUESTION_BANKS[k];return Array.isArray(b)?b:(b?.easy||[]);});const seen=new Set();const candidates=pool.filter(q=>!seen.has(q.question)&&seen.add(q.question));for(let i=candidates.length-1;i>0;i--){const j=Math.floor(Math.random()*(i+1));[candidates[i],candidates[j]]=[candidates[j],candidates[i]];}hostQuestions=candidates.slice(0,10).map(q=>({question:q.question,options:q.options,correctIndex:q.correctIndex}));if(!hostQuestions.length)throw new Error('That topic is unavailable.');localStorage.setItem('qr_host_deck',JSON.stringify({code,questions:hostQuestions}));await fs.setDoc(ref,{status:'LOBBY',hostUid:uid,players:{},answers:{},index:-1,total:hostQuestions.length,createdAt:Date.now(),category:key});subscribe();
    }catch(error){message('The room could not open.',error.message+' You can still play a same-device duel without the multiplayer service.');}
  }
  function player(){
    const initial=new URLSearchParams(location.search).get('code')||'';
    root.innerHTML=`<form class="r-game-card" id="room-join"><h2>Join your trivia room.</h2><div class="r-form-row"><label for="player-code">Room code</label><input class="r-search" id="player-code" name="code" maxlength="4" pattern="[A-Za-z]{4}" value="${esc(initial)}" required autocomplete="off" autocapitalize="characters"></div><div class="r-form-row"><label for="player-nick">Nickname</label><input class="r-search" id="player-nick" name="nickname" minlength="2" maxlength="20" required autocomplete="off" placeholder="Choose a nickname"></div><button class="r-button" type="submit">Join the room ↗</button><p class="r-message" id="join-message" role="status"></p><p class="r-footnote">Other players in the room can see your nickname and score.</p></form>`;
    root.querySelector('form').onsubmit=async e=>{e.preventDefault();code=root.querySelector('#player-code').value.trim().toUpperCase();myName=root.querySelector('#player-nick').value.trim();const button=root.querySelector('button');button.disabled=true;button.textContent='Joining…';try{if(!/^[A-Z]{4}$/.test(code)||myName.length<2)throw new Error('Enter a four-letter code and a nickname.');await service();ref=fs.doc(window.db,'group_rooms',code);const snap=await fs.getDoc(ref);if(!snap.exists()||snap.data().status!=='LOBBY')throw new Error('This room is unavailable or the round has already started.');await fs.updateDoc(ref,{['players.'+uid]:{name:myName.slice(0,20),score:0}});subscribe();}catch(error){root.querySelector('#join-message').textContent=error.message;button.disabled=false;button.textContent='Join the room ↗';}};
  }
  window.addEventListener('pagehide',()=>{clearInterval(tick);unsubscribe?.();});
  role==='host'?host():player();
})();
