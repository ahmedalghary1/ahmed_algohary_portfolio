import { pathToFileURL } from 'node:url';
import { resolve } from 'node:path';
const qaRoot=process.env.QA_ROOT || '.qa-tools';
const {default:lighthouse}=await import(pathToFileURL(resolve(qaRoot,'node_modules/lighthouse/core/index.js')).href);
const {chromium}=await import(pathToFileURL(resolve(qaRoot,'node_modules/playwright/index.mjs')).href);
import fs from 'node:fs/promises';
const reportDir=process.env.REPORT_DIR || 'reports';
const runs=Number(process.env.RUNS || 1);
await fs.mkdir(reportDir,{recursive:true});
const port=Number(process.env.LIGHTHOUSE_PORT || 9223);
const chrome=await chromium.launch({headless:true,...(process.env.CHROME_PATH ? {executablePath:process.env.CHROME_PATH} : {channel:'chrome'}),args:[`--remote-debugging-port=${port}`]});
try{
 for(let run=1;run<=runs;run++){
 for(const lang of ['en','ar']){
  const result=await lighthouse(`${process.env.TEST_URL || 'http://127.0.0.1:8017'}/?lang=${lang}`,{port,output:['json','html'],logLevel:'error',onlyCategories:['performance','accessibility','best-practices','seo']});
  const suffix=runs>1 ? `-run${run}` : '';
  await fs.writeFile(`${reportDir}/lighthouse-${lang}${suffix}.json`,result.report[0]);await fs.writeFile(`${reportDir}/lighthouse-${lang}${suffix}.html`,result.report[1]);
  const a=result.lhr.audits;
  console.log(JSON.stringify({language:lang,scores:Object.fromEntries(Object.entries(result.lhr.categories).map(([k,v])=>[k,v.score*100])),metrics:Object.fromEntries(['first-contentful-paint','largest-contentful-paint','total-blocking-time','cumulative-layout-shift','speed-index','total-byte-weight'].map(k=>[k,a[k]?.displayValue])),failed:Object.entries(a).filter(([,v])=>v.score!==null&&v.score<.9&&v.details?.type!=='opportunity').map(([k,v])=>({id:k,title:v.title,display:v.displayValue}))},null,2));
 }
 }
}finally{await chrome.close();}
