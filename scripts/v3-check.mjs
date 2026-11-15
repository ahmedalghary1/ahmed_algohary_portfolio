import { chromium } from '../.qa-tools/node_modules/playwright/index.mjs';
import AxeBuilder from '../.qa-tools/node_modules/@axe-core/playwright/dist/index.mjs';
import fs from 'node:fs/promises';
import assert from 'node:assert/strict';
const root=process.env.TEST_URL||'http://127.0.0.1:8017';
const dir=process.env.REPORT_DIR||'reports/v3/media';
await fs.mkdir(dir,{recursive:true});
const browser=await chromium.launch({channel:'chrome'});
const result={checks:[],errors:[],violations:[]};
try {
 for(const lang of ['en','ar']) for(const width of [390,1440]) {
  const context=await browser.newContext({viewport:{width,height:1000},reducedMotion:'reduce'});
  const page=await context.newPage();page.on('pageerror',error=>result.errors.push(error.message));
  await page.goto(root+(lang==='ar'?'/ar/':'/')+'projects/garment-factory/');
  await page.waitForFunction(()=>document.documentElement.classList.contains('js'));
  assert.equal(await page.locator('.video-section').count(),0);
  assert.equal(await page.locator('.case-technologies').count(),0);
  const opener=page.locator('[data-gallery-index]').first();
  await opener.focus();await page.keyboard.press('Enter');
  const dialog=page.locator('#project-lightbox');assert.ok(await dialog.evaluate(e=>e.open));
  assert.ok(await page.locator('#lightbox-image').evaluate(image=>image.decode().then(()=>image.naturalWidth>0)));
  assert.equal(await dialog.locator('[data-gallery-next]').isVisible(),false);
  assert.equal(await dialog.locator('[data-gallery-previous]').isVisible(),false);
  assert.equal(await page.locator('html').evaluate(e=>getComputedStyle(e).overflow),'hidden');
  for(let i=0;i<6;i++) {await page.keyboard.press('Tab');assert.ok(await dialog.evaluate(e=>e.contains(document.activeElement)));}
  const axe=await new AxeBuilder({page}).withTags(['wcag2a','wcag2aa','wcag21a','wcag21aa','wcag22aa']).analyze();
  result.violations.push(...axe.violations.map(v=>({lang,width,id:v.id,nodes:v.nodes.map(n=>n.target)})));
  assert.equal(await dialog.evaluate(e=>e.scrollWidth<=e.clientWidth),true);
  await page.screenshot({path:`${dir}/lightbox-${lang}-${width}.png`});
  await page.keyboard.press('Escape');assert.equal(await dialog.evaluate(e=>e.open),false);
  assert.equal(await opener.evaluate(e=>e===document.activeElement),true);
  assert.notEqual(await page.locator('html').evaluate(e=>getComputedStyle(e).overflow),'hidden');
  await opener.click();await page.locator('[data-gallery-close]').click();assert.equal(await dialog.evaluate(e=>e.open),false);
  result.checks.push(`${lang}/${width}: original image, modal focus trap/return, Escape/close, scroll lock, single-image controls, axe`);
  await context.close();
 }
 // Test-only payload expands an existing approved gallery, without publishing fake media.
 for(const lang of ['en','ar']) {
  const context=await browser.newContext({viewport:{width:390,height:844},hasTouch:true});
  const page=await context.newPage();page.on('pageerror',e=>result.errors.push(e.message));
  await page.route('**/projects/garment-factory/',async route=>{
   const response=await route.fetch();let html=await response.text();
   html=html.replace(/(<script type="application\/json" id="portfolio-content">)([\s\S]*?)(<\/script>)/,(_,start,raw,end)=>{
    const content=JSON.parse(raw),r=content.profile.projects[0];
    r.screenshots.push({...r.screenshots[0],src:content.profile.projects[1].preview});
    for(const locale of ['en','ar']) content[locale].projects[0].media.push(content[locale].projects[1].media[0]);
    return start+JSON.stringify(content).replaceAll('<','\\u003c')+end;
   });
   await route.fulfill({response,body:html});
  });
  await page.goto(root+(lang==='ar'?'/ar/':'/')+'projects/garment-factory/');
  await page.locator('[data-gallery-index]').first().click();
  const img=page.locator('#lightbox-image');const first=await img.getAttribute('src');
  await page.locator('[data-gallery-next]').click();assert.notEqual(await img.getAttribute('src'),first);
  await page.keyboard.press(lang==='ar'?'ArrowLeft':'ArrowRight');assert.equal(await img.getAttribute('src'),first);
  await page.locator('#project-lightbox').dispatchEvent('pointerdown',{pointerType:'touch',clientX:lang==='ar'?40:300,clientY:300});
  await page.locator('#project-lightbox').dispatchEvent('pointerup',{pointerType:'touch',clientX:lang==='ar'?300:40,clientY:300});
  assert.notEqual(await img.getAttribute('src'),first);
  await page.locator('[data-gallery-previous]').click();assert.equal(await img.getAttribute('src'),first);
  if(await page.locator('[data-gallery-fullscreen]').isVisible()) {
   await page.locator('[data-gallery-fullscreen]').click();
   await page.waitForFunction(()=>document.fullscreenElement?.classList.contains('lightbox-panel'));
   await page.locator('[data-gallery-fullscreen]').click();await page.waitForFunction(()=>!document.fullscreenElement);
  }
  await page.keyboard.press('Escape');
  result.checks.push(`${lang}: two-image fixture, previous/next, wrap, RTL keyboard, touch swipe and fullscreen`);
  await context.close();
 }
 const noJs=await browser.newContext({javaScriptEnabled:false});const staticPage=await noJs.newPage();
 await staticPage.goto(root+'/ar/projects/garment-factory/');
 const popupPromise=noJs.waitForEvent('page');await staticPage.locator('[data-gallery-index]').first().click();
 const popup=await popupPromise;await popup.waitForLoadState('domcontentloaded');
 assert.ok(popup.url().endsWith('garment-factory-1920.webp'));await noJs.close();
 result.checks.push('No-JavaScript gallery links still open the actual original image');
 const missing=await browser.newContext();const missingPage=await missing.newPage();
 await missingPage.route('**/garment-factory-1920.webp',route=>route.fulfill({status:404,body:''}));
 await missingPage.goto(root+'/projects/garment-factory/');await missingPage.locator('[data-gallery-index]').first().click();
 await missingPage.locator('.lightbox-error').waitFor({state:'visible'});
 assert.ok(await missingPage.locator('#lightbox-original').getAttribute('href'));
 await missingPage.keyboard.press('Escape');await missing.close();
 result.checks.push('Missing full-size image produces a localized fallback link and the modal still closes');
 assert.deepEqual(result.errors,[]);assert.deepEqual(result.violations,[]);
} finally {await browser.close();await fs.writeFile(`${dir}/checks.json`,JSON.stringify(result,null,2));}
console.log(JSON.stringify(result,null,2));
