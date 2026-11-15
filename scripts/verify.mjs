// Optional browser QA. Install tools outside the deployed site; see README.md.
import assert from 'node:assert/strict';
import fs from 'node:fs/promises';
import { pathToFileURL } from 'node:url';
import { resolve } from 'node:path';
const qaRoot = process.env.QA_ROOT || '.qa-tools';
const { chromium } = await import(pathToFileURL(resolve(qaRoot, 'node_modules/playwright/index.mjs')).href);
const url = process.env.TEST_URL || 'http://127.0.0.1:8017';
const browser = await chromium.launch({ headless: true, ...(process.env.CHROME_PATH ? { executablePath: process.env.CHROME_PATH } : {}) });
const results = [], errors = [];
const check = async (name, fn) => { await fn(); results.push({ name, passed: true }); console.log(`PASS ${name}`); };
const create = async options => {
 const context = await browser.newContext(options);
 const page = await context.newPage();
 page.on('pageerror', error => errors.push(error.message));
 return { context, page };
};
try {
 const { page, context } = await create({ viewport: { width: 390, height: 844 }, reducedMotion: 'reduce' });
 await page.goto(`${url}/?lang=en`); await page.waitForSelector('html.js');
 await check('Skip link is first keyboard target and moves focus to main', async () => {
  await page.keyboard.press('Tab'); assert.equal(await page.locator('.skip-link').evaluate(e => e === document.activeElement), true);
  await page.keyboard.press('Enter'); assert.equal(await page.evaluate(() => document.activeElement.id), 'main');
 });
 await check('Mobile disclosure supports keyboard opening, Escape, and focus return', async () => {
  await page.locator('.menu-toggle').focus(); await page.keyboard.press('Enter');
  assert.equal(await page.locator('.menu-toggle').getAttribute('aria-expanded'), 'true');
  assert.equal(await page.locator('.menu-toggle [data-copy]').innerText(), 'Close menu');
  await page.keyboard.press('Escape');
  assert.equal(await page.locator('.menu-toggle').getAttribute('aria-expanded'), 'false');
  assert.equal(await page.locator('.menu-toggle').evaluate(e => e === document.activeElement), true);
 });
 await check('All five navigation links reach real sections and mobile menu closes', async () => {
  for (const id of ['work','about','expertise','process','contact']) {
   await page.locator('.menu-toggle').click(); await page.locator(`#navigation a[href="#${id}"]`).click();
   assert.equal(new URL(page.url()).hash, `#${id}`);
   assert.equal(await page.locator('.menu-toggle').getAttribute('aria-expanded'), 'false');
   assert.equal(await page.locator(`#${id}`).count(), 1);
   assert.equal(await page.evaluate(() => document.activeElement.id), id);
  }
 });
 await check('All five project studies expand from keyboard and expose full content', async () => {
  assert.equal(await page.locator('details').count(), 5);
  for (const details of await page.locator('details').all()) {
   await details.locator('summary').focus(); await page.keyboard.press('Enter');
   assert.equal(await details.getAttribute('open'), '');
   assert.equal(await details.locator('.case-study h4').count(), 3);
   assert.ok((await details.locator('.case-study').innerText()).length > 300);
  }
 });
 await check('Language switching updates RTL, metadata, art and accessible labels without reloading', async () => {
  await page.evaluate(() => { window.__sameDocument = 'retained'; });
  await page.locator('.header-controls [data-language]').click();
  assert.equal(await page.locator('html').getAttribute('lang'), 'ar'); assert.equal(await page.locator('html').getAttribute('dir'), 'rtl');
  assert.equal(new URL(page.url()).searchParams.get('lang'), 'ar');
  assert.match(await page.title(), /أحمد/);
  assert.match(await page.locator('.project-visual img').first().getAttribute('src'), /ahmed-gamal-1600\.webp/);
  assert.match(await page.locator('.project-visual img').first().getAttribute('alt'), /أحمد جمال/);
  assert.equal(await page.evaluate(() => window.__sameDocument), 'retained');
  assert.equal(await page.locator('.header-controls [data-language]').evaluate(e => e === document.activeElement), true);
 });
 await check('Saved language persists and URL preference wins', async () => {
  await page.goto(url); assert.equal(await page.locator('html').getAttribute('lang'), 'ar');
  await page.goto(`${url}/?lang=en`); await page.waitForSelector('html.js'); assert.equal(await page.locator('html').getAttribute('lang'), 'en');
 });
 await check('Reduced motion keeps the real portrait visible without a WebGL canvas', async () => {
  assert.equal(await page.locator('canvas, #sculpture, .scene-toggle').count(), 0);
  assert.equal(await page.locator('.hero-portrait').evaluate(e => e.complete && e.naturalWidth > 0), true);
  assert.equal(await page.evaluate(() => getComputedStyle(document.documentElement).scrollBehavior), 'auto');
 });
 await check('No dead anchors; the supplied WhatsApp contact is visible', async () => {
  assert.deepEqual(await page.locator('a[href^="#"]').evaluateAll(links => links.map(a=>a.getAttribute('href')).filter(h=>h==='#'||!document.querySelector(h))), []);
  assert.equal(await page.locator('a[href^="mailto:"]').count(), 0); assert.equal(await page.locator('#social-links a').count(), 0);
  assert.deepEqual(await page.locator('.contact-channel').evaluateAll(links=>links.map(a=>a.href)),['https://wa.me/201156972307']);
 });
 await check('200% equivalent zoom reflows in both languages', async () => {
  // A 1280px desktop at 200% zoom has a 640 CSS pixel layout viewport.
  await page.setViewportSize({width:640,height:450});
  for(const lang of ['en','ar']){
   await page.goto(`${url}/?lang=${lang}`); await page.waitForSelector('html.js'); await page.evaluate(()=>document.fonts.ready);
   assert.equal(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth),true);
   for(const details of await page.locator('details').all()) await details.locator('summary').click();
   assert.equal(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth),true);
  }
 });
 await context.close();
 const deepLinks = await create({ reducedMotion:'reduce', viewport:{width:390,height:844} });
 for (const lang of ['en','ar']) {
  await check(`${lang}: direct case links open, label, persist on reload and close correctly`, async () => {
   await deepLinks.page.goto(`${url}/?lang=${lang}#case-ahmed-gamal`);
   const study = deepLinks.page.locator('#case-ahmed-gamal');
   await deepLinks.page.waitForFunction(() => document.querySelector('#case-ahmed-gamal').open);
   assert.equal(await study.locator('[data-copy="work.closeDetails"]').count(),1);
   await deepLinks.page.reload();
   await deepLinks.page.waitForFunction(() => document.querySelector('#case-ahmed-gamal').open);
   await study.locator('summary').click();
   await deepLinks.page.waitForFunction(() => location.hash === '#project-ahmed-gamal');
   assert.equal(await study.locator('[data-copy="work.details"]').count(),1);
  });
  await check(`${lang}: full-size preview links use the original-resolution public assets and have 44px targets`, async () => {
   for (const preview of await deepLinks.page.locator('[data-project-preview]').all()) {
    assert.match(await preview.getAttribute('href'),/assets\/images\/projects\/.+-(1920|1632)\.webp$/);
    assert.ok((await preview.getAttribute('aria-label')).length>25);
    assert.ok(await preview.evaluate(e=>e.getBoundingClientRect().height>=44));
   }
  });
  await check(`${lang}: four live links and one private project are presented correctly`, async () => {
   assert.deepEqual(await deepLinks.page.locator('.project-visit').evaluateAll(links => links.map(a => a.href)), [
    'https://ahmed-gamal-seven.vercel.app/', 'https://rocks-ev.com/',
    'https://bonyan-nine.vercel.app/', 'https://ahmed-nabil-sooty.vercel.app/'
   ]);
   assert.equal(await deepLinks.page.locator('#project-garment-factory .project-visit').count(), 0);
   assert.equal(await deepLinks.page.locator('#project-garment-factory .project-privacy').isVisible(), true);
   for (const link of await deepLinks.page.locator('.project-visit').all()) {
    assert.equal(await link.getAttribute('target'), '_blank');
    assert.match(await link.getAttribute('rel'), /noopener/);
   }
  });
 }
 await deepLinks.context.close();
 const blockedMain = await create({viewport:{width:390,height:844}});
 await blockedMain.page.route('**/js/main.js', route=>route.abort());
 await blockedMain.page.goto(url);
 await check('Failed main module restores native mobile navigation after the pre-paint reservation',async()=>{
  await blockedMain.page.waitForFunction(()=>!document.documentElement.classList.contains('has-js'));
  assert.equal(await blockedMain.page.locator('#navigation a:visible').count(),5);
  assert.equal(await blockedMain.page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth),true);
 });
 await blockedMain.context.close();
 const staticSite = await create({ javaScriptEnabled: false, viewport: {width:320,height:740} });
 await staticSite.page.goto(url);
 await check('Without JavaScript all English content, links, details and artwork remain usable', async () => {
  assert.equal(await staticSite.page.locator('.project').count(),5);assert.equal(await staticSite.page.locator('#navigation a:visible').count(),5);
  await staticSite.page.locator('summary').first().click();assert.equal(await staticSite.page.locator('details').first().getAttribute('open'),'');
  assert.match(await staticSite.page.locator('h1').innerText(),/Engineering/);
  assert.equal(await staticSite.page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth),true);
 });
 await staticSite.context.close();
 const blocked = await create({ reducedMotion:'reduce' });
 await blocked.page.addInitScript(() => { Object.defineProperty(Storage.prototype,'getItem',{value(){throw new Error('Storage disabled')}}); Object.defineProperty(Storage.prototype,'setItem',{value(){throw new Error('Storage disabled')}}); });
 await blocked.page.goto(`${url}/?lang=ar`);await blocked.page.waitForSelector('html.js');
 await check('Unavailable localStorage still permits query language and switching', async () => {
  assert.equal(await blocked.page.locator('html').getAttribute('lang'),'ar');await blocked.page.locator('.header-controls [data-language]').click();assert.equal(await blocked.page.locator('html').getAttribute('lang'),'en');
 });
 await blocked.context.close();
 const failedLibraries = await create({ viewport:{width:1440,height:1000} });
 await failedLibraries.page.route('**/assets/vendor/**',route=>route.abort());
 await failedLibraries.page.goto(url);await failedLibraries.page.waitForSelector('html.js');
 await check('Blocked enhancement libraries preserve visible content and functional localization',async()=>{
  await failedLibraries.page.waitForTimeout(400);
  assert.equal(await failedLibraries.page.locator('.hero-line').first().evaluate(e=>getComputedStyle(e).opacity),'1');
  assert.equal(await failedLibraries.page.locator('.hero-portrait').evaluate(e=>e.complete && e.naturalWidth > 0),true);
  await failedLibraries.page.locator('.header-controls [data-language]').click();assert.equal(await failedLibraries.page.locator('html').getAttribute('lang'),'ar');
 });
 await failedLibraries.context.close();
 const enhanced=await create({viewport:{width:1440,height:1000}});
 const sceneRequests=[];
 enhanced.page.on('request',request=>{if(/\/(scene\.js|three[^/]*\.js)/.test(request.url()))sceneRequests.push(request.url());});
 await enhanced.page.goto(`${url}/?lang=en`);
 await enhanced.page.waitForSelector('html.js');
 await enhanced.page.waitForSelector('canvas');
 await check('The real portrait remains alongside a single decorative scene',async()=>{
  assert.equal(await enhanced.page.locator('canvas').count(),1);
  assert.equal(await enhanced.page.locator('.hero-portrait').getAttribute('fetchpriority'),'high');
  assert.equal(await enhanced.page.locator('[data-profile-image]').count(),2);
  assert.equal(await enhanced.page.locator('.hero-portrait').evaluate(async e=>{await e.decode();return e.naturalWidth>0;}),true);
  assert.match(await enhanced.page.locator('.hero-portrait').getAttribute('srcset'),/480w.+896w.+1122w/);
 });
 await check('Repeated language switches preserve the portrait and ScrollTrigger count',async()=>{
  await enhanced.page.waitForFunction(()=>!!window.ScrollTrigger);
  const count=await enhanced.page.evaluate(()=>window.ScrollTrigger.getAll().length);
  for(let i=0;i<6;i++)await enhanced.page.locator('.header-controls [data-language]').click();
  await enhanced.page.waitForTimeout(200);
  assert.equal(await enhanced.page.evaluate(()=>window.ScrollTrigger.getAll().length),count);assert.equal(await enhanced.page.locator('canvas').count(),1);
  assert.ok(sceneRequests.length>0);
 });
 await enhanced.page.screenshot({path:'reports/screenshots/en-desktop-enhanced.png',fullPage:false});
 await check('Live reduced-motion preference preserves the portrait',async()=>{
  await enhanced.page.emulateMedia({reducedMotion:'reduce'});
  await enhanced.page.waitForFunction(()=>document.querySelectorAll('canvas').length===0);
  assert.equal(await enhanced.page.locator('.hero-portrait').isVisible(),true);
  assert.equal(await enhanced.page.locator('canvas').count(),0);
 });
 await check('Page lifecycle disposal clears ScrollTriggers and retains the portrait',async()=>{
  await enhanced.page.evaluate(()=>window.dispatchEvent(new PageTransitionEvent('pagehide',{persisted:true})));
  assert.equal(await enhanced.page.locator('.hero-portrait').isVisible(),true);
  await enhanced.page.evaluate(()=>window.dispatchEvent(new PageTransitionEvent('pagehide',{persisted:false})));
  assert.equal(await enhanced.page.locator('canvas').count(),0);
  assert.equal(await enhanced.page.evaluate(()=>window.ScrollTrigger.getAll().length),0);
 });
 await enhanced.context.close();
 assert.deepEqual(errors,[]);results.push({name:'No uncaught JavaScript errors',passed:true});
 await fs.writeFile('reports/interaction-tests.json',JSON.stringify({results,errors},null,2));
}finally{await browser.close();}
