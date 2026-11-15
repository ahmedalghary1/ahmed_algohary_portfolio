import { pathToFileURL } from 'node:url';
import { resolve } from 'node:path';
const qaRoot = process.env.QA_ROOT || '.qa-tools';
const { chromium } = await import(pathToFileURL(resolve(qaRoot, 'node_modules/playwright/index.mjs')).href);
const { default: AxeBuilder } = await import(pathToFileURL(resolve(qaRoot, 'node_modules/@axe-core/playwright/dist/index.mjs')).href);
import fs from 'node:fs/promises';
import assert from 'node:assert/strict';
const reportDir=process.env.REPORT_DIR || 'reports';
await fs.mkdir(`${reportDir}/screenshots`,{recursive:true});
const browser=await chromium.launch({headless:true,...(process.env.CHROME_PATH ? {executablePath:process.env.CHROME_PATH} : {})});
const results={layouts:[],axe:[],errors:[]};
for(const language of ['en','ar']){
 const context=await browser.newContext({reducedMotion:'reduce'});
 const page=await context.newPage();
 page.on('pageerror',e=>results.errors.push(e.message));
 for(const [width,height] of [[320,740],[375,812],[390,844],[430,932],[768,1024],[844,390],[1024,768],[1280,900],[1440,1000],[1920,1080],[2560,1440]]){
  await page.setViewportSize({width,height});await page.goto(`${process.env.TEST_URL || 'http://127.0.0.1:8017'}/?lang=${language}`);await page.waitForFunction(l=>document.documentElement.lang===l,language);await page.evaluate(()=>document.fonts.ready);
  const metrics=await page.evaluate(()=>({width:innerWidth,scrollWidth:document.documentElement.scrollWidth,overflow:[...document.querySelectorAll('main *,header *,footer *')].filter(e=>{const r=e.getBoundingClientRect();return r.width && (r.left<-.5||r.right>innerWidth+.5)}).slice(0,8).map(e=>e.tagName+'.'+e.className),menuVisible:!!document.querySelector('.menu-toggle').getClientRects().length}));
  results.layouts.push({language,width,height,...metrics});
  // Walk the page to load images and exercise actual reveal positions before capture.
  for(let y=0;y<await page.evaluate(()=>document.body.scrollHeight);y+=height){ await page.evaluate(y=>scrollTo(0,y),y); await page.waitForTimeout(35); }
  await page.locator('img[loading="lazy"]').evaluateAll(images=>{images.forEach(i=>i.loading='eager');return Promise.race([Promise.all(images.map(i=>i.decode().catch(()=>{}))),new Promise(r=>setTimeout(r,4000))]);});
  await page.evaluate(()=>scrollTo(0,0));
  if([320,375,390,430,768,1024,1440,1920,2560].includes(width))await page.screenshot({path:`${reportDir}/screenshots/${language}-${width}.png`,fullPage:true});
  if([390,1440].includes(width)){
   const axe=await new AxeBuilder({page}).withTags(['wcag2a','wcag2aa','wcag21a','wcag21aa','wcag22aa']).analyze();
   results.axe.push({language,width,violations:axe.violations.map(v=>({id:v.id,impact:v.impact,nodes:v.nodes.map(n=>({target:n.target,summary:n.failureSummary}))}))});
  }
 }
 await context.close();
}
await fs.writeFile(`${reportDir}/browser-audit.json`,JSON.stringify(results,null,2));
await browser.close();
assert.ok(results.layouts.every(layout=>layout.scrollWidth===layout.width && layout.overflow.length===0), 'Responsive overflow detected');
assert.ok(results.axe.every(result=>result.violations.length===0), 'Accessibility violations detected');
assert.deepEqual(results.errors, []);
console.log(`PASS ${results.layouts.length} responsive layouts and ${results.axe.length} axe audits; no overflow, violations or uncaught errors.`);
