import {chromium} from '../.qa-tools/node_modules/playwright/index.mjs';
import assert from 'node:assert/strict';
import fs from 'node:fs/promises';
const browser=await chromium.launch({headless:true,executablePath:process.env.CHROME_PATH||'C:/Program Files/Google/Chrome/Application/chrome.exe'});
const results=[],errors=[];
const url=process.env.TEST_URL||'http://127.0.0.1:8017';
async function open(lang='en',options={}) {
 const p=await browser.newPage({viewport:{width:1440,height:1000},...options});
 p.on('pageerror',e=>errors.push(e.message));
 await p.goto(`${url}/?lang=${lang}`);await p.waitForSelector('html[data-motion=on]');return p;
}
async function projectRenderer(p) {
 await p.locator('#work').evaluate(e=>e.scrollIntoView({block:'start',behavior:'instant'}));
 await p.waitForSelector('canvas[data-renderer="project-images"]');
}
try {
 for(const lang of ['en','ar']) {
  const p=await open(lang);
  assert.equal(await p.locator('.hero-portrait').isVisible(),true);
  assert.equal(await p.locator('.hero-scene,.scene-slot').count(),0);
  assert.equal(await p.locator('canvas').count(),0);
  assert.equal(await p.locator('.pin-spacer').count(),0);
  await projectRenderer(p);assert.equal(await p.locator('canvas').count(),1);
  for(const index of [0,2,4,1,0]) {
   await p.locator('.project').nth(index).evaluate(e=>e.scrollIntoView({block:'start',behavior:'instant'}));
   await p.waitForTimeout(180);
   assert.equal(await p.evaluate(()=>document.documentElement.scrollWidth>innerWidth),false);
  }
  await p.locator('#work').evaluate(e=>e.scrollIntoView({block:'start',behavior:'instant'}));
  await p.locator('[data-project-next]').click();
  await p.waitForFunction(()=>{const r=document.querySelector('#project-rocks-ev').getBoundingClientRect();return r.top>100&&r.top<450;});
  await p.locator('.project-visit').last().focus();
  assert.equal(await p.locator('.project-visit').last().evaluate(e=>{const r=e.getBoundingClientRect();return r.left>=0&&r.right<=innerWidth;}),true);
  await p.locator('#case-ahmed-nabil summary').click();
  assert.equal(await p.locator('#case-ahmed-nabil .case-part').count(),10);
  await p.locator('[data-motion-switch]').click();
  await p.waitForFunction(()=>document.querySelectorAll('canvas').length===0);
  assert.equal(await p.evaluate(()=>ScrollTrigger.getAll().length),0);
  await p.locator('[data-motion-switch]').click();await projectRenderer(p);
  await p.setViewportSize({width:390,height:844});await p.waitForFunction(()=>document.querySelectorAll('canvas').length===0);
  await p.setViewportSize({width:1440,height:1000});await projectRenderer(p);
  await p.emulateMedia({reducedMotion:'reduce'});await p.waitForFunction(()=>document.querySelectorAll('canvas').length===0);
  assert.equal(await p.evaluate(()=>ScrollTrigger.getAll().length),0);
  results.push(`${lang}: portrait-only hero, lazy image renderer, reverse scroll, keyboard links, studies, pause/resume, resize and reduced motion passed`);
  await p.close();
 }
 const fallback=await browser.newPage({viewport:{width:1440,height:1000}});
 await fallback.addInitScript(()=>{const original=HTMLCanvasElement.prototype.getContext;HTMLCanvasElement.prototype.getContext=function(type,...args){return type==='webgl2'?null:original.call(this,type,...args);};});
 await fallback.goto(url);await fallback.waitForSelector('html[data-motion=on]');
 await fallback.locator('#work').evaluate(e=>e.scrollIntoView({block:'start',behavior:'instant'}));await fallback.waitForTimeout(400);
 assert.equal(await fallback.locator('canvas').count(),0);assert.equal(await fallback.locator('.hero-portrait').isVisible(),true);
 await fallback.close();results.push('WebGL unavailable: original portrait and real project screenshots remain usable');
 const p=await open();await projectRenderer(p);await p.waitForTimeout(1300);
 const before=await p.locator('canvas').getAttribute('data-frames');await p.waitForTimeout(400);
 assert.equal(await p.locator('canvas').getAttribute('data-frames'),before);results.push('Renderer stops after its short image reveal; no ambient loop');
 await p.evaluate(()=>{window.loss=document.querySelector('canvas').getContext('webgl2').getExtension('WEBGL_lose_context');window.loss.loseContext();});
 await p.waitForSelector('canvas[data-context=lost]');assert.equal(await p.locator('.project-visual img').first().isVisible(),true);
 await p.evaluate(()=>window.loss.restoreContext());await p.waitForSelector('canvas[data-context=ready]');
 assert.equal(await p.locator('canvas').count(),1);results.push('Context loss preserves actual HTML images; restoration retains one renderer');
 const performance=await p.evaluate(async()=>{
  const deltas=[];let start=window.performance.now(),last=start,maxCalls=0;const origin=scrollY;
  await new Promise(done=>{function tick(time){deltas.push(time-last);last=time;scrollTo({top:origin+(time-start)*.65,behavior:'instant'});maxCalls=Math.max(maxCalls,Number(document.querySelector('canvas').dataset.drawCalls||0));if(time-start<1600)requestAnimationFrame(tick);else done();}requestAnimationFrame(tick);});
  const sorted=deltas.slice(1).sort((a,b)=>a-b),c=document.querySelector('canvas');
  return {viewport:[innerWidth,innerHeight],buffer:[c.width,c.height],sampleFrames:sorted.length,medianFrameMs:sorted[Math.floor(sorted.length*.5)],p95FrameMs:sorted[Math.floor(sorted.length*.95)],maxObservedDrawCalls:maxCalls};
 });
 await p.evaluate(()=>window.dispatchEvent(new PageTransitionEvent('pagehide',{persisted:true})));assert.equal(await p.locator('canvas').count(),1);
 await p.evaluate(()=>window.dispatchEvent(new PageTransitionEvent('pagehide',{persisted:false})));assert.equal(await p.locator('canvas').count(),0);assert.equal(await p.evaluate(()=>ScrollTrigger.getAll().length),0);
 await p.close();results.push('BFCache retention and full-navigation disposal passed');assert.deepEqual(errors,[]);
 await fs.mkdir('reports/transformation/after',{recursive:true});
 await fs.writeFile('reports/transformation/after/motion-checks.json',JSON.stringify({results,errors,performance,browser:await browser.version()},null,2));
 console.log(results.join('\n'));console.log(JSON.stringify(performance));
} finally {await browser.close();}
