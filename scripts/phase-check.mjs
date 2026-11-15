// Browser evidence for each implementation checkpoint. QA dependencies are not shipped.
import assert from 'node:assert/strict';
import fs from 'node:fs/promises';
import { pathToFileURL } from 'node:url';
import { resolve } from 'node:path';
const { chromium } = await import(pathToFileURL(resolve(process.env.QA_ROOT || '.qa-tools', 'node_modules/playwright/index.mjs')).href);
const phase = process.argv[2] || 'final';
const dir = `reports/transformation/phases/${phase}`;
await fs.mkdir(dir, { recursive: true });
const browser = await chromium.launch({ headless: true, executablePath: process.env.CHROME_PATH || 'C:/Program Files/Google/Chrome/Application/chrome.exe' });
const results = [];
try {
  for (const lang of ['en', 'ar']) for (const width of [390, 1440]) {
    const page = await browser.newPage({ viewport: { width, height: 1000 }, reducedMotion: 'reduce' });
    const errors = [];
    page.on('pageerror', e => errors.push(e.message));
    page.on('console', m => { if (m.type() === 'error') errors.push(m.text()); });
    await page.goto(`${process.env.TEST_URL || 'http://127.0.0.1:8017'}/?lang=${lang}`);
    await page.waitForSelector('html.js');
    await page.evaluate(() => document.fonts.ready);
    assert.equal(await page.locator('html').getAttribute('dir'), lang === 'ar' ? 'rtl' : 'ltr');
    assert.equal(await page.locator('.project').count(), 5);
    assert.equal(await page.locator('.contact-channel').count(), 1);
    if (width === 390) {
      await page.locator('.menu-toggle').click();
      await page.locator('#navigation a[href="#work"]').click();
      assert.equal(await page.locator('.menu-toggle').getAttribute('aria-expanded'), 'false');
    }
    const study = page.locator('details[id^="case-"]').first();
    await study.locator('summary').focus();
    await page.keyboard.press('Enter');
    assert.equal(await study.getAttribute('open'), '');
    if (Number.parseInt(phase) >= 4 || phase === 'final') {
      assert.equal(await study.locator('.case-part h4').count(), 10);
      assert.deepEqual(await page.locator('.project').evaluateAll(cards => cards.map(c => c.id)), ['project-garment-factory','project-rocks-ev','project-bonyan','project-ahmed-gamal','project-ahmed-nabil']);
      assert.equal(await page.locator('.project-visit').count(), 4);
      assert.equal(await page.locator('#project-garment-factory .project-visit').count(), 0);
    }
    const metrics = await page.evaluate(() => ({
      overflow: document.documentElement.scrollWidth > innerWidth,
      missingCopy: [...document.querySelectorAll('[data-copy]')].filter(e => !e.textContent.trim()).map(e => e.dataset.copy),
      deadAnchors: [...document.querySelectorAll('a[href^="#"]')].map(a => a.hash).filter(h => h && !document.getElementById(h.slice(1)))
    }));
    assert.equal(metrics.overflow, false, `${lang} ${width}: overflow`);
    assert.deepEqual(metrics.missingCopy, []);
    assert.deepEqual(metrics.deadAnchors, []);
    assert.deepEqual(errors, []);
    await page.evaluate(() => scrollTo({ top: 0, behavior: 'instant' }));
    await page.screenshot({ path: `${dir}/${lang}-${width}.png` });
    results.push({ lang, width, ...metrics, errors, menuAndStudyKeyboard: true });
    await page.close();
  }
  if (Number.parseInt(phase) >= 5 || phase === 'final') {
    const page = await browser.newPage({ viewport: { width: 1440, height: 1000 } });
    const errors = [];
    page.on('pageerror', e => errors.push(e.message));
    page.on('console', m => { if (m.type() === 'error') errors.push(m.text()); });
    await page.goto(`${process.env.TEST_URL || 'http://127.0.0.1:8017'}/?lang=en`);
    await page.waitForSelector('.hero-scene[data-webgl="true"]');
    assert.equal(await page.locator('canvas').count(), 1);
    await page.screenshot({ path: `${dir}/en-1440-webgl.png` });
    assert.deepEqual(errors, []);
    results.push({ normalMotion: true, sharedCanvas: 1, errors });
    await page.close();
  }
  await fs.writeFile(`${dir}/checks.json`, JSON.stringify({ phase, results }, null, 2));
  console.log(`PASS ${phase}: desktop/mobile, English/Arabic, console, overflow, navigation and keyboard case study.`);
} finally { await browser.close(); }
