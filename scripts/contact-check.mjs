import {pathToFileURL} from 'node:url';
import {resolve} from 'node:path';
const qaRoot=process.env.QA_ROOT||'.qa-tools';
const {chromium}=await import(pathToFileURL(resolve(qaRoot,'node_modules/playwright/index.mjs')).href);
const {default:AxeBuilder}=await import(pathToFileURL(resolve(qaRoot,'node_modules/@axe-core/playwright/dist/index.mjs')).href);
import fs from 'node:fs/promises';
import assert from 'node:assert/strict';
const browser=await chromium.launch({headless:true,executablePath:process.env.CHROME_PATH});
const results={layouts:[],checks:[],errors:[]};
const url=process.env.TEST_URL||'http://127.0.0.1:8017';
await fs.mkdir('reports/contact',{recursive:true});
for(const lang of ['ar','en']){
 const context=await browser.newContext({permissions:['clipboard-read','clipboard-write'],reducedMotion:'reduce'});
 const page=await context.newPage();page.on('pageerror',e=>results.errors.push(e.message));
 for(const [width,height] of [[320,740],[390,844],[768,1024],[1440,1000]]){
  await page.setViewportSize({width,height});await page.goto(`${url}/?lang=${lang}#contact`);await page.waitForSelector('#contact-form:visible');await page.evaluate(()=>document.fonts.ready);
  await page.locator('#contact').evaluate(e=>e.scrollIntoView({behavior:'instant'}));
  await page.screenshot({path:`reports/contact/${lang}-${width}.png`,fullPage:false});
  const overflow=await page.evaluate(()=>document.documentElement.scrollWidth>innerWidth);
  const axe=await new AxeBuilder({page}).include('#contact').withTags(['wcag2a','wcag2aa','wcag21aa','wcag22aa']).analyze();
  assert.equal(overflow,false);assert.deepEqual(axe.violations,[]);
  results.layouts.push({lang,width,overflow,axeViolations:axe.violations.length});
 }
 await page.locator('#contact-form [value=copy]').click();
 assert.equal(await page.evaluate(()=>document.activeElement.id),'contact-name');
 assert.equal(await page.locator('[aria-invalid=true]').count(),2);
 await page.locator('#contact-name').fill('أحمد Test');await page.locator('#contact-message').fill('مشروع ويب & واجهة <test>');
 await page.locator('#contact-form [value=copy]').click();
 await page.waitForFunction(()=>document.querySelector('#contact-feedback').textContent.length>0);
 assert.match(await page.evaluate(()=>navigator.clipboard.readText()),/مشروع ويب & واجهة <test>/);
 assert.equal(await page.locator('#contact-prepared').isVisible(),false);
 results.checks.push(`${lang}: required name/message, first-error focus and real clipboard copy passed`);
 await page.locator('.header-controls [data-language]').click();
 assert.equal(await page.locator('#contact-message').inputValue(),'مشروع ويب & واجهة <test>');
 assert.equal(await page.locator('#contact-name').inputValue(),'أحمد Test');
 results.checks.push(`${lang}: locale switch preserves visitor draft`);
 await page.evaluate(()=>Object.defineProperty(navigator,'clipboard',{value:{writeText:()=>Promise.reject(new Error('denied'))},configurable:true}));
 await page.locator('#contact-form [value=copy]').click();await page.waitForSelector('#contact-prepared:visible');
 assert.match(await page.locator('#prepared-message').inputValue(),/أحمد Test/);
 assert.equal(await page.evaluate(()=>document.activeElement.id),'prepared-message');
 results.checks.push(`${lang}: denied clipboard exposes selected manual-copy fallback`);
 // Fulfill navigation locally: never contact WhatsApp or send a test message.
 await page.route('https://wa.me/**',route=>route.fulfill({status:200,contentType:'text/html',body:'<title>Local WhatsApp handoff fixture</title>'}));
 for(const number of ['201156972307']) {
  await page.goto(`${url}/?lang=${lang}#contact`);await page.waitForSelector('#contact-form:visible');
  await page.locator('#contact-name').fill('أحمد Test');
  await page.locator('#contact-message').fill('مشروع ويب & واجهة <test>');
  assert.equal(await page.locator('input[name=recipient]').count(),0);
  await page.locator('#contact-form [value=whatsapp]').click();
  await page.waitForURL(`https://wa.me/${number}?**`);
  const destination=new URL(page.url());
  assert.equal(destination.pathname,`/${number}`);
  assert.match(destination.searchParams.get('text'),/مشروع ويب & واجهة <test>/);
 }
 results.checks.push(`${lang}: the single contact receives the correctly encoded draft in a local navigation fixture`);
 await context.close();
}
const context=await browser.newContext({javaScriptEnabled:false,viewport:{width:390,height:844}});const page=await context.newPage();await page.goto(`${url}/#contact`);assert.equal(await page.locator('#contact-form').isVisible(),false);assert.equal(await page.locator('#contact-action').isVisible(),true);assert.equal(await page.locator('.contact-channel:visible').count(),1);results.checks.push('The direct WhatsApp link remains visible without JavaScript');await context.close();
assert.deepEqual(results.errors,[]);await browser.close();await fs.writeFile('reports/contact/checks.json',JSON.stringify(results,null,2));console.log(JSON.stringify(results,null,2));
