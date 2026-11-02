/* Room UI/protocol test; all Firebase operations use an isolated in-memory fake. */
const {test,expect}=require('@playwright/test');
test('host and player can complete a round and the host can resume after refresh',async({browser})=>{
 const store=new Map();
 async function prepare(uid){
  const context=await browser.newContext();
  await context.exposeFunction('__roomRpc',(action,key,value)=>{
   if(action==='get')return store.has(key)?JSON.parse(JSON.stringify(store.get(key))):null;
   if(action==='set'){store.set(key,JSON.parse(JSON.stringify(value)));return;}
   if(action==='update'){const data=store.get(key);if(!data)throw new Error('Room missing');for(const [field,v] of Object.entries(value)){const keys=field.split('.');let target=data;for(const k of keys.slice(0,-1))target=target[k]||(target[k]={});target[keys.at(-1)]=v;}return;}
  });
  await context.route('**/*',route=>{const u=new URL(route.request().url());if(u.hostname==='127.0.0.1')return route.continue();if(!u.pathname.includes('/firebasejs/'))return route.fulfill({body:''});
   const code=`const user={uid:${JSON.stringify(uid)},isAnonymous:true};export const initializeApp=()=>({}),getApps=()=>[],getApp=()=>({}),getFirestore=()=>({}),getAuth=()=>({currentUser:user}),signInAnonymously=async()=>({user}),onAuthStateChanged=(auth,cb)=>{queueMicrotask(()=>cb(user));return()=>{};},GoogleAuthProvider=class{},signInWithPopup=async()=>({user}),doc=(db,...keys)=>keys.join('/'),collection=doc,arrayUnion=(...items)=>items,serverTimestamp=()=>Date.now(),addDoc=async()=>({id:'fake'});export async function setDoc(ref,value){await window.__roomRpc('set',ref,value);}export async function updateDoc(ref,value){await window.__roomRpc('update',ref,value);}export async function getDoc(ref){const value=await window.__roomRpc('get',ref);return{exists:()=>value!==null,data:()=>value};}export async function runTransaction(db,callback){const writes=[];const result=await callback({get:getDoc,update:(ref,value)=>{writes.push(updateDoc(ref,value));}});await Promise.all(writes);return result;}export function onSnapshot(ref,cb){let last='';const poll=async()=>{const s=await getDoc(ref);const text=JSON.stringify(s.data());if(text!==last){last=text;cb(s);}};poll();const timer=setInterval(poll,80);return()=>clearInterval(timer);}`;
   return route.fulfill({body:code,contentType:'text/javascript'});
  });await context.addInitScript(()=>localStorage.setItem('qr_consent_v1','{"analytics":false}'));return context;
 }
 const hostContext=await prepare('host-uid'),playerContext=await prepare('player-uid');
 try{
  await hostContext.addInitScript(()=>localStorage.setItem('qr_host_settings','{"roomCode":"ABCD","categoryKey":"science"}'));
  const host=await hostContext.newPage(),player=await playerContext.newPage();await host.goto('http://127.0.0.1:4173/host-game.html');await expect(host.getByRole('heading',{name:'Join with ABCD'})).toBeVisible();
  await player.goto('http://127.0.0.1:4173/play.html?code=ABCD');await player.getByRole('textbox',{name:'Nickname'}).fill('Curious guest');await player.getByRole('button',{name:'Join the room'}).click();await expect(player.getByRole('heading',{name:'Welcome, Curious guest.'})).toBeVisible();
  await host.reload();await expect(host.getByRole('heading',{name:'Join with ABCD'})).toBeVisible();await expect(host.getByRole('button',{name:'Start the round'})).toBeEnabled();await host.getByRole('button',{name:'Start the round'}).click();
  for(let i=0;i<10;i++){
   await expect(player.locator('[data-room-answer]')).toHaveCount(4);const correct=store.get('group_rooms/ABCD').question.correctIndex;await player.locator(`[data-room-answer="${correct}"]`).click();await expect(player.getByRole('heading',{name:'Answer received.'})).toBeVisible();await host.getByRole('button',{name:'Reveal the answer'}).click();await expect(player.getByText('Correct. One point!',{exact:false})).toBeVisible();await host.getByRole('button',{name:i===9?'Finish the round':'Next question'}).click();
  }
  await expect(player.getByRole('heading',{name:'That’s a round.'})).toBeVisible();expect(store.get('group_rooms/ABCD').players['player-uid'].score).toBe(10);const profile=await player.evaluate(()=>GameEngine.state);expect(profile.stats.games).toBe(1);expect(profile.history[0].accuracy).toBe(100);
  const corrupt=store.get('group_rooms/ABCD');corrupt.status='QUESTION';corrupt.index=0;corrupt.total='<img src=x onerror="window.__xss=1">';corrupt.deadline=Date.now()+30000;corrupt.answers={};await expect(player.getByRole('heading',{name:'The room sent an invalid update.'})).toBeVisible();expect(await player.evaluate(()=>window.__xss||0)).toBe(0);
 }finally{await hostContext.close();await playerContext.close();}
});
