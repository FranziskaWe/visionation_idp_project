import * as THREE from "three";
import { RENDER_SETTINGS } from "../config/settings.js";

export function createPanoSphere() {
  const geometry = new THREE.SphereGeometry(
    RENDER_SETTINGS.panoRadius,
    60,
    40
  );
  geometry.scale(-1, 1, 1); // Invert the sphere so we render the inside

  const material = new THREE.MeshBasicMaterial({
    color: 0xffffff,
    depthWrite: false,
  });
  const sphere = new THREE.Mesh(geometry, material);
  sphere.name = "PanoramaSphere";
  sphere.renderOrder = -1;

  return sphere;
}
