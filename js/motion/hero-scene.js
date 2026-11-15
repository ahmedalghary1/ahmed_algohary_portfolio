import { MOTION } from './config.js';

// Six related modules, one accent frame, two instanced draw calls.
export function createSculpture(T) {
  const geometry = new T.BoxGeometry(1.7, .11, .13);
  const metal = new T.MeshStandardMaterial({ color: MOTION.metal, metalness: .58, roughness: .36 });
  const accent = new T.MeshStandardMaterial({ color: MOTION.accent, metalness: .35, roughness: .4 });
  const group = new T.Group();
  const metalBatch = new T.InstancedMesh(geometry, metal, 20);
  const accentBatch = new T.InstancedMesh(geometry, accent, 4);
  const frame = new T.Object3D();
  const beam = new T.Object3D();
  let mi = 0, ai = 0;
  for (let i = 0; i < 6; i++) {
    frame.position.set(0, 0, (i - 2.5) * .24);
    frame.rotation.z = (i - 2.5) * .13;
    frame.updateMatrixWorld(true);
    for (let j = 0; j < 4; j++) {
      const angle = j * Math.PI / 2;
      beam.position.set(Math.sin(angle) * .85, Math.cos(angle) * .85, 0);
      beam.rotation.z = angle;
      beam.updateMatrix();
      const matrix = new T.Matrix4().multiplyMatrices(frame.matrixWorld, beam.matrix);
      if (i === 2) accentBatch.setMatrixAt(ai++, matrix);
      else metalBatch.setMatrixAt(mi++, matrix);
    }
  }
  group.add(metalBatch, accentBatch);
  return { group, dispose() { geometry.dispose(); metal.dispose(); accent.dispose(); metalBatch.dispose(); accentBatch.dispose(); } };
}
