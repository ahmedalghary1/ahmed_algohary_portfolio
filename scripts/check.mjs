import assert from 'node:assert/strict';
import fs from 'node:fs/promises';
import path from 'node:path';
import { execFileSync } from 'node:child_process';
import { readPublicData } from './read-public-data.mjs';
const data = readPublicData();
const skills = JSON.parse(await fs.readFile('data/skills.json', 'utf8'));
const html = await fs.readFile('index.html', 'utf8');
function shape(value) {
  if (Array.isArray(value)) return value.map(shape);
  if (value && typeof value === 'object') return Object.fromEntries(Object.keys(value).sort().map(key => [key, shape(value[key])]));
  return typeof value;
}
assert.deepEqual(shape(data.en), shape(data.ar), 'Translation keys or list lengths differ');
const get = (lang, key) => key.split('.').reduce((value, part) => value?.[part], data[lang]);
for (const [, key] of html.matchAll(/data-copy(?:-(?:alt|aria-label|placeholder|content))?="([^"]+)"/g)) {
  for (const lang of ['en', 'ar']) assert.equal(typeof get(lang, key), 'string', `${lang}: missing ${key}`);
}
assert.equal(/\?{3,}/.test(JSON.stringify(data.ar)), false, 'Damaged Arabic encoding');
assert.equal(new Set(skills.skills.map(s => s.id)).size, skills.skills.length, 'Duplicate skill IDs');
const grouped = skills.categories.flatMap(c => c.skills);
assert.deepEqual([...grouped].sort(), skills.skills.map(s => s.id).sort(), 'Skills missing or duplicated in categories');
for (const skill of skills.skills) {
  assert.ok(skill.description.en && skill.description.ar);
  assert.ok(Array.isArray(skill.relatedProjects));
  if (skill.icon !== 'competency') await fs.access(`assets/icons/${skill.icon}.svg`);
}
for (const [, asset] of html.matchAll(/(?:src|href)="((?:assets|css|js)\/[^"?#]+)"/g)) await fs.access(asset.replaceAll('&amp;', '&'));
for (const project of data.profile.projects) {
  assert.match(project.slug, /^[a-z0-9]+(?:-[a-z0-9]+)*$/, 'Safe project slug');
  assert.ok(Array.isArray(project.technologies));
  assert.ok(Array.isArray(project.screenshots));
  assert.equal(project.private ? project.url === null : new URL(project.url).protocol === 'https:', true);
  await fs.access(project.preview);
  for (const image of Object.values(project.images)) await fs.access(image);
}
assert.equal(new Set(data.profile.projects.map(p=>p.slug)).size,data.profile.projects.length,'Unique routes');
const homepageSkills=skills.homepageGroups.flatMap(group=>group.skills);
assert.ok(homepageSkills.length>=8&&homepageSkills.length<=15,'Keep homepage tools focused');
assert.equal(new Set(homepageSkills).size,homepageSkills.length);
for(const id of homepageSkills) assert.ok(skills.skills.some(skill=>skill.id===id),`Unknown skill ${id}`);
for(const locale of ['en','ar']) for(const project of data.profile.projects) {
  const filename=`${locale==='ar'?'ar/':''}projects/${project.slug}/index.html`;
  const page=await fs.readFile(filename,'utf8');
  assert.equal((page.match(/<h1(?:\s|>)/g)||[]).length,1,filename);
  for(const [,key] of page.matchAll(/data-copy(?:-(?:alt|aria-label|placeholder|content))?="([^"]+)"/g)) {
    assert.equal(typeof get(locale,key),'string',`${filename}: missing ${key}`);
  }
}
for (const key of ['github','linkedin','leetcode']) if (data.profile[key]) assert.equal(new URL(data.profile[key]).protocol, 'https:');
assert.equal((await fs.readFile(data.profile.cv)).subarray(0, 5).toString(), '%PDF-');
async function syntax(directory) {
  for (const entry of await fs.readdir(directory, { withFileTypes: true })) {
    const file = path.join(directory, entry.name);
    if (entry.isDirectory()) await syntax(file);
    else if (/\.(m?js)$/.test(file)) execFileSync(process.execPath, ['--check', file], { stdio: 'pipe' });
  }
}
await syntax('js'); await syntax('scripts');
execFileSync('python', ['-c', "import ast,pathlib; [ast.parse(p.read_text(encoding='utf-8-sig'),filename=str(p)) for p in pathlib.Path('scripts').glob('*.py')]"], { stdio: 'pipe' });
console.log(`PASS: syntax, aligned locales, copy references, ${skills.skills.length} unique skills, project assets, public links and valid CV.`);
