import * as THREE from "three";

export function createLoop({ renderer, scene, camera, update }) {
  const clock = new THREE.Clock();

  return () => {
    const delta = clock.getDelta();
    if (update) {
      update(delta);
    }
    renderer.render(scene, camera);
  };
}
