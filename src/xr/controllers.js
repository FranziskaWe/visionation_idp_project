import * as THREE from "three";
import { XRControllerModelFactory } from "three/examples/jsm/webxr/XRControllerModelFactory.js";

export function createControllers(renderer, scene) {
  const controllerModelFactory = new XRControllerModelFactory();
  const controllers = [];

  const rayGeometry = new THREE.BufferGeometry().setFromPoints([
    new THREE.Vector3(0, 0, 0),
    new THREE.Vector3(0, 0, -1),
  ]);
  const rayMaterial = new THREE.LineBasicMaterial({ color: 0xffffff });

  for (let i = 0; i < 2; i += 1) {
    const controller = renderer.xr.getController(i);
    controller.userData.index = i;

    const ray = new THREE.Line(rayGeometry, rayMaterial);
    ray.name = "controller-ray";
    ray.scale.z = 6;
    controller.add(ray);

    const grip = renderer.xr.getControllerGrip(i);
    grip.add(controllerModelFactory.createControllerModel(grip));

    scene.add(controller);
    scene.add(grip);

    controllers.push(controller);
  }

  return { controllers };
}
