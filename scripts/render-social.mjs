// Render a sharing card with the site's real typography and original portrait.
import { pathToFileURL } from 'node:url';
import { resolve } from 'node:path';
const { chromium } = await import(pathToFileURL(resolve(process.env.QA_ROOT || '.qa-tools','node_modules/playwright/index.mjs')).href);
const base=process.env.TEST_URL || 'http://127.0.0.1:8017';
const browser=await chromium.launch({headless:true,executablePath:process.env.CHROME_PATH || 'C:/Program Files/Google/Chrome/Application/chrome.exe'});
try {
 const page=await browser.newPage({viewport:{width:1200,height:630},deviceScaleFactor:1});
 await page.goto(base);
 await page.setContent(`<!doctype html><html lang="en"><head><meta charset="utf-8"><style>
 @font-face{font-family:Inter;src:url('${base}/assets/fonts/inter-variable.woff2')}*{box-sizing:border-box}body{margin:0;background:radial-gradient(ellipse at 90% 30%,#153957,#080f18 70%);color:#f5f7fa;font-family:Inter,Arial,sans-serif;padding:50px 58px;width:1200px;height:630px}header{display:flex;justify-content:space-between;border-bottom:1px solid #243649;padding-bottom:24px;font-size:23px}header span{font-size:15px;color:#9dafc2}main{display:grid;grid-template-columns:650px 1fr;align-items:center;height:435px}h1{font-size:64px;font-weight:600;line-height:1.13;letter-spacing:-3px;margin:0 0 28px}p{font-size:20px;line-height:1.5;color:#9dafc2;max-width:540px}img{width:280px;height:350px;object-fit:cover;justify-self:end;border-radius:18px;border:1px solid #39536a}footer{font-size:14px;color:#00d9f5;border-top:1px solid #243649;padding-top:20px}
 </style></head><body><header>Ahmed Algohary<span>Full-Stack Software Developer</span></header><main><div><h1>Your ideas.<br><span style="color:#00d9f5">Thoughtful code.</span><br>Real impact.</h1><p>Websites, applications and systems for your business.</p></div><img src="${base}/assets/images/ahmed-portrait-480.webp" alt="Ahmed Algohary"></main><footer>ahmedalgohary.com</footer></body></html>`);
 await page.evaluate(()=>Promise.all([document.fonts.ready,...[...document.images].map(i=>i.decode())]));
 await page.screenshot({path:'assets/images/social-card.png'});
 console.log('Rendered 1200 × 630 sharing image.');
} finally { await browser.close(); }
