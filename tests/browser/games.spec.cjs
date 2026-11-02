const {test,expect}=require('@playwright/test');
test.beforeEach(async({context})=>{await context.route('**/*',route=>{const u=new URL(route.request().url());return u.hostname==='127.0.0.1'?route.continue():route.fulfill({body:'',contentType:'text/javascript'});});await context.addInitScript(()=>localStorage.setItem('qr_consent_v1','{"analytics":false}'));});
test('duel enforces the optional timer',async({page})=>{
 await page.goto('/duel.html');await page.locator('#duel-timed').check();await page.getByRole('button',{name:'Start the duel'}).click();await page.getByRole('button',{name:'I’m ready'}).click();await expect(page.getByText('Time’s up.',{exact:false})).toBeVisible({timeout:18000});await expect(page.locator('[data-answer]:enabled')).toHaveCount(0);await page.getByRole('button',{name:'Pass the device'}).click();await expect(page.getByRole('heading',{name:'Over to Player two.'})).toBeVisible();
});
test('reaction game handles a false start and records five trials',async({page})=>{
 await page.goto('/reaction-five.html');await page.getByRole('button',{name:'Start playing'}).click();await page.locator('#reaction-target').click();await expect(page.getByRole('button',{name:'A little early. Try again.'})).toBeVisible();
 for(let i=0;i<5;i++){await expect(page.locator('#reaction-target')).toHaveClass(/ready/,{timeout:7000});await page.locator('#reaction-target').click();}
 await expect(page.getByRole('heading',{name:'Your median reaction'})).toBeVisible();const s=await page.evaluate(()=>GameEngine.state);expect(s.stats.games).toBe(1);expect(s.history[0].game).toBe('Reaction Five');expect(s.history[0].accuracy).toBeNull();
});
test('memory game accepts a sequence and handles a mistake',async({page})=>{
 await page.goto('/memory-trail.html');await page.getByRole('button',{name:'Start playing'}).click();const active=page.locator('.r-memory-tile.active');await expect(active).toHaveCount(1);const first=await active.getAttribute('data-tile');await expect(page.getByText('Your turn. Repeat the order.',{exact:true})).toBeVisible();await page.locator(`[data-tile="${first}"]`).click();await expect(page.locator('#memory-round')).toHaveText('Round 2');await expect(active).toHaveCount(1);const next=await active.getAttribute('data-tile');await expect(page.getByText('Your turn. Repeat the order.',{exact:true})).toBeVisible();await page.locator(`[data-tile="${(Number(next)+1)%16}"]`).click();await expect(page.getByRole('heading',{name:'Sequence remembered'})).toBeVisible();await expect(page.locator('.r-result-score')).toContainText('1 round');
});
test('crossword accepts input and restores its local autosave',async({page})=>{
 const errors=[];page.on('pageerror',e=>errors.push(e.message));await page.goto('/crossword.html');const modal=page.locator('#categoryModal');if(await modal.isVisible()){const button=modal.locator('button').filter({hasText:/General|Friends/}).first();if(await button.count())await button.click();}
 const cell=page.locator('.cell:not(.block)').filter({has:page.locator('.l')}).first();await cell.click();await page.keyboard.press('A');await page.waitForTimeout(350);const saved=await page.evaluate(()=>JSON.parse(localStorage.getItem('QR_CW15_GAME')));expect(saved.values.flat()).toContain('A');await page.reload();const current=await page.locator('.cell .l').allTextContents();expect(current).toContain('A');expect(errors).toEqual([]);
});
test('retained game result screens do not throw or record fictitious examples',async({page})=>{
 const errors=[];page.on('pageerror',e=>errors.push(e.message));
 for(const name of ['quiz-xmas-songs.html','quiz-xmas-visual.html','quiz-batman-trivia.html','quiz-gotham-villain.html']){
  await page.goto('/'+name);await page.evaluate(()=>{if(typeof showResults==='function')showResults();else if(typeof endGame==='function')endGame();});
 }
 expect(errors).toEqual([]);
});
