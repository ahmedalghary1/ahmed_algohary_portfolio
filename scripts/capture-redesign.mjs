// Supplement the layout suite with tablet screenshots of the production output.
import { chromium } from '../.qa-tools/node_modules/playwright/index.mjs';
import fs from 'node:fs/promises';
const root=process.env.TEST_URL||'http://127.0.0.1:8018';
const dir='reports/redesign/screenshots';
await fs.mkdir(dir,{recursive:true});
const browser=await chromium.launch({channel:'chrome'});
try {
  for(const lang of ['en','ar']) {
    const page=await browser.newPage({viewport:{width:768,height:1024},reducedMotion:'reduce'});
    for(const route of ['', 'projects/garment-factory/']) {
      await page.goto(root+(lang==='ar'?'/ar/':'/')+route);
      await page.waitForFunction(()=>document.documentElement.classList.contains('js'));
      await page.evaluate(()=>document.fonts.ready);
      await page.locator('img').evaluateAll(images=>Promise.all(images.map(image=>{image.loading='eager';return image.decode().catch(()=>{});}))); 
      await page.screenshot({path:`${dir}/${route?'garment-factory':'home'}-${lang}-768.png`,fullPage:true});
    }
    await page.close();
  }
} finally { await browser.close(); }
console.log('Captured both localized homepages and factory cases at 768px.');
