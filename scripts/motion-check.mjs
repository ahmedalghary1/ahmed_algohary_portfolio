import {chromium} from '../.qa-tools/node_modules/playwright/index.mjs';
import assert from 'node:assert/strict';
import fs from 'node:fs/promises';
const browser=await chromium.launch({headless:true,executablePath:process.env.CHROME_PATH||'C:/Program Files/Google/Chrome/Application/chrome.exe'});
const results=[];const errors=[];
const open=async(lang='en',options={})=>{const p=await browser.newPage({viewport:{width:1440,height:1000},...options});p.on('pageerror',e=>errors.push(e.message));await p.goto(`http://127.0.0.1:8017/?lang=${lang}`);await p.waitForSelector('html[data-motion]');return p;};
try{
 for(const lang of ['en','ar']){
  const p=await open(lang);await p.waitForSelector('.hero-scene[data-webgl=true]');
  assert.equal(await p.locator('canvas').count(),1);
  assert.equal(await p.locator('#work').evaluate(e=>e.classList.contains('is-horizontal')),true);
  for(const progress of [0,.7,1,.2,1]){await p.evaluate(progress=>{const s=ScrollTrigger.getById('project-showcase');scrollTo({top:s.start+(s.end-s.start)*progress,behavior:'instant'});},progress);await p.waitForTimeout(650);}
  assert.match(await p.locator('[data-project-counter]').innerText(),/05/);
  await p.locator('[data-project-previous]').click();await p.waitForTimeout(650);
  assert.match(await p.locator('[data-project-counter]').innerText(),/04/);
  await p.locator('.project-visit').last().focus();await p.waitForTimeout(650);
  assert.equal(await p.locator('.project-visit').last().evaluate(e=>{const r=e.getBoundingClientRect();return r.left>=0&&r.right<=innerWidth;}),true);
  await p.locator('summary').last().click();await p.waitForTimeout(200);
  assert.equal(await p.locator('#work').evaluate(e=>e.classList.contains('is-horizontal')),false);
  await p.locator('[data-motion-switch]').click();assert.equal(await p.locator('canvas').count(),0);
  await p.locator('[data-motion-switch]').click();await p.waitForSelector('canvas');
  await p.setViewportSize({width:390,height:844});await p.waitForTimeout(300);assert.equal(await p.locator('canvas').count(),0);
  await p.setViewportSize({width:1440,height:1000});await p.waitForSelector('canvas');
  await p.emulateMedia({reducedMotion:'reduce'});await p.waitForTimeout(200);assert.equal(await p.locator('canvas').count(),0);
  assert.equal(await p.evaluate(()=>document.documentElement.scrollWidth<=innerWidth),true);
  results.push(`${lang}: reverse/fast scroll, project controls, keyboard focus, details, pause/resume, resize and live reduced motion passed`);await p.close();
 }
 const fallback=await browser.newPage({viewport:{width:1440,height:1000}});await fallback.addInitScript(()=>{const original=HTMLCanvasElement.prototype.getContext;HTMLCanvasElement.prototype.getContext=function(type,...a){return type==='webgl2'?null:original.call(this,type,...a);};});await fallback.goto('http://127.0.0.1:8017/');await fallback.waitForTimeout(1000);assert.equal(await fallback.locator('canvas').count(),0);assert.equal(await fallback.locator('.hero-portrait').isVisible(),true);await fallback.close();results.push('WebGL unavailable: portrait and native HTML fallback remain usable');
 const p=await open();await p.waitForSelector('canvas');await p.waitForTimeout(6500);
 const frames=await p.locator('canvas').getAttribute('data-frames');await p.waitForTimeout(400);assert.equal(await p.locator('canvas').getAttribute('data-frames'),frames);results.push('WebGL rendering stops after the finite idle introduction');
 await p.evaluate(()=>{const c=document.querySelector('canvas');window.loss=c.getContext('webgl2').getExtension('WEBGL_lose_context');window.loss.loseContext();});await p.waitForTimeout(200);assert.equal(await p.locator('.hero-scene').getAttribute('data-webgl'),null);
 await p.evaluate(()=>window.loss.restoreContext());await p.waitForTimeout(500);assert.equal(await p.locator('canvas').count(),1);results.push('WebGL context loss uses fallback; restoration retains a single renderer');
 await p.evaluate(()=>window.dispatchEvent(new PageTransitionEvent('pagehide',{persisted:false})));assert.equal(await p.locator('canvas').count(),0);assert.equal(await p.evaluate(()=>ScrollTrigger.getAll().length),0);await p.close();results.push('Lifecycle cleanup removes canvas and ScrollTriggers');
 assert.deepEqual(errors,[]);
 await fs.writeFile('reports/motion/after/interactions.json',JSON.stringify({results,errors},null,2));console.log(results.join('\n'));
}finally{await browser.close();}
