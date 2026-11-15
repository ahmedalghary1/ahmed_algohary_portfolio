import { copyFile, mkdir } from 'node:fs/promises';
await mkdir('assets/vendor', { recursive: true });
for (const [source, target] of [
  ['three/build/three.module.min.js', 'three.module.min.js'],
  ['three/build/three.core.min.js', 'three.core.min.js'],
  ['gsap/dist/gsap.min.js', 'gsap.min.js'],
  ['gsap/dist/ScrollTrigger.min.js', 'ScrollTrigger.min.js'],
  ['three/LICENSE', 'THREE-LICENSE.txt'],
]) await copyFile(`node_modules/${source}`, `assets/vendor/${target}`);
console.log('Pinned runtime dependencies copied to assets/vendor.');
