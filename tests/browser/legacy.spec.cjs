const {test,expect}=require('@playwright/test');
const puzzles=require('../../site/nexus-puzzles.json');
test.beforeEach(async({context})=>{
 await context.route('**/*',route=>['127.0.0.1','localhost'].includes(new URL(route.request().url()).hostname)?route.continue():route.fulfill({status:200,body:''}));
 await context.addInitScript(()=>localStorage.setItem('qr_consent_v1','{"analytics":false}'));
});
test('Nexus grouping still solves a complete puzzle after the copy and theme refresh',async({page})=>{
 const errors=[];page.on('pageerror',e=>errors.push(e.message));await page.goto('/nexus.html');await expect(page.locator('.word-card')).toHaveCount(16);
 const id=Number((await page.locator('#puzzle-label').textContent()).match(/\d+/)[0]);const puzzle=puzzles.find(p=>p.id===id);expect(puzzle).toBeTruthy();
 for(const group of puzzle.groups){for(const word of group.items)await page.locator('.word-card').filter({hasText:new RegExp('^'+word.replace(/[.*+?^${}()|[\]\\]/g,'\\$&')+'$')}).click();await page.locator('#submit-btn').click();await expect(page.locator('.solved-row')).toHaveCount(puzzle.groups.indexOf(group)+1);}
 await expect(page.locator('#win-modal')).toBeVisible();await expect(page.locator('.word-card')).toHaveCount(0);expect(errors).toEqual([]);
});
test('Word Ladder accepts a complete valid path and records its result',async({page})=>{
 const errors=[];page.on('pageerror',e=>errors.push(e.message));await page.goto('/word-ladder.html');const words=await page.evaluate(()=>solutionPath.slice(1));expect(words.length).toBeGreaterThan(0);
 for(const word of words){await page.locator('#user-input').fill(word);await page.locator('#user-input').press('Enter');}
 await expect(page.locator('#result-modal')).toBeVisible();await expect(page.locator('#resMoves')).toHaveText(String(words.length));const saved=await page.evaluate(()=>GameEngine.getUserSnapshot());expect(saved.stats.games).toBe(1);expect(errors).toEqual([]);
});
test('Sketch and Guess completes ten shared-screen turns and keeps its earned progress',async({page})=>{
 await page.clock.install();const errors=[];page.on('pageerror',e=>errors.push(e.message));page.on('dialog',dialog=>dialog.accept());await page.goto('/minigames.html');await page.getByRole('button',{name:'START SESSION',exact:false}).click();
 for(let turn=0;turn<10;turn++){await page.locator('[onclick="showSecretWord()"]').click();await expect(page.locator('#secretWordText')).not.toHaveText('WORD');await page.locator('[onclick="startRoundTimer()"]').click();await page.locator('[onclick="endTurn(true)"]').click();if(turn<9){await expect(page.locator('#handoverModal')).toBeVisible();await page.clock.runFor(5100);}}
 await expect(page.locator('#setupPanel')).toBeVisible();const saved=await page.evaluate(()=>GameEngine.getUserSnapshot());expect(saved.stats.games).toBe(1);expect(saved.history[0].game).toBe('Sketch and Guess');expect(saved.xp).toBe(200);expect(errors).toEqual([]);
});
