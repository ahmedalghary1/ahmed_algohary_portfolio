import { chromium } from '../.qa-tools/node_modules/playwright/index.mjs';
import AxeBuilder from '../.qa-tools/node_modules/@axe-core/playwright/dist/index.mjs';
import fs from 'node:fs/promises';
import assert from 'node:assert/strict';
import { readPublicData } from './read-public-data.mjs';
const data=readPublicData();
const root=process.env.TEST_URL||'http://127.0.0.1:8017';
const dir=process.env.REPORT_DIR||'reports/redesign';
await fs.mkdir(`${dir}/screenshots`,{recursive:true});
const browser=await chromium.launch({channel:'chrome'});
const results={layouts:[],pages:[],axe:[],errors:[],consoleErrors:[],checks:[],content:{}};
try {
 for(const lang of ['en','ar']) {
  const context=await browser.newContext({reducedMotion:'reduce'});
  const page=await context.newPage();
  page.on('pageerror',e=>results.errors.push(e.message));
  page.on('console',m=>{if(m.type()==='error') results.consoleErrors.push(m.text());});
  const prefix=lang==='ar'?'/ar/':'/';
  for(const width of [360,390,480,768,1024,1280,1440,1920]) {
   await page.setViewportSize({width,height:width<768?844:1000});
   await page.goto(root+prefix);await page.evaluate(()=>document.fonts.ready);
   await page.waitForFunction(()=>document.documentElement.classList.contains('js'));
   const layout=await page.evaluate(()=>({width:innerWidth,scrollWidth:document.documentElement.scrollWidth,overflow:[...document.querySelectorAll('main *,header *,footer *')].filter(e=>{const r=e.getBoundingClientRect();return r.width>0&&(r.left<-.5||r.right>innerWidth+.5)}).slice(0,8).map(e=>e.tagName+'.'+e.className)}));
   results.layouts.push({lang,...layout});
   assert.equal(await page.locator('.hero-actions a').count(),2);
   assert.equal(await page.locator('.hero img').count(),1);
   assert.deepEqual(await page.locator('main>section,main>.showcase>section').evaluateAll(es=>es.map(e=>e.id||'hero')),['hero','work','stack','services','about','experience','contact']);
   assert.deepEqual(await page.locator('.project').evaluateAll(es=>es.map(e=>e.id)),data.profile.projects.map(r=>'project-'+r.id));
   assert.equal(await page.locator('.stack-group li').count(),13);
   assert.equal(await page.locator('.service').count(),4);
   assert.equal(await page.locator('.career-list li').count(),2);
   assert.equal(await page.locator('.project-featured .project-highlights li').count(),3);
   if(width===390) {
    await page.locator('.menu-toggle').click();await page.locator('#navigation a[href*=services]').click();
    assert.equal(await page.locator('.menu-toggle').getAttribute('aria-expanded'),'false');
    await page.locator('.menu-toggle').click();await page.keyboard.press('Escape');
    assert.equal(await page.locator('.menu-toggle').getAttribute('aria-expanded'),'false');
    await page.evaluate(()=>scrollTo(0,0));
   }
   if(width===1440) {
    for(const [filter,count] of [['websites',3],['commerce',1],['systems',1],['all',5]]) {
     await page.locator(`[data-filter="${filter}"]`).click();
     assert.equal(await page.locator('.project:not([hidden])').count(),count);
     assert.equal(await page.locator(`[data-filter="${filter}"]`).getAttribute('aria-pressed'),'true');
    }
    await page.evaluate(()=>scrollTo(0,0));
   }
   if([390,1440].includes(width)) {
    await page.locator('img[loading=lazy]').evaluateAll(es=>Promise.all(es.map(e=>{e.loading='eager';return e.decode().catch(()=>{});})));await page.evaluate(()=>scrollTo(0,0));
    await page.screenshot({path:`${dir}/screenshots/home-${lang}-${width}.png`,fullPage:true});
    await page.screenshot({path:`${dir}/screenshots/hero-${lang}-${width}.png`});
    const axe=await new AxeBuilder({page}).withTags(['wcag2a','wcag2aa','wcag21a','wcag21aa','wcag22aa']).analyze();
    results.axe.push({page:prefix,width,violations:axe.violations.map(v=>({id:v.id,nodes:v.nodes.map(n=>({target:n.target,summary:n.failureSummary}))}))});
   }
   if(width===1440) results.content[lang]=await page.evaluate(()=>({general:[...document.querySelectorAll('main>section:not(#work):not(#contact)')].map(e=>e.innerText).join(' '),height:document.body.scrollHeight,workTop:document.querySelector('#work').getBoundingClientRect().top}));
  }
  for(const record of data.profile.projects) {
   const path=prefix+'projects/'+record.slug+'/';
   for(const width of [360,390,480,768,1024,1280,1440,1920]) {
    await page.setViewportSize({width,height:width===390?844:1000});
    const response=await page.goto(root+path);assert.equal(response.status(),200);
    await page.evaluate(()=>document.fonts.ready);
    await page.waitForFunction(()=>document.documentElement.classList.contains('js'));
    assert.equal(await page.locator('h1').count(),1);
    assert.equal(await page.locator('link[rel=canonical]').getAttribute('href'),data.profile.url+path.slice(1));
    assert.equal(await page.locator('.gallery-grid a').count(),record.screenshots.length);
    const checks=await page.evaluate(()=>({width:innerWidth,scrollWidth:document.documentElement.scrollWidth,images:[...document.querySelectorAll('main img[src]')].every(e=>e.loading==='lazy'||e.complete&&e.naturalWidth>0),title:document.title}));
    results.pages.push({path,...checks});
    if([390,1440].includes(width)) {
     await page.locator('img[loading=lazy]').evaluateAll(es=>Promise.all(es.map(e=>{e.loading='eager';return e.decode().catch(()=>{});})));await page.screenshot({path:`${dir}/screenshots/${record.slug}-${lang}-${width}.png`,fullPage:true});
     const axe=await new AxeBuilder({page}).withTags(['wcag2a','wcag2aa','wcag21a','wcag21aa','wcag22aa']).analyze();
     results.axe.push({page:path,width,violations:axe.violations.map(v=>({id:v.id,nodes:v.nodes.map(n=>({target:n.target,summary:n.failureSummary}))}))});
    }
   }
   await page.locator('.header-controls [data-language]').click();
   const other=lang==='en'?'ar':'en';
   assert.equal(await page.locator('html').getAttribute('lang'),other);
   assert.equal(await page.locator('html').getAttribute('dir'),other==='ar'?'rtl':'ltr');
   assert.match(await page.title(),new RegExp(data[other].projects.find((_,i)=>data.profile.projects[i].id===record.id).title));
   await page.locator('.next-project').click();
   await page.waitForFunction(()=>document.documentElement.classList.contains('js'));
   assert.equal(await page.locator('html').getAttribute('lang'),other);
   await page.evaluate(()=>localStorage.clear());
  }
  await context.close();
  const noJs=await browser.newContext({javaScriptEnabled:false});const staticPage=await noJs.newPage();
  for(const path of [prefix,...data.profile.projects.map(r=>prefix+'projects/'+r.slug+'/')]) {
   assert.equal((await staticPage.goto(root+path)).status(),200);
   assert.equal(await staticPage.locator('html').getAttribute('lang'),lang);
   assert.ok((await staticPage.locator('main').innerText()).length>100);
  }
  await noJs.close();
 }
 results.checks.push('Homepage order, workspace hero, two CTAs, five real projects, category filters, featured functions, 13 technologies, four services and two historical employment records','Mobile menu selection and Escape','All ten case routes at eight widths, metadata, gallery, next-project and language persistence','All twelve pages work without JavaScript');
 const context=await browser.newContext();const page=await context.newPage();const requests=[];page.on('request',r=>requests.push(r.url()));
 await page.goto(root);await page.waitForTimeout(400);await page.locator('#contact').scrollIntoViewIfNeeded();
 assert.equal(requests.some(r=>/assets\/vendor|three|gsap|ScrollTrigger/.test(r)),false);
 assert.equal(await page.locator('canvas').count(),0);
 results.checks.push('Normal-motion homepage loads no animation vendors/canvas');
 // Crawl every local HTML link and asset, including hash compatibility, without PDF browser interception.
 const queue=['/','/ar/',...data.profile.projects.flatMap(r=>['/projects/'+r.slug+'/','/ar/projects/'+r.slug+'/'])];
 const checked=new Set();
 for(const path of queue) {
  await page.goto(root+path);await page.waitForFunction(()=>document.documentElement.classList.contains('js'));
  const links=await page.locator('a[href],img[src],script[src],link[href]').evaluateAll(es=>es.map(e=>e.href||e.src));
  for(const href of links) {
   const url=new URL(href);if(url.origin!==root)continue;
   if(url.hash&&url.pathname===path) assert.ok(await page.locator(`[id="${decodeURIComponent(url.hash.slice(1))}"]`).count(),`${path}: missing ${url.hash}`);
   url.hash='';url.search='';if(checked.has(url.href))continue;checked.add(url.href);
   const response=await context.request.get(url.href);assert.equal(response.status(),200,url.href);
  }
 }
 results.checks.push(`${checked.size} unique local destinations/resources return 200`);
 await context.close();
} finally {
 await fs.writeFile(`${dir}/checks.json`,JSON.stringify(results,null,2));await browser.close();
}
assert.ok(results.layouts.every(r=>r.width===r.scrollWidth&&r.overflow.length===0),'Homepage overflow');
assert.ok(results.pages.every(r=>r.width===r.scrollWidth&&r.images),'Case overflow or images');
assert.ok(results.axe.every(r=>r.violations.length===0),'Axe violations');
assert.deepEqual(results.errors,[]);assert.deepEqual(results.consoleErrors,[]);
console.log(`PASS ${results.layouts.length} homepage layouts, ${results.pages.length} project layouts, ${results.axe.length} axe audits. ${results.checks.join('; ')}.`);
