// All intensities are deliberately small. No wheel/touch interception or smooth-scroll dependency.
export const MOTION = Object.freeze({
  mobileMax: 600, desktopMin: 1100,
  scrub: .55, reveal: .7, tilt: 2.5,
  shaderSeconds: .85, distortion: .006,
  maxDpr: 1.5, tabletDpr: 1.1, pixelBudget: 2200000,
});
export function qualityTier() {
  if (innerWidth <= MOTION.mobileMax || navigator.connection?.saveData) return 'light';
  if ((navigator.deviceMemory && navigator.deviceMemory < 4) || (navigator.hardwareConcurrency && navigator.hardwareConcurrency < 4)) return 'light';
  return innerWidth < MOTION.desktopMin ? 'tablet' : 'desktop';
}
