import { MOTION, qualityTier } from './config.js';
import { frameScheduler, pixelRatio } from './performance-manager.js';
import { vertexShader, fragmentShader } from './shaders.js';

// Optional project image reveals only. The hero and contact have no 3D object.
export async function sceneManager(parentSignal) {
  if (qualityTier() !== 'desktop' || parentSignal.aborted) return;
  const targets = [...document.querySelectorAll('.project-visual img')];
  if (!targets.length) return;
  const nearWork = await new Promise(resolve => {
    const observer = new IntersectionObserver(entries => {
      if (entries.some(entry => entry.isIntersecting)) finish(true);
    }, { rootMargin: '200px' });
    const abort = () => finish(false);
    function finish(value) { observer.disconnect(); parentSignal.removeEventListener('abort', abort); resolve(value); }
    parentSignal.addEventListener('abort', abort, { once: true });
    targets.forEach(target => observer.observe(target));
  });
  if (!nearWork || qualityTier() !== 'desktop' || parentSignal.aborted) return;
  const T = await import('../../assets/vendor/three.module.min.js');
  if (parentSignal.aborted) return;
  const lifetime = new AbortController(), signal = lifetime.signal;
  const abort = () => lifetime.abort();
  parentSignal.addEventListener('abort', abort, { once: true });
  signal.addEventListener('abort', () => parentSignal.removeEventListener('abort', abort), { once: true });
  const canvas = document.createElement('canvas');
  const context = canvas.getContext('webgl2', { alpha: true, antialias: true, powerPreference: 'low-power' });
  if (!context) { lifetime.abort(); return; }
  let renderer;
  try { renderer = new T.WebGLRenderer({ canvas, context, alpha: true, antialias: true }); }
  catch { context.getExtension('WEBGL_lose_context')?.loseContext(); lifetime.abort(); return; }
  canvas.className = 'cinematic-canvas'; canvas.setAttribute('aria-hidden', 'true');
  canvas.dataset.renderer = 'project-images'; canvas.dataset.frames = '0';
  canvas.dataset.context = 'ready';
  document.body.append(canvas);
  const scene = new T.Scene(), camera = new T.OrthographicCamera(-1, 1, 1, -1, 0, 2);
  camera.position.z = 1;
  const plane = new T.PlaneGeometry(2, 2), loader = new T.TextureLoader(), images = [];
  let painted = false, lost = false, frames = 0;
  const scheduler = frameScheduler(time => {
    if (lost || (!images.length && !painted)) return false;
    renderer.info.autoReset = false; renderer.info.reset();
    renderer.setScissorTest(false); renderer.clear(); renderer.setScissorTest(true);
    let revealing = false;
    for (const image of images) {
      const progress = Math.min(1, (time-image.start)/(MOTION.shaderSeconds*1000));
      image.mesh.material.uniforms.progress.value = progress;
      if (progress >= 1) continue;
      const r = image.element.getBoundingClientRect();
      if (r.bottom < 0 || r.top > innerHeight || r.right < 0 || r.left > innerWidth) continue;
      scene.children.forEach(mesh => { mesh.visible = mesh === image.mesh; });
      renderer.setViewport(r.left, innerHeight-r.bottom, r.width, r.height);
      renderer.setScissor(Math.max(0,r.left),Math.max(0,innerHeight-r.bottom),Math.min(r.width,innerWidth-r.left),Math.min(r.height,innerHeight-r.top));
      renderer.clearDepth(); renderer.render(scene, camera); revealing = true;
    }
    painted = revealing;
    canvas.dataset.frames = String(++frames); canvas.dataset.drawCalls = String(renderer.info.render.calls);
    for (let i=images.length-1; i>=0; i--) {
      if (time-images[i].start < MOTION.shaderSeconds*1000) continue;
      const image=images[i];scene.remove(image.mesh);image.mesh.material.dispose();image.texture.dispose();images.splice(i,1);
    }
    return revealing;
  }, signal, abort);
  const observer = new IntersectionObserver(entries => entries.forEach(entry => {
    if (!entry.isIntersecting || signal.aborted) return;
    observer.unobserve(entry.target);
    const preview=entry.target.srcset.split(',').map(item=>item.trim().split(/\s+/)).find(item=>item[1]==='800w')?.[0];
    loader.load(preview||entry.target.currentSrc||entry.target.src, texture => {
      if (signal.aborted) { texture.dispose(); return; }
      texture.colorSpace=T.SRGBColorSpace;
      const material=new T.ShaderMaterial({vertexShader,fragmentShader,transparent:true,depthTest:false,uniforms:{image:{value:texture},progress:{value:0}}});
      const mesh=new T.Mesh(plane,material);scene.add(mesh);
      images.push({element:entry.target,mesh,texture,start:performance.now()});scheduler.invalidate();
    },undefined,()=>{});
  }), { threshold: .3 });
  const resize = () => { renderer.setPixelRatio(pixelRatio(qualityTier()));renderer.setSize(innerWidth,innerHeight,false);scheduler.invalidate(); };
  targets.forEach(target => observer.observe(target));
  window.addEventListener('resize',resize,{signal});
  window.addEventListener('scroll',scheduler.invalidate,{passive:true,signal});
  canvas.addEventListener('webglcontextlost',event=>{event.preventDefault();lost=true;canvas.dataset.context='lost';},{signal});
  canvas.addEventListener('webglcontextrestored',()=>{lost=false;canvas.dataset.context='ready';resize();},{signal});
  signal.addEventListener('abort',()=>{observer.disconnect();images.forEach(image=>{image.texture.dispose();image.mesh.material.dispose();});plane.dispose();renderer.dispose();renderer.forceContextLoss();canvas.remove();},{once:true});
  resize();
}
