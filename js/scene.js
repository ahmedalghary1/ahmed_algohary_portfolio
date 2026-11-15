export async function initScene(content, signal) {
  const host = document.querySelector('#sculpture');
  const button = document.querySelector('.scene-toggle');
  const reduced = matchMedia('(prefers-reduced-motion: reduce)');
  const lowCapability = (navigator.deviceMemory && navigator.deviceMemory < 4) || (navigator.hardwareConcurrency && navigator.hardwareConcurrency < 4) || navigator.connection?.saveData;
  if (reduced.matches || lowCapability || signal.aborted) return;
  let renderer;
  const canvas = document.createElement('canvas');
  const context = canvas.getContext('webgl2', { alpha: true, antialias: true, powerPreference: 'low-power' });
  if (!context) return;
  const THREE = await import('../assets/vendor/three.module.min.js');
  if (signal.aborted || reduced.matches) return;
  try { renderer = new THREE.WebGLRenderer({ canvas, context, alpha: true, antialias: true }); }
  catch { return; }
  const scene = new THREE.Scene();
  const camera = new THREE.PerspectiveCamera(34, 1, .1, 50);
  const sculpture = new THREE.Group();
  const material = new THREE.LineBasicMaterial({ color: 0xc43c28, transparent: true, opacity: .85 });
  const points = [];
  const axis = new THREE.Vector3(0, 1, 0);
  // Preserve the 23 square frames, batching their edges into a single draw call.
  for (let i = 0; i < 23; i++) {
    const corners = [
      new THREE.Vector3(-1.25,0,-1.25), new THREE.Vector3(1.25,0,-1.25),
      new THREE.Vector3(1.25,0,1.25), new THREE.Vector3(-1.25,0,1.25),
    ].map(point => {
      point.applyAxisAngle(axis, i * .043);
      point.y = (i - 11) * .125;
      return point;
    });
    for (let edge = 0; edge < 4; edge++) points.push(corners[edge], corners[(edge + 1) % 4]);
  }
  const geometry = new THREE.BufferGeometry().setFromPoints(points);
  sculpture.add(new THREE.LineSegments(geometry, material));
  sculpture.rotation.set(.16, .63, -.12);
  scene.add(sculpture);
  camera.position.set(0, 2.9, 7.8);
  camera.lookAt(0, 0, 0);
  renderer.setClearColor(0xeae8e1, 0);
  renderer.domElement.setAttribute('aria-hidden', 'true');
  host.append(renderer.domElement);
  let active = true, visible = true, lost = false, frameId = 0, disposed = false;
  let pointerX = 0, pointerY = 0, scrollProgress = 0;
  const finePointer = matchMedia('(hover: hover) and (pointer: fine)');
  function draw() {
    frameId = 0;
    if (disposed || lost || !active || !visible || document.hidden || reduced.matches) return;
    const targetY = .63 + pointerX * .12 + scrollProgress * .18;
    const targetX = .16 + pointerY * .06;
    sculpture.rotation.y += (targetY - sculpture.rotation.y) * .14;
    sculpture.rotation.x += (targetX - sculpture.rotation.x) * .14;
    renderer.render(scene, camera);
    host.dataset.rendered = 'true';
    // Demand rendering stops once input interpolation settles. No perpetual RAF loop.
    if (Math.abs(targetY - sculpture.rotation.y) + Math.abs(targetX - sculpture.rotation.x) > .001) invalidate();
  }
  function invalidate() { if (!frameId && !disposed) frameId = requestAnimationFrame(draw); }
  function resize() {
    const { width, height } = host.getBoundingClientRect();
    if (!width || !height) return;
    renderer.setPixelRatio(Math.min(devicePixelRatio, width < 500 ? 1.25 : 1.5, 1400 / Math.max(width, height)));
    renderer.setSize(width, height, false);
    camera.aspect = width / height;
    camera.position.z = camera.aspect > 1.4 ? 7.1 : 8.6;
    camera.updateProjectionMatrix();
    invalidate();
  }
  function setLabel() {
    const lang = document.documentElement.lang;
    const key = active ? 'pause' : 'resume';
    button.querySelector('[data-copy]').dataset.copy = `scene.${key}`;
    button.querySelector('[data-copy]').textContent = content[lang].scene[key];
  }
  button.hidden = false;
  button.addEventListener('click', () => {
    active = !active;
    button.setAttribute('aria-pressed', String(!active));
    setLabel();
    if (active) invalidate();
  }, { signal });
  document.addEventListener('portfolio:language', () => { setLabel(); resize(); }, { signal });
  document.addEventListener('visibilitychange', invalidate, { signal });
  // CSS switches to the SVG immediately on preference changes; draw() independently
  // checks the current query, so a stale/delayed media event can never render motion.
  reduced.addEventListener('change', invalidate, { signal });
  window.addEventListener('pointermove', event => {
    if (!finePointer.matches || !visible || !active) return;
    const bounds = host.getBoundingClientRect();
    pointerX = Math.max(-1, Math.min(1, (event.clientX - bounds.left) / bounds.width * 2 - 1));
    pointerY = Math.max(-1, Math.min(1, (event.clientY - bounds.top) / bounds.height * 2 - 1));
    invalidate();
  }, { passive: true, signal });
  window.addEventListener('scroll', () => {
    if (!visible || !active) return;
    scrollProgress = Math.max(0, Math.min(1, -host.getBoundingClientRect().top / innerHeight));
    invalidate();
  }, { passive: true, signal });
  renderer.domElement.addEventListener('webglcontextlost', event => {
    event.preventDefault();lost = true;host.dataset.rendered = 'false';button.hidden = true;
  }, { signal });
  renderer.domElement.addEventListener('webglcontextrestored', () => {
    lost = false;button.hidden = false;resize();
  }, { signal });
  const observer = new IntersectionObserver(([entry]) => { visible = entry.isIntersecting; if (visible) invalidate(); });
  observer.observe(host);
  const resizeObserver = new ResizeObserver(resize);
  resizeObserver.observe(host);
  signal.addEventListener('abort', () => {
    disposed = true;
    cancelAnimationFrame(frameId);
    observer.disconnect();resizeObserver.disconnect();
    geometry.dispose();material.dispose();renderer.dispose();
    renderer.domElement.remove();host.dataset.rendered = 'false';button.hidden = true;
  }, { once: true });
  resize();setLabel();
}
