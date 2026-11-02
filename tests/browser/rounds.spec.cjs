const {test,expect}=require('@playwright/test');
test.beforeEach(async({context})=>{
 await context.route('**/*',route=>['127.0.0.1','localhost'].includes(new URL(route.request().url()).hostname)?route.continue():route.fulfill({status:200,body:''}));
 await context.addInitScript(()=>localStorage.setItem('qr_consent_v1','{"analytics":false}'));
});
async function rapidAnswer(page,correct=true){
 const question=await page.locator('.r-question').textContent();
 const choice=await page.evaluate(({text,correct})=>{const questions=Object.values(QUESTION_BANKS).flatMap(bank=>Array.isArray(bank)?bank:Object.values(bank).flat());const q=questions.find(q=>q.question===text);return q.options[correct?q.correctIndex:(q.correctIndex+1)%q.options.length];},{text:question,correct});
 const options=page.locator('[data-rapid-choice]');const labels=await options.locator('span').allTextContents();return options.nth(labels.indexOf(choice));
}
test('Rapid Fire accepts keyboard answers, blocks double answers, applies penalties and saves once',async({page})=>{
 await page.clock.install();const errors=[];page.on('pageerror',e=>errors.push(e.message));await page.goto('/rapid.html?category=science');await expect(page.locator('#rapid-category')).toHaveValue('science');await page.getByRole('button',{name:'Start the 60-second round'}).click();
 for(let i=0;i<5;i++){const button=await rapidAnswer(page);if(i===0)await button.evaluate(b=>{b.click();b.click();});else{await button.focus();await button.press('Enter');}await page.clock.runFor(400);}
 await expect(page.locator('#rapid-score')).toHaveText('5 correct');
 const before=Number(await page.locator('#rapid-clock').textContent());await (await rapidAnswer(page,false)).click();const after=Number(await page.locator('#rapid-clock').textContent());expect(before-after).toBeGreaterThanOrEqual(5);expect(before-after).toBeLessThanOrEqual(6);
 await page.clock.runFor(61000);await expect(page.getByRole('heading',{name:'That was a quick round.'})).toBeVisible();await expect(page.locator('details')).toHaveCount(6);
 const saved=await page.evaluate(()=>GameEngine.getUserSnapshot());expect(saved.stats.games).toBe(1);expect(saved.xp).toBe(145);expect(saved.history[0].score).toBe(5);expect(saved.history[0].total).toBe(6);expect(saved.history[0].accuracy).toBe(83);
 await page.clock.runFor(10000);expect((await page.evaluate(()=>GameEngine.getUserSnapshot())).xp).toBe(145);expect(errors).toEqual([]);
});
test('an unanswered timed round does not manufacture progress',async({page})=>{
 await page.clock.install();await page.goto('/rapid.html?category=science');await page.getByRole('button',{name:'Start the 60-second round'}).click();await page.clock.fastForward(61000);
 await expect(page.getByText('No answers were submitted.',{exact:false})).toBeVisible();const saved=await page.evaluate(()=>GameEngine.getUserSnapshot());expect(saved.xp).toBe(0);expect(saved.stats.games).toBe(0);
});
test('a timeline can be placed by keyboard and a completed puzzle cannot award twice',async({page})=>{
 const errors=[];page.on('pageerror',e=>errors.push(e.message));await page.goto('/timeline-history.html');await expect(page.locator('.event-card')).toHaveCount(6);
 const ordered=await page.evaluate(()=>[...state.events].sort((a,b)=>a.year-b.year).map(event=>event.id));
 for(let i=0;i<ordered.length;i++){const card=page.locator(`[data-event-id="${ordered[i]}"]`);await card.focus();await card.press('Enter');const slot=page.locator(`.timeline-slot[data-index="${i}"]`);await slot.focus();await slot.press('Enter');}
 const verify=page.getByRole('button',{name:'Verify Timeline',exact:false});await verify.evaluate(button=>{button.click();button.click();});await expect(page.locator('#resultModal')).toBeVisible();const saved=await page.evaluate(()=>GameEngine.getUserSnapshot());expect(saved.stats.games).toBe(1);expect(saved.xp).toBe(300);expect(saved.history[0].score).toBe(6);expect(saved.history[0].xp).toBe(300);expect(saved.badges).not.toContain('perfect_round');expect(errors).toEqual([]);
});
test('events with the same year can occupy either matching timeline slot',async({page})=>{
 await page.goto('/timeline-history.html');await page.evaluate(()=>{state.events=[{id:'test-a',label:'Test event A',year:2000},{id:'test-b',label:'Test event B',year:2000}];state.placements={0:'test-b',1:'test-a'};renderTimeline();renderEventPool();});
 await page.getByRole('button',{name:'Verify Timeline',exact:false}).click();await expect(page.locator('#resultModal')).toBeVisible();expect((await page.evaluate(()=>GameEngine.getUserSnapshot())).stats.games).toBe(1);
});
async function hangmanFixture(page,word){await page.route('**/wordbank.json',route=>route.fulfill({contentType:'application/json',body:JSON.stringify([{word,category:'general',hint:'Test word',desc:'A controlled word for testing letter input.'}])}));await page.goto('/hangman.html');await expect(page.getByRole('button',{name:'Letter A',exact:true})).toBeVisible();}
test('Hangman reveals punctuation and numbers, survives an old broken save and shares profile levels',async({page})=>{
 await page.addInitScript(()=>localStorage.setItem('chronos_hangman_save_v2','broken JSON'));const errors=[];page.on('pageerror',e=>errors.push(e.message));await hangmanFixture(page,'PAC-MAN 3');
 const symbols=await page.locator('#word-container').evaluateAll(nodes=>[...nodes[0].children].filter(el=>el.textContent==='-'||el.textContent==='3').map(el=>({text:el.textContent,hidden:el.classList.contains('text-transparent')})));expect(symbols).toEqual([{text:'-',hidden:false},{text:'3',hidden:false}]);
 for(const letter of ['P','A','C','M','N'])await page.getByRole('button',{name:'Letter '+letter,exact:true}).click();
 await expect(page.locator('#game-modal')).toBeVisible();const saved=await page.evaluate(()=>GameEngine.getUserSnapshot());expect(saved.xp).toBe(60);expect(saved.stats.games).toBe(1);await expect(page.locator('#xp-text')).toHaveText('60 XP');await expect(page.locator('#level-badge')).toHaveText(String(saved.level));await expect(page.locator('#modal-xp')).toHaveText('+60');expect(errors).toEqual([]);
});
test('a lost Hangman word records zero XP exactly as its result says',async({page})=>{
 await hangmanFixture(page,'A');for(const letter of ['B','C','D','E','F','G'])await page.getByRole('button',{name:'Letter '+letter,exact:true}).click();await expect(page.locator('#game-modal')).toBeVisible();await expect(page.locator('#modal-xp')).toHaveText('+0');const saved=await page.evaluate(()=>GameEngine.getUserSnapshot());expect(saved.xp).toBe(0);expect(saved.stats.games).toBe(1);expect(saved.history[0].xp).toBe(0);
});
