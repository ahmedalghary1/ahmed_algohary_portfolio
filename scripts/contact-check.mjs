import {chromium} from '/tmp/portfolio-qa/node_modules/playwright/index.mjs';
import AxeBuilder from '/tmp/portfolio-qa/node_modules/@axe-core/playwright/dist/index.mjs';
import fs from 'node:fs/promises';
import assert from 'node:assert/strict';
const browser=await chromium.launch({headless:true,executablePath:process.env.CHROME_PATH});
const results={layouts:[],checks:[],errors:[]};
await fs.mkdir('reports/contact',{recursive:true});
for(const lang of ['ar','en']){
 const context=await browser.newContext({permissions:['clipboard-read','clipboard-write'],reducedMotion:'reduce'});
 const page=await context.newPage();page.on('pageerror',e=>results.errors.push(e.message));
 for(const [width,height] of [[320,740],[390,844],[768,1024],[1440,1000]]){
  await page.setViewportSize({width,height});await page.goto(`http://127.0.0.1:8017/?lang=${lang}#contact`);await page.waitForSelector('#contact-form:visible');await page.evaluate(()=>document.fonts.ready);
  await page.locator('#contact').evaluate(e=>e.scrollIntoView({behavior:'instant'}));
  await page.screenshot({path:`reports/contact/${lang}-${width}.png`,fullPage:false});
  const overflow=await page.evaluate(()=>document.documentElement.scrollWidth>innerWidth);
  const axe=await new AxeBuilder({page}).include('#contact').withTags(['wcag2a','wcag2aa','wcag21aa','wcag22aa']).analyze();
  assert.equal(overflow,false);assert.deepEqual(axe.violations,[]);
  results.layouts.push({lang,width,overflow,axeViolations:axe.violations.length});
 }
 await page.locator('#contact-form [value=copy]').click();
 assert.equal(await page.evaluate(()=>document.activeElement.id),'contact-name');
 assert.equal(await page.locator('[aria-invalid=true]').count(),3);
 await page.locator('#contact-name').fill('أحمد Test');await page.locator('#contact-email').fill('wrong');await page.locator('#contact-message').fill('مشروع ويب & واجهة <test>');
 await page.locator('#contact-form [value=copy]').click();assert.equal(await page.evaluate(()=>document.activeElement.id),'contact-email');
 await page.locator('#contact-email').fill('visitor@example.test');
 await page.locator('#contact-form [value=copy]').click();
 await page.waitForFunction(()=>document.querySelector('#contact-feedback').textContent.length>0);
 assert.match(await page.evaluate(()=>navigator.clipboard.readText()),/مشروع ويب & واجهة <test>/);
 assert.equal(await page.locator('#contact-prepared').isVisible(),false);
 results.checks.push(`${lang}: empty fields, invalid email, first-error focus and real clipboard copy passed`);
 await page.locator('.header-controls [data-language]').click();
 assert.equal(await page.locator('#contact-message').inputValue(),'مشروع ويب & واجهة <test>');
 assert.equal(await page.locator('#contact-email').inputValue(),'visitor@example.test');
 results.checks.push(`${lang}: locale switch preserves visitor draft`);
 await page.evaluate(()=>Object.defineProperty(navigator,'clipboard',{value:{writeText:()=>Promise.reject(new Error('denied'))},configurable:true}));
 await page.locator('#contact-form [value=copy]').click();await page.waitForSelector('#contact-prepared:visible');
 assert.match(await page.locator('#prepared-message').inputValue(),/visitor@example.test/);
 assert.equal(await page.evaluate(()=>document.activeElement.id),'prepared-message');
 results.checks.push(`${lang}: denied clipboard exposes selected manual-copy fallback`);
 await context.close();
}
const context=await browser.newContext({javaScriptEnabled:false,viewport:{width:390,height:844}});const page=await context.newPage();await page.goto('http://127.0.0.1:8017/#contact');assert.equal(await page.locator('#contact-form').isVisible(),false);assert.equal(await page.locator('#contact-action').isVisible(),true);results.checks.push('No-JavaScript contact state remains honest and visible');await context.close();
assert.deepEqual(results.errors,[]);await browser.close();await fs.writeFile('reports/contact/checks.json',JSON.stringify(results,null,2));console.log(JSON.stringify(results,null,2));
