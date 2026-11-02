/* TheQuizRealm progress. Local first; no account, network requests or tracking. */
(function (root) {
  'use strict';
  if (root.GameEngine && root.GameEngine.version === 3) return;
  const KEY = 'QR_PROFILE';
  const finite = (v, max = 100000000) => Math.min(max, Math.max(0, Number.isFinite(Number(v)) ? Number(v) : 0));
  const dayKey = (date = new Date()) => `${date.getFullYear()}-${String(date.getMonth()+1).padStart(2,'0')}-${String(date.getDate()).padStart(2,'0')}`;
  const dailyKey = () => new Date().toISOString().slice(0,10);
  const badges = [
    {id:'first_game', title:'First steps', description:'Finish your first game.', goal:1, metric:'games'},
    {id:'five_games', title:'Finding your rhythm', description:'Finish five games.', goal:5, metric:'games'},
    {id:'twenty_games', title:'Regular visitor', description:'Finish twenty games.', goal:20, metric:'games'},
    {id:'explorer', title:'Curious mind', description:'Try five different games or quiz topics.', goal:5, metric:'variety'},
    {id:'perfect_round', title:'Clean sweep', description:'Answer every question correctly in a round of at least five.', goal:1, metric:'perfect'},
    {id:'streak_three', title:'Three in a row', description:'Finish a game on three consecutive days.', goal:3, metric:'bestStreak'},
    {id:'streak_seven', title:'A week of curiosity', description:'Finish a game on seven consecutive days.', goal:7, metric:'bestStreak'},
    {id:'daily_five', title:'Daily regular', description:'Complete five daily challenges on different dates.', goal:5, metric:'dailies'},
    {id:'thousand_xp', title:'Making progress', description:'Earn 1,000 XP.', goal:1000, metric:'xp'},
    {id:'level_ten', title:'Realm explorer', description:'Reach level ten.', goal:10, metric:'level'}
  ];
  function clean(value) {
    const v = value && typeof value === 'object' && !Array.isArray(value) ? value : {};
    const history = Array.isArray(v.history) ? v.history.filter(h => h && typeof h.game === 'string' && Number.isFinite(Number(h.timestamp))).slice(-200).map(h => ({id:String(h.id || h.timestamp).slice(0,100),game:h.game.slice(0,100),score:finite(h.score),total:finite(h.total),accuracy:h.accuracy == null ? null : finite(h.accuracy,100),xp:finite(h.xp,10000),timestamp:Number(h.timestamp),daily:Boolean(h.daily)})) : [];
    return {version:3,nickname:String(v.nickname || 'Curious Player').replace(/[<>]/g,'').slice(0,24),avatarSeed:String(v.avatarSeed || 'Player').slice(0,100),xp:finite(v.xp),history,stats:{games:Math.max(history.length,finite(v.stats?.games)),variety:Array.isArray(v.stats?.variety) ? v.stats.variety.filter(x=>typeof x==='string').slice(0,500) : [...new Set(history.map(h=>h.game))],perfect:finite(v.stats?.perfect)},badges:Array.isArray(v.badges) ? v.badges.filter(x=>typeof x==='string').slice(0,100) : [],streak:finite(v.streak,10000),bestStreak:finite(v.bestStreak || v.streak,10000),lastPlayed:/^\d{4}-\d{2}-\d{2}$/.test(v.lastPlayed || '') ? v.lastPlayed : null,dailyDates:Array.isArray(v.dailyDates) ? [...new Set(v.dailyDates.filter(x=>/^\d{4}-\d{2}-\d{2}$/.test(x)))].slice(-400) : []};
  }
  let state;
  try { state = clean(JSON.parse(root.localStorage.getItem(KEY))); } catch { state = clean(); }
  let pendingXP = 0;
  let seen = new Set(state.history.map(h=>h.id));
  function snapshot() {
    const level = Math.floor(Math.sqrt(state.xp/100))+1;
    const rank = level >= 25 ? 'Realm Keeper' : level >= 10 ? 'Realm Explorer' : level >= 5 ? 'Trail Finder' : 'Curious Mind';
    const yesterday = new Date(); yesterday.setDate(yesterday.getDate()-1);
    const activeStreak = [dayKey(),dayKey(yesterday)].includes(state.lastPlayed) ? state.streak : 0;
    return JSON.parse(JSON.stringify({...state,streak:activeStreak,level,rank,coins:Math.floor(state.xp/10),levelStartXP:(level-1)**2*100,nextLevelXP:level**2*100,lastDailyDate:state.dailyDates.includes(dailyKey()) ? new Date().toDateString() : null}));
  }
  function metrics() { const s=snapshot(); return {games:s.stats.games,variety:s.stats.variety.length,perfect:s.stats.perfect,bestStreak:s.bestStreak,dailies:s.dailyDates.length,xp:s.xp,level:s.level}; }
  function save() {
    const m=metrics();
    badges.forEach(b => { if(m[b.metric]>=b.goal && !state.badges.includes(b.id)) state.badges.push(b.id); });
    try { root.localStorage.setItem(KEY,JSON.stringify(state)); } catch { /* Games remain playable when storage is unavailable. */ }
    if (root.dispatchEvent && root.CustomEvent) root.dispatchEvent(new root.CustomEvent('realm:progress',{detail:snapshot()}));
    updateHeader();
  }
  function updateHeader() {
    if (!root.document) return;
    const s=snapshot();
    Object.entries({headerLevel:s.level,headerXP:s.xp,headerCoins:s.coins}).forEach(([id,value])=>{const el=root.document.getElementById(id);if(el)el.textContent=value.toLocaleString();});
  }
  function playedToday() {
    const today=dayKey();
    if(state.lastPlayed===today)return;
    const yesterday=new Date();yesterday.setDate(yesterday.getDate()-1);
    state.streak=state.lastPlayed===dayKey(yesterday) ? state.streak+1 : 1;
    state.bestStreak=Math.max(state.bestStreak,state.streak);state.lastPlayed=today;
  }
  function record(game,score,total,extra={}) {
    const id=String(extra.attemptId || (Date.now()+'-'+Math.random().toString(36).slice(2)));
    if(seen.has(id) || (extra.daily && state.dailyDates.includes(dailyKey()))) { pendingXP=0; return false; }
    seen.add(id);
    const valid=extra.scored!==false && Number(total)>0 && Number(score)>=0 && Number(score)<=Number(total);
    const accuracy=valid ? Math.round(Number(score)/Number(total)*100) : null;
    const xp=pendingXP || Math.min(200,20+(valid ? Math.round(80*Number(score)/Number(total)) : 30));
    if(!pendingXP)state.xp+=xp;
    pendingXP=0;
    state.history.push({id,game:String(game || 'Game').slice(0,100),score:finite(score),total:finite(total),accuracy,xp,timestamp:Date.now(),daily:Boolean(extra.daily)});
    state.history=state.history.slice(-200);state.stats.games++;
    if(!state.stats.variety.includes(String(game)))state.stats.variety.push(String(game));
    if(valid && Number(total)>=5 && Number(score)===Number(total))state.stats.perfect++;
    playedToday();
    if(extra.daily && !state.dailyDates.includes(dailyKey()))state.dailyDates.push(dailyKey());
    save();
    if(root.RealmPrivacy?.analyticsAllowed())root.dataLayer?.push({event:'game_complete',game_name:String(game||'Game').slice(0,100),game_mode:extra.daily?'daily':'standard',...(valid?{game_score:finite(score),game_total:finite(total)}:{})});
    return true;
  }
  const engine={
    version:3,init:updateHeader,getUserSnapshot:snapshot,dayKey,dailyKey,badges,
    get state(){return snapshot();},
    addXP(amount){const xp=finite(amount,10000);if(!xp)return;state.xp+=xp;pendingXP+=xp;save();},
    saveGameResult:record,saveResult:record,
    completeGame(game,score,total,extra={}) { return record(game,score,total,extra); },
    completeDailyChallenge(score=0,total=10){if(state.dailyDates.includes(dailyKey()))return false;return record('Daily Challenge',score,total,{daily:true,attemptId:'daily-'+dailyKey()});},
    unlockAchievement(){save();},
    trackEvent(name,data={}) { if(root.RealmPrivacy?.analyticsAllowed())root.dataLayer?.push({event:name,...data}); },
    updateHeaderUI:updateHeader,
    achievementProgress(){const m=metrics();return badges.map(b=>({...b,current:Math.min(b.goal,m[b.metric]),unlocked:state.badges.includes(b.id)}));},
    setNickname(name){state.nickname=String(name||'Curious Player').replace(/[<>]/g,'').trim().slice(0,24)||'Curious Player';save();},
    exportData(){return JSON.stringify(state,null,2);},
    importData(text){if(typeof text!=='string'||text.length>1000000)throw new Error('Choose a TheQuizRealm backup smaller than 1 MB.');const data=JSON.parse(text);if(data.version!==3||!Array.isArray(data.history)||typeof data.xp!=='number')throw new Error('This is not a TheQuizRealm progress backup.');state=clean(data);seen=new Set(state.history.map(h=>h.id));pendingXP=0;save();},
    reset(){state=clean();pendingXP=0;seen=new Set();save();}
  };
  root.GameEngine=engine;
  root.addEventListener?.('storage',e=>{if(e.key===KEY){try{state=clean(JSON.parse(e.newValue));seen=new Set(state.history.map(h=>h.id));pendingXP=0;updateHeader();root.dispatchEvent(new root.CustomEvent('realm:progress'));}catch{}}});
  root.document?.addEventListener('DOMContentLoaded',updateHeader);
  save();
})(typeof window==='undefined' ? globalThis : window);
