import {chromium} from '../.qa-tools/node_modules/playwright/index.mjs';
import AxeBuilder from '../.qa-tools/node_modules/@axe-core/playwright/dist/index.mjs';
import fs from 'node:fs/promises';
import assert from 'node:assert/strict';
const data=JSON.parse(await fs.readFile('data/skills.json','utf8'));
const b=await chromium.launch({headless:true,executablePath:process.env.CHROME_PATH||'C:/Program Files/Google/Chrome/Application/chrome.exe'});
const results=[];await fs.mkdir('reports/skills',{recursive:true});
try{
for(const lang of ['en','ar'])for(const width of [320,390,768,1024,1440]){
 console.log(`Checking skills: ${lang} ${width}px`);
 const context=await b.newContext({viewport:{width,height:1000},reducedMotion:'reduce'});const p=await context.newPage();const errors=[];p.on('pageerror',e=>errors.push(e.message));p.on('console',m=>{if(m.type()==='error')errors.push(m.text());});
 await p.goto(`http://127.0.0.1:8017/?lang=${lang}`);await p.waitForSelector('html.js',{state:'attached'});await p.locator('#expertise').evaluate(e=>e.scrollIntoView({block:'start',behavior:'instant'}));await p.locator('#expertise img').evaluateAll(imgs=>{imgs.forEach(i=>i.loading='eager');return Promise.all(imgs.map(i=>i.decode()));});
 assert.equal(await p.locator('.skill-category').count(),6);assert.equal(await p.locator('.featured-technology').count(),12);assert.equal(await p.locator('.skill-token').count(),77);
 const ids=await p.locator('.skill-token').evaluateAll(nodes=>[...new Set(nodes.map(n=>n.dataset.skillId))].sort());assert.deepEqual(ids,data.skills.map(s=>s.id).sort());
 assert.equal(await p.evaluate(()=>document.documentElement.scrollWidth<=innerWidth),true);
 const audit=await new AxeBuilder({page:p}).include('#expertise').withTags(['wcag2a','wcag2aa','wcag21a','wcag21aa']).analyze();assert.deepEqual(audit.violations,[]);assert.deepEqual(errors,[]);
 if([390,1440].includes(width))await p.screenshot({path:`reports/skills/${lang}-${width}.png`});results.push({lang,width,categories:6,entries:77,unique:77,featured:12,overflow:false,axeViolations:0,errors});await context.close();
}
const p=await b.newPage({viewport:{width:1440,height:1000}});const errors=[];p.on('pageerror',e=>errors.push(e.message));await p.goto('http://127.0.0.1:8017/?lang=en');await p.waitForSelector('html[data-motion=on]');await p.locator('#expertise').evaluate(e=>e.scrollIntoView({block:'start',behavior:'instant'}));await p.locator('.skill-disclosure').last().evaluate(e=>e.open=true);await p.waitForTimeout(700);assert.equal(await p.locator('.skill-token').last().isVisible(),true);await p.locator('.header-controls [data-language]').click();assert.equal(await p.locator('.skill-category').count(),6);await p.emulateMedia({reducedMotion:'reduce'});await p.waitForTimeout(200);assert.equal(await p.locator('.featured-technology').first().isVisible(),true);assert.deepEqual(errors,[]);await p.close();
const staticPage=await b.newPage({javaScriptEnabled:false});await staticPage.goto('http://127.0.0.1:8017/');assert.equal(await staticPage.locator('.skill-token').count(),77);await staticPage.close();
await fs.writeFile('reports/skills/checks.json',JSON.stringify({results,normalMotion:true,noJavaScript:true},null,2));console.log('PASS: 10 bilingual layouts/axe audits; all 77 unique skills, six categories, 12 featured technologies; icons, motion, RTL and static HTML.');
}finally{await b.close();}
