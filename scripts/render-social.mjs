// Render a code-native sharing card with the site's real typography and sculpture.
import { pathToFileURL } from 'node:url';
import { resolve } from 'node:path';
const { chromium } = await import(pathToFileURL(resolve(process.env.QA_ROOT || '.qa-tools','node_modules/playwright/index.mjs')).href);
const base=process.env.TEST_URL || 'http://127.0.0.1:8017';
const browser=await chromium.launch({headless:true,executablePath:process.env.CHROME_PATH || 'C:/Program Files/Google/Chrome/Application/chrome.exe'});
try {
 const page=await browser.newPage({viewport:{width:1200,height:630},deviceScaleFactor:1});
 await page.goto(base);
 await page.setContent(`<!doctype html><html lang="en"><head><meta charset="utf-8"><style>
 @font-face{font-family:Space;src:url('${base}/assets/fonts/space-grotesk.woff2')}*{box-sizing:border-box}body{margin:0;background:#eae8e1;color:#171717;font-family:Space,Arial,sans-serif;padding:50px 58px;width:1200px;height:630px}header{display:flex;justify-content:space-between;border-bottom:1px solid #b9b9b0;padding-bottom:24px;font-size:23px}header span{font-size:13px;color:#57574f}main{display:grid;grid-template-columns:650px 1fr;align-items:center;height:435px}h1{font-size:76px;font-weight:500;line-height:1.05;letter-spacing:-5px;margin:0 0 28px}p{font-size:20px;line-height:1.5;color:#57574f;max-width:540px}img{width:400px;height:400px;object-fit:contain}footer{font-size:14px;color:#a62d20;border-top:1px solid #b9b9b0;padding-top:20px}
 </style></head><body><header>Ahmed Algohary<span>Full-Stack Python Developer</span></header><main><div><h1>Engineering<br>the digital.<br>With intention.</h1><p>Scalable backends. Intelligent applications.<br>Reliable business systems.</p></div><img src="${base}/assets/images/system-sculpture.svg" alt=""></main><footer>ahmedalgohary.com</footer></body></html>`);
 await page.evaluate(()=>Promise.all([document.fonts.ready,...[...document.images].map(i=>i.decode())]));
 await page.screenshot({path:'assets/images/social-card.png'});
 console.log('Rendered 1200 × 630 sharing image.');
} finally { await browser.close(); }
