import * as THREE from "three";
import { RENDER_SETTINGS } from "../config/settings.js";

export function createCore(container) {
  const scene = new THREE.Scene();

  const camera = new THREE.PerspectiveCamera(
    RENDER_SETTINGS.fov,
    window.innerWidth / window.innerHeight,
    RENDER_SETTINGS.near,
    RENDER_SETTINGS.far
  );
  camera.position.set(0, 0, 0);

  const renderer = new THREE.WebGLRenderer({ antialias: true });
  renderer.setSize(window.innerWidth, window.innerHeight);
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
  renderer.outputColorSpace = THREE.SRGBColorSpace;
  renderer.xr.enabled = true;
  renderer.xr.setFramebufferScaleFactor(RENDER_SETTINGS.xrFramebufferScaleFactor);
  renderer.domElement.style.touchAction = "none";

  container.appendChild(renderer.domElement);

  // Soft lighting for 3D overlay models.
  const hemiLight = new THREE.HemisphereLight(0xffffff, 0x444444, 1.0);
  hemiLight.position.set(0, 1, 0);
  scene.add(hemiLight);

  const dirLight = new THREE.DirectionalLight(0xffffff, 0.6);
  dirLight.position.set(2, 4, 3);
  scene.add(dirLight);

  return { scene, camera, renderer };
}
