// Reproducible rendered evidence and targeted regression probes; no runtime dependency.
import fs from 'node:fs/promises';
import {pathToFileURL} from 'node:url';
import {resolve} from 'node:path';
const {chromium}=await import(pathToFileURL(resolve(process.env.QA_ROOT||'.qa-tools','node_modules/playwright/index.mjs')).href);
const phase=process.env.PHASE||'after';
const dir=`reports/refinement/${phase}`;
await fs.mkdir(dir,{recursive:true});
const browser=await chromium.launch({headless:true,executablePath:process.env.CHROME_PATH});
const result={browser:browser.version(),date:new Date().toISOString(),phase,layouts:[],interaction:[],rendering:[]};
const url=process.env.TEST_URL||'http://127.0.0.1:8017';
for(const lang of ['en','ar']){
 for(const [width,height] of [[390,844],[768,1024],[1440,1000],[2560,1440]]){
  const context=await browser.newContext({viewport:{width,height}});
  const page=await context.newPage();
  await page.addInitScript(()=>{
   window.__draws=0;
   for(const method of ['drawArrays','drawElements']){
    const original=WebGL2RenderingContext.prototype[method];
    WebGL2RenderingContext.prototype[method]=function(...args){window.__draws++;return original.apply(this,args)};
   }
  });
  await page.goto(`${url}/?lang=${lang}`);await page.waitForSelector('html.js');await page.evaluate(()=>document.fonts.ready);await page.waitForTimeout(900);
  // Freeze demand-rendered art by keeping pointer outside the viewport throughout capture.
  await page.screenshot({path:`${dir}/${lang}-${width}-hero.png`});
  for(const id of ['work','about','expertise','process','contact']){
   await page.locator(`#${id}`).evaluate(e=>e.scrollIntoView({behavior:'instant',block:'start'}));await page.waitForTimeout(750);
   await page.screenshot({path:`${dir}/${lang}-${width}-${id}.png`});
  }
  await page.locator('img').evaluateAll(imgs=>Promise.all(imgs.map(i=>i.decode().catch(()=>{}))));
  await page.evaluate(()=>scrollTo({top:0,behavior:'instant'}));await page.waitForTimeout(700);
  await page.screenshot({path:`${dir}/${lang}-${width}-full.png`,fullPage:true});
  result.layouts.push({lang,width,height,...await page.evaluate(()=>({scrollWidth:document.documentElement.scrollWidth,bodyHeight:document.body.scrollHeight,projectImageWidth:document.querySelector('.project-visual img').getBoundingClientRect().width,headerHeight:document.querySelector('header').getBoundingClientRect().height}))});
  if(width===390){
   await page.locator('.menu-toggle').click();await page.locator('#navigation a[href="#work"]').focus();await page.keyboard.press('Enter');
   result.interaction.push({lang,probe:'menu destination focus',focused:await page.evaluate(()=>document.activeElement.id||document.activeElement.outerHTML.slice(0,100))});
   await page.goto(`${url}/?lang=${lang}#case-ahmed-gamal`);await page.waitForSelector('html.js');
   result.interaction.push({lang,probe:'case deep link',open:await page.locator('details').first().evaluate(e=>e.open)});
   await page.locator('summary').first().click();await page.locator('.header-controls [data-language]').click();
   result.interaction.push({lang,probe:'language switch keeps trigger visible',...await page.locator('.header-controls [data-language]').evaluate(e=>({top:e.getBoundingClientRect().top,focused:e===document.activeElement}))});
  }
  if(width===1440){
   await page.evaluate(()=>scrollTo({top:0,behavior:'instant'}));await page.waitForTimeout(700);
   const start=await page.evaluate(()=>window.__draws);await page.waitForTimeout(1000);
   const idle=await page.evaluate(()=>window.__draws);
   await page.mouse.move(900,400);await page.waitForTimeout(700);
   const moved=await page.evaluate(()=>window.__draws);
   const cdp=await context.newCDPSession(page);await cdp.send('Emulation.setCPUThrottlingRate',{rate:4});
   const scroll=await page.evaluate(async()=>{
    const deltas=[];let last=performance.now(),start=last;
    await new Promise(done=>{function tick(t){deltas.push(t-last);last=t;scrollTo({top:(t-start)*1.5,behavior:'instant'});if(t-start<2400)requestAnimationFrame(tick);else done()}requestAnimationFrame(tick)});
    const sorted=deltas.slice(1).sort((a,b)=>a-b);
    return {frames:sorted.length,p95FrameMs:sorted[Math.floor(sorted.length*.95)],over50ms:sorted.filter(x=>x>50).length};
   });
   await cdp.send('Emulation.setCPUThrottlingRate',{rate:1});await page.waitForTimeout(700);
   const off=await page.evaluate(()=>window.__draws);await page.mouse.move(100,500);await page.waitForTimeout(500);
   result.rendering.push({lang,idleDrawCalls:idle-start,pointerDrawCalls:moved-idle,offscreenDrawCalls:await page.evaluate(()=>window.__draws)-off,scroll4xCPU:scroll,canvas:await page.locator('canvas').evaluateAll(c=>c.map(e=>({width:e.width,height:e.height})))});
  }
  await context.close();
 }
}
await browser.close();await fs.writeFile(`${dir}/review.json`,JSON.stringify(result,null,2));console.log(JSON.stringify(result,null,2));
