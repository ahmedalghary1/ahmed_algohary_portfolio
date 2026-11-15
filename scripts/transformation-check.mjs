import assert from 'node:assert/strict';
import fs from 'node:fs/promises';
import { createHash } from 'node:crypto';
import { pathToFileURL } from 'node:url';
import { resolve } from 'node:path';
const { chromium } = await import(pathToFileURL(resolve(process.env.QA_ROOT || '.qa-tools', 'node_modules/playwright/index.mjs')).href);
const data = JSON.parse(await fs.readFile('data/portfolio.json', 'utf8'));
const url = process.env.TEST_URL || 'http://127.0.0.1:8017';
const dir = 'reports/transformation/after';
await fs.mkdir(dir, { recursive: true });
const browser = await chromium.launch({ headless: true, executablePath: process.env.CHROME_PATH || 'C:/Program Files/Google/Chrome/Application/chrome.exe' });
const results = [], errors = [], limitations = [];
async function test(name, run) {
  try { await run(); results.push({ name, passed: true }); console.log(`PASS ${name}`); }
  catch (error) { results.push({ name, passed: false, error: error.stack }); console.error(`FAIL ${name}: ${error.message}`); }
}
async function page(options = {}) {
  const p = await browser.newPage({ viewport: { width: 390, height: 844 }, reducedMotion: 'reduce', ...options });
  p.on('pageerror', error => errors.push(error.message));
  p.on('console', message => { if (message.type() === 'error') errors.push(message.text()); });
  return p;
}
const go = async (p, lang = 'en', hash = '') => { await p.goto(`${url}/?lang=${lang}${hash}`); await p.waitForSelector('html.js'); await p.evaluate(() => document.fonts.ready); };
try {
  for (const lang of ['en', 'ar']) {
    await test(`${lang}: menu focus, active sections and native keyboard skills`, async () => {
      const p = await page();
      try {
        await go(p, lang);
        await p.locator('.menu-toggle').focus(); await p.keyboard.press('Enter');
        assert.equal(await p.evaluate(() => document.activeElement.closest('#navigation')?.id), 'navigation');
        await p.keyboard.press('Escape');
        assert.equal(await p.locator('.menu-toggle').evaluate(e => e === document.activeElement), true);
        await p.locator('.menu-toggle').click(); await p.locator('#navigation a[href="#architecture"]').click();
        assert.equal(await p.evaluate(() => document.activeElement.id), 'architecture');
        await p.waitForFunction(() => document.querySelector('#navigation a[href="#architecture"]').getAttribute('aria-current') === 'location');
        assert.equal(await p.locator('.skill-category').count(), 6);
        for (const disclosure of await p.locator('.skill-disclosure').all()) {
          await disclosure.locator('summary').focus(); await p.keyboard.press('Enter');
          assert.equal(await disclosure.getAttribute('open'), '');
        }
        const ids = await p.locator('.skill-token').evaluateAll(nodes => nodes.map(n => n.dataset.skillId));
        assert.equal(ids.length, 77); assert.equal(new Set(ids).size, 77);
        assert.equal(await p.evaluate(() => document.documentElement.scrollWidth > innerWidth), false);
      } finally { await p.close(); }
    });
    await test(`${lang}: all five original case URLs expose ten documented sections`, async () => {
      const p = await page();
      try {
        for (const project of data.profile.projects) {
          await go(p, lang, `#case-${project.id}`);
          const study = p.locator(`#case-${project.id}`);
          await p.waitForFunction(id => document.getElementById(id).open, `case-${project.id}`);
          assert.equal(await study.locator('.case-part').count(), 10);
          assert.equal(await study.locator('.case-gallery img').getAttribute('src'), project.images.en);
          assert.equal(await study.locator('.case-permalink').getAttribute('href'), `#case-${project.id}`);
          await study.locator('summary').focus(); await p.keyboard.press('Enter');
          await p.waitForFunction(id => location.hash === `#project-${id}`, project.id);
        }
      } finally { await p.close(); }
    });
    await test(`${lang}: architecture links, responsibilities and coherent seven-edge flow`, async () => {
      const p = await page({ viewport: { width: 1440, height: 1000 } });
      try {
        await go(p, lang);
        await p.locator('.node-redis').click();
        assert.equal(await p.locator('#architecture-redis').getAttribute('open'), '');
        assert.equal(await p.locator('.node-redis').getAttribute('aria-current'), 'true');
        const edges = await p.locator('.architecture-link').evaluateAll(paths => paths.map(p => `${p.dataset.from}>${p.dataset.to}`).sort());
        assert.deepEqual(edges, ['frontend>application','application>auth','application>postgres','application>redis','redis>workers','workers>postgres','application>external'].sort());
        assert.equal(await p.locator('.architecture-map').innerText().then(t => /Docker|GitHub Actions/.test(t)), false);
        await p.locator('.node-workers').focus(); await p.keyboard.press('Enter');
        assert.equal(await p.locator('#architecture-workers').getAttribute('open'), '');
        await p.reload(); await p.waitForSelector('#architecture-workers[open]');
        await p.locator('#architecture').screenshot({ path: `${dir}/${lang}-architecture-1440.png`, style:'.site-header,.skip-link,.motion-switch{visibility:hidden!important}' });
      } finally { await p.close(); }
    });
    await test(`${lang}: confirmed contacts, exact CV file delivery and locale-preserved draft`, async () => {
      const p = await page();
      try {
        await go(p, lang);
        assert.equal(await p.locator('.contact-channel').getAttribute('href'), 'https://wa.me/201156972307');
        assert.equal(await p.locator('.contact-email').getAttribute('href'), 'mailto:ahmedalgohary1170@gmail.com');
        const social = await p.locator('#social-links a').evaluateAll(links => links.map(a => a.getAttribute('href')));
        assert.deepEqual(social, [data.profile.github,data.profile.linkedin,data.profile.leetcode,data.profile.cv]);
        const hash = bytes => createHash('sha256').update(bytes).digest('hex');
        const response = await p.request.get(new URL(data.profile.cv,url+'/').href);
        assert.equal(response.status(),200);
        assert.equal(hash(await response.body()),hash(await fs.readFile(data.profile.cv)));
        await p.locator('#contact-name').fill('QA Visitor'); await p.locator('#contact-message').fill('A useful business system.');
        await p.locator('.header-controls [data-language]').click();
        assert.equal(await p.locator('#contact-message').inputValue(), 'A useful business system.');
        assert.equal(await p.locator('meta[name="twitter:title"]').getAttribute('content'), await p.title());
        assert.equal(await p.locator('a[target="_blank"]').evaluateAll(links => links.every(a => /noopener/.test(a.rel))), true);
      } finally { await p.close(); }
    });
  }
  await test('Without JavaScript: all content, project studies, skill lists, contacts and CV remain available', async () => {
    const p = await page({ javaScriptEnabled: false, viewport: { width: 320, height: 740 } });
    try {
      await p.goto(url);
      assert.equal(await p.locator('.project').count(), 5);
      assert.equal(await p.locator('.skill-token').count(), 77);
      assert.equal(await p.locator('.architecture-explanation').count(), 7);
      assert.equal(await p.locator('.experience-entry[data-experience="employment"]').count(), 2);
      assert.equal(await p.locator('.experience-entry[data-experience="training"]').count(), 1);
      assert.equal(await p.locator('.process-list>li').count(), 6);
      assert.equal(await p.locator('#navigation a:visible').count(), 7);
      await p.locator('.skill-disclosure summary').first().click();
      assert.equal(await p.locator('.skill-disclosure').first().getAttribute('open'), '');
      assert.equal(await p.locator('canvas').count(), 0);
      assert.equal(await p.locator('.hero-actions a[download]').count(), 1);
      assert.equal(await p.evaluate(() => document.documentElement.scrollWidth > innerWidth), false);
    } finally { await p.close(); }
  });
  for (const lang of ['en','ar']) for (const width of [390,768,1440]) {
    await test(`${lang} ${width}px: normal motion, visible content and appropriate scene tier`, async () => {
      const p = await page({ viewport: { width, height: 1000 }, reducedMotion: 'no-preference' });
      try {
        await go(p,lang); await p.waitForSelector('html[data-motion="on"]');
        if (width > 600) await p.waitForSelector('.hero-scene[data-webgl="true"]');
        assert.equal(await p.locator('canvas').count(), width > 600 ? 1 : 0);
        await p.screenshot({ path: `${dir}/${lang}-${width}-normal-hero.png` });
        for (const id of ['work','architecture','about','experience','expertise','process','contact']) {
          await p.locator(`#${id}`).evaluate(e => e.scrollIntoView({ block:'start',behavior:'instant' }));
          await p.waitForTimeout(180);
          assert.equal(await p.evaluate(() => document.documentElement.scrollWidth > innerWidth), false);
          if (['work','contact'].includes(id)) await p.screenshot({ path: `${dir}/${lang}-${width}-normal-${id}.png` });
        }
      } finally { await p.close(); }
    });
  }
  await test('Reduced-motion startup skips GSAP and Three.js downloads', async () => {
    const p = await page(); const requests=[];
    p.on('request', request => { if (/assets\/vendor/.test(request.url())) requests.push(request.url()); });
    try { await go(p); await p.waitForTimeout(300); assert.deepEqual(requests,[]); assert.equal(await p.locator('canvas').count(),0); }
    finally { await p.close(); }
  });
  await test('Static Arabic route has native RTL content, metadata, hreflang and working assets without JavaScript', async () => {
    const p = await page({ javaScriptEnabled:false });
    try {
      await p.goto(`${url}/ar/`);
      assert.equal(await p.locator('html').getAttribute('lang'),'ar');
      assert.equal(await p.locator('html').getAttribute('dir'),'rtl');
      assert.match(await p.title(), /أحمد/);
      assert.match(await p.locator('h1').innerText(), /أهندس/);
      assert.equal(await p.locator('link[rel=canonical]').getAttribute('href'),'https://www.ahmedalgohary.com/ar/');
      assert.equal(await p.locator('link[hreflang=ar]').count(),1);
      assert.equal(await p.locator('.hero-scene img').evaluate(async e=>{await e.decode();return e.naturalWidth>0;}),true);
      await p.locator('#navigation a[href="/ar/#work"]').click();
      assert.equal(new URL(p.url()).pathname,'/ar/');
      assert.equal(await p.locator('html').getAttribute('lang'),'ar');
      assert.equal(await p.evaluate(()=>document.documentElement.scrollWidth>innerWidth),false);
      await p.screenshot({path:`${dir}/ar-static-no-js-390.png`});
    } finally { await p.close(); }
  });
  await test('Arabic entry preserves in-place English selection, native anchors and CV link resolution', async () => {
    const p = await page();
    try {
      await p.goto(`${url}/ar/`);await p.waitForSelector('html.js');
      await p.locator('.header-controls [data-language]').click();
      assert.equal(await p.locator('html').getAttribute('lang'),'en');
      await p.locator('.menu-toggle').click();await p.locator('#navigation a[href$="#contact"]').click();
      assert.equal(new URL(p.url()).searchParams.get('lang'),'en');
      assert.equal(await p.locator('html').getAttribute('lang'),'en');
      assert.equal(await p.locator('#social-links a[download]').evaluate(a=>a.pathname),'/assets/documents/ahmed-algohary-cv.pdf');
    } finally { await p.close(); }
  });
  await test('Normal-motion mobile skips GSAP and Three.js downloads', async () => {
    const p=await page({reducedMotion:'no-preference'});const requests=[];
    p.on('request',request=>{if(/assets\/vendor/.test(request.url()))requests.push(request.url());});
    try {await go(p);await p.waitForSelector('html[data-motion=on]');assert.deepEqual(requests,[]);assert.equal(await p.locator('canvas').count(),0);}
    finally {await p.close();}
  });
  await test('Native CV download verification records managed-browser interception explicitly', async () => {
    const p=await browser.newPage({reducedMotion:'reduce'});
    try {
      await go(p);
      const probe=await p.evaluate(async path=>{const r=await fetch(path);return {status:r.status,bytes:(await r.blob()).size};},data.profile.cv);
      const [download]=await Promise.all([p.waitForEvent('download'),p.locator('.hero-actions a[download]').click()]);
      const failure=await download.failure();
      if(probe.status===204 && probe.bytes===0 && failure==='canceled') {
        limitations.push({check:'Native PDF download',status:'verification blocked',reason:'Managed Chrome intercepts PDF requests with HTTP 204 and cancels downloads. Direct HTTP requests return the complete, hash-verified source PDF.',probe,downloadFailure:failure});
      } else {
        assert.equal(failure,null);
        await download.saveAs('.qa-tools/verified-cv-download.pdf');
        assert.deepEqual(await fs.readFile('.qa-tools/verified-cv-download.pdf'),await fs.readFile(data.profile.cv));
      }
    } finally {await p.close();}
  });
  await test('Structured data, canonical, sharing image, robots and sitemap resolve', async () => {
    const p = await page();
    try {
      await go(p);
      assert.equal(await p.locator('link[rel=canonical]').getAttribute('href'),'https://www.ahmedalgohary.com/');
      const graph = JSON.parse(await p.locator('script[type="application/ld+json"]').textContent())['@graph'];
      assert.deepEqual(graph.map(n=>n['@type']),['Person','WebSite','ProfilePage',...Array(5).fill('CreativeWork')]);
      for (const route of ['/assets/images/social-card.png','/robots.txt','/sitemap.xml']) assert.equal((await p.request.get(url+route)).ok(),true,route);
    } finally { await p.close(); }
  });
  assert.deepEqual(errors,[],'Unexpected browser console/page errors');
} finally {
  await fs.writeFile(`${dir}/functional-checks.json`,JSON.stringify({results,errors,limitations},null,2));
  await browser.close();
}
assert.ok(results.every(r=>r.passed), 'One or more functional checks failed');
console.log(`PASS ${results.length} functional groups; no unexpected browser errors.`);
