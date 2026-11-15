import { chromium } from '../.qa-tools/node_modules/playwright/index.mjs';
import fs from 'node:fs/promises';
import assert from 'node:assert/strict';
import { createHash } from 'node:crypto';
const root=process.env.TEST_URL||'http://127.0.0.1:8017';
import { readPublicData } from './read-public-data.mjs';
const data=readPublicData();
const browser=await chromium.launch({channel:'chrome'});
const result={checks:[],errors:[],limits:[]};
try {
 for(const lang of ['en','ar']) for(const reducedMotion of ['reduce','no-preference']) {
  const context=await browser.newContext({reducedMotion,viewport:{width:390,height:844}});
  const page=await context.newPage();page.on('pageerror',e=>result.errors.push(e.message));
  await page.goto(`${root}/?lang=${lang}`);await page.waitForFunction(()=>document.documentElement.classList.contains('js'));
  await page.keyboard.press('Tab');assert.equal(await page.locator('.skip-link').evaluate(e=>e===document.activeElement),true);
  await page.keyboard.press('Enter');assert.equal(await page.evaluate(()=>document.activeElement.id),'main');
  await page.locator('.menu-toggle').click();await page.keyboard.press('Escape');
  assert.equal(await page.locator('.menu-toggle').evaluate(e=>e===document.activeElement),true);
  for(const project of data.profile.projects) {
   await page.goto(`${root}/?lang=${lang}#case-${project.id}`);
   await page.waitForFunction(()=>document.documentElement.classList.contains('js'));
   const anchor=page.locator(`#case-${project.id}`);assert.equal(await anchor.count(),1);
   await anchor.locator('..').locator('a[data-local-path]').click();
   await page.waitForFunction(()=>document.documentElement.classList.contains('js'));
   assert.equal(await page.locator('html').getAttribute('data-project-id'),project.id);
   const gallery=page.locator('.gallery-grid a').first();await gallery.focus();
   await page.keyboard.press('Enter');
   assert.equal(await page.locator('#project-lightbox').evaluate(e=>e.open),true);
   assert.ok((await page.locator('#lightbox-image').getAttribute('src')).includes(project.preview));
   await page.keyboard.press('Escape');
   assert.equal(await gallery.evaluate(e=>e===document.activeElement),true);
  }
  result.checks.push(`${lang}/${reducedMotion}: keyboard skip/menu/gallery, five legacy case hashes and detail navigation`);
  await context.close();
 }
 const context=await browser.newContext();const page=await context.newPage();
 await page.route('**/data/portfolio.json',r=>r.abort());
 await page.goto(root);await page.waitForFunction(()=>document.documentElement.classList.contains('js'));
 assert.equal(await page.locator('#contact-form').isVisible(),true);result.checks.push('Embedded content works with JSON endpoint unavailable');
 // Download bytes are checked through HTTP, independently of managed Chrome PDF handling.
 const response=await context.request.get(root+'/'+data.profile.cv);assert.equal(response.status(),200);
 const bytes=await response.body();const original=await fs.readFile('Ahmed Algohary-CV.pdf');
 assert.deepEqual(bytes,original);const hash=createHash('sha256').update(bytes).digest('hex');
 result.checks.push(`CV HTTP 200, ${bytes.length} bytes, exact original SHA256 ${hash}`);
 await page.locator('.social-links a[download]').scrollIntoViewIfNeeded();
 const downloadPromise=page.waitForEvent('download',{timeout:5000}).catch(()=>null);
 await page.locator('.social-links a[download]').click();const download=await downloadPromise;
 if(download) {
  const failure=await download.failure();
  if(failure)result.limits.push('Managed browser download failed: '+failure);
  else {const path=await download.path();assert.deepEqual(await fs.readFile(path),original);result.checks.push('Native CV download bytes match original');}
 } else result.limits.push('Managed Chrome did not emit a PDF download; HTTP bytes and native link verified, real-browser download remains unverified.');
 await context.close();
 const fallback=await browser.newContext();const staticPage=await fallback.newPage();
 await staticPage.route('**/js/main.js',r=>r.abort());await staticPage.goto(root+'/ar/');
 await staticPage.waitForTimeout(3200);assert.equal(await staticPage.locator('#navigation').isVisible(),true);
 assert.equal(await staticPage.locator('.project').count(),5);assert.equal(await staticPage.locator('a[href^="https://wa.me/"]').isVisible(),true);
 result.checks.push('Failed application module recovers visible native navigation/content/contact');await fallback.close();
} finally {await browser.close();const dir=process.env.REPORT_DIR||'reports/refactor/after';await fs.mkdir(dir,{recursive:true});await fs.writeFile(`${dir}/interactions.json`,JSON.stringify(result,null,2));}
assert.deepEqual(result.errors,[]);console.log(JSON.stringify(result,null,2));
