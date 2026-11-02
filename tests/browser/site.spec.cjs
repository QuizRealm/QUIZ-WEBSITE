const {test,expect}=require('@playwright/test');
const fs=require('node:fs'),path=require('node:path');
test.beforeEach(async({context})=>{
  await context.route('**/*',route=>{const url=new URL(route.request().url());if(!['127.0.0.1','localhost'].includes(url.hostname))return route.fulfill({status:200,body:'',contentType:url.pathname.endsWith('.css')?'text/css':'text/javascript'});return route.continue();});
});
async function essential(page){const button=page.getByRole('button',{name:'Essential only',exact:true});if(await button.isVisible())await button.click();}
async function correctAnswer(page){
  const question=await page.locator('.r-question').textContent();
  const answer=await page.evaluate(text=>{const daily=typeof DAILY_BANK==='undefined'?[]:DAILY_BANK;const found=daily.find(q=>q.question===text);if(found)return found.options[found.correctIndex];for(const b of Object.values(QUESTION_BANKS)){const questions=Array.isArray(b)?b:Object.values(b).flat();const q=questions.find(q=>q.question===text);if(q)return q.options[q.correctIndex];}return null;},question);
  expect(answer).not.toBeNull();await page.getByRole('button',{name:answer,exact:false}).filter({has:page.locator('span')}).first().click();
}
test('home is readable, responsive and links to real games',async({page},info)=>{
  const errors=[];page.on('pageerror',e=>errors.push(e.message));await page.goto('/');await essential(page);
  await expect(page.getByRole('heading',{level:1})).toHaveText('Stay curious.Play a little.');await expect(page.getByRole('link',{name:'Play today’s challenge'})).toBeVisible();
  await expect(page.locator('.r-card')).toHaveCount(8);expect(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth+1)).toBeTruthy();
  if(info.project.name==='mobile'){await page.getByRole('button',{name:'Menu',exact:true}).click();await expect(page.getByRole('navigation',{name:'Main navigation'})).toBeVisible();}
  expect(errors).toEqual([]);await page.screenshot({path:path.join('test-results','home-'+info.project.name+'.png'),fullPage:true});
});
test('library search, category filters and empty state work',async({page})=>{
  await page.goto('/categories.html');await essential(page);await page.getByRole('searchbox',{name:'Search games'}).fill('ladder');await expect(page.locator('.r-card:visible')).toHaveCount(1);await expect(page.locator('.r-card:visible')).toContainText('Word Ladder');
  await page.getByRole('searchbox').fill('not-a-real-game');await expect(page.getByRole('heading',{name:'No games found.'})).toBeVisible();await page.getByRole('searchbox').fill('');await page.getByRole('button',{name:'Word games',exact:true}).click();await expect(page.locator('.r-card:visible')).toHaveCount(6);
  await page.getByRole('combobox',{name:'Sort games'}).selectOption('az');const titles=await page.locator('.r-card:visible h3').allTextContents();expect(titles).toEqual([...titles].sort((a,b)=>a.localeCompare(b)));
});
test('ten-question round saves one honest result with an answer review',async({page})=>{
  await page.goto('/quiz.html?category=science');await essential(page);
  for(let i=0;i<10;i++){await correctAnswer(page);await page.getByRole('button',{name:i===9?'See my results':'Next question'}).click();}
  await expect(page.getByRole('heading',{name:'A clean sweep.'})).toBeVisible();await expect(page.locator('details')).toHaveCount(10);const state=await page.evaluate(()=>GameEngine.getUserSnapshot());expect(state.stats.games).toBe(1);expect(state.xp).toBe(100);expect(state.history[0].accuracy).toBe(100);expect(state.badges).toContain('perfect_round');
  await page.getByRole('link',{name:'My progress',exact:true}).first().click();await expect(page.locator('#player-stats')).toContainText('100');
});
test('daily set is stable and replays do not award XP twice',async({page})=>{
  await page.goto('/quiz.html?category=mixed&mode=daily');await essential(page);const first=await page.locator('.r-question').textContent();
  for(let round=0;round<2;round++){if(round){await page.goto('/quiz.html?category=mixed&mode=daily');await expect(page.locator('.r-question')).toHaveText(first);}for(let i=0;i<10;i++){await correctAnswer(page);await page.getByRole('button',{name:i===9?'See my results':'Next question'}).click();}}
  const state=await page.evaluate(()=>GameEngine.getUserSnapshot());expect(state.stats.games).toBe(1);expect(state.dailyDates).toHaveLength(1);expect(state.xp).toBe(100);
});
test('reflection is transparent and does not claim a perfect scored round',async({page})=>{
  await page.goto('/burnout-test.html');await essential(page);for(let i=0;i<8;i++)await page.locator('[data-choice="0"]').click();await expect(page.getByRole('heading',{name:'More breathing room',exact:true})).toBeVisible();await expect(page.getByText('These categories are fictional', {exact:false})).toBeVisible();const state=await page.evaluate(()=>GameEngine.getUserSnapshot());expect(state.stats.games).toBe(1);expect(state.badges).not.toContain('perfect_round');
});
test('same-device duel has ten distinct questions and correct scores',async({page})=>{
  await page.goto('/duel.html');await essential(page);await page.getByRole('button',{name:'Start the duel'}).click();const seen=new Set();for(let i=0;i<10;i++){await page.getByRole('button',{name:'I’m ready'}).click();const question=await page.locator('.r-question').textContent();expect(seen.has(question)).toBeFalsy();seen.add(question);await correctAnswer(page);await page.getByRole('button',{name:i===9?'See the result':'Pass the device'}).click();}await expect(page.getByRole('heading',{name:'A well-matched draw.'})).toBeVisible();await expect(page.locator('.r-stat strong')).toHaveText(['5','5']);
});
test('privacy is opt-in and the footer can reopen its controls',async({page})=>{
  const google=[];page.on('request',r=>{if(/googletagmanager|googlesyndication|google-analytics/.test(r.url()))google.push(r.url());});await page.goto('/');await page.getByRole('button',{name:'Essential only',exact:true}).click();expect(google).toEqual([]);await page.getByRole('button',{name:'Privacy choices',exact:true}).click();await expect(page.getByRole('button',{name:'Allow analytics',exact:true})).toBeVisible();
});
test('profile backup can restore an intentional reset',async({page},info)=>{
  await page.goto('/profile.html');await essential(page);await page.getByRole('textbox',{name:'Your player name'}).fill('Test Explorer');await page.getByRole('button',{name:'Save name'}).click();await expect(page.locator('#player-name')).toHaveText('Test Explorer');const downloadPromise=page.waitForEvent('download');await page.getByRole('button',{name:'Export progress'}).click();const download=await downloadPromise;const dest=info.outputPath('progress.json');await download.saveAs(dest);expect(JSON.parse(fs.readFileSync(dest,'utf8')).nickname).toBe('Test Explorer');await page.getByRole('button',{name:'Reset this profile'}).click();await page.getByRole('button',{name:'Delete local progress'}).click();await expect(page.locator('#player-name')).toHaveText('Curious Player');await page.locator('#import-progress').setInputFiles(dest);await expect(page.locator('#player-name')).toHaveText('Test Explorer');
});
test('old nested URLs preserve query parameters when redirecting',async({page})=>{
  await page.goto('/encyclopedia/friends.html?example=kept#test');await expect(page).toHaveURL(/\/friends\.html\?example=kept#test$/);
});
test('unavailable host session has a clear route back',async({page})=>{
  await page.goto('/host-game.html');await essential(page);await expect(page.getByRole('heading',{name:'Choose a topic first.'})).toBeVisible();await expect(page.getByRole('link',{name:'Back to group games'})).toBeVisible();
});
