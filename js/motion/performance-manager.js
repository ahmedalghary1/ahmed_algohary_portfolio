import { MOTION } from './config.js';
export function pixelRatio(tier) {
  return Math.min(devicePixelRatio || 1, tier === 'desktop' ? MOTION.maxDpr : MOTION.tabletDpr,
    Math.sqrt(MOTION.pixelBudget / (innerWidth * innerHeight)));
}
// One demand-driven RAF for all WebGL views; no perpetual loop outside the finite intro/reveals.
export function frameScheduler(draw, signal) {
  let frame = 0, stopped = false;
  function tick(time) {
    frame = 0;
    if (stopped || document.hidden || signal.aborted) return;
    if (draw(time)) invalidate();
  }
  function invalidate() {
    if (!frame && !stopped && !signal.aborted && !document.hidden) frame = requestAnimationFrame(tick);
  }
  function cancel() { cancelAnimationFrame(frame); frame = 0; }
  const visibility = () => { if (document.hidden) cancel(); else invalidate(); };
  document.addEventListener('visibilitychange', visibility, { signal });
  signal.addEventListener('abort', () => { stopped = true; cancel(); }, { once: true });
  return { invalidate, cancel };
}
