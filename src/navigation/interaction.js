import * as THREE from "three";
import { UI_SETTINGS } from "../config/settings.js";

export function createInteractionSystem({ camera, renderer, controllers = [] }) {
  const raycaster = new THREE.Raycaster();
  raycaster.params.Line.threshold = UI_SETTINGS.hotspotRaycasterThreshold;

  const pointer = new THREE.Vector2();
  const tempMatrix = new THREE.Matrix4();
  const clickThreshold = 6;

  let interactables = [];
  let onSelect = null;
  let hovered = null;
  let pointerDown = null;

  function setInteractables(list) {
    interactables = list;
  }

  function setOnSelect(handler) {
    onSelect = handler;
  }

  function findHotspot(object) {
    let current = object;
    while (current) {
      if (current.userData && current.userData.type === "hotspot") return current;
      current = current.parent;
    }
    return null;
  }

  function setHovered(nextHotspot) {
    if (hovered === nextHotspot) return;

    if (hovered && hovered.userData.setActive) {
      hovered.userData.setActive(false);
    }

    hovered = nextHotspot;

    if (hovered && hovered.userData.setActive) {
      hovered.userData.setActive(true);
    }
  }

  function intersectFromPointer() {
    raycaster.setFromCamera(pointer, camera);
    const hits = raycaster.intersectObjects(interactables, true);
    if (hits.length === 0) return null;
    return findHotspot(hits[0].object);
  }

  function intersectFromController(controller) {
    tempMatrix.identity().extractRotation(controller.matrixWorld);

    raycaster.ray.origin.setFromMatrixPosition(controller.matrixWorld);
    raycaster.ray.direction.set(0, 0, -1).applyMatrix4(tempMatrix);

    const hits = raycaster.intersectObjects(interactables, true);
    if (hits.length === 0) return null;
    return findHotspot(hits[0].object);
  }

  function handleSelect(hotspot) {
    if (!hotspot || !onSelect) return;
    onSelect(hotspot);
  }

  function onPointerMove(event) {
    const rect = renderer.domElement.getBoundingClientRect();
    pointer.x = ((event.clientX - rect.left) / rect.width) * 2 - 1;
    pointer.y = -((event.clientY - rect.top) / rect.height) * 2 + 1;
  }

  function onPointerDown(event) {
    onPointerMove(event);
    pointerDown = { x: event.clientX, y: event.clientY };
  }

  function onPointerUp(event) {
    if (!pointerDown) return;
    onPointerMove(event);

    const dx = event.clientX - pointerDown.x;
    const dy = event.clientY - pointerDown.y;
    const distance = Math.hypot(dx, dy);

    if (distance <= clickThreshold) {
      handleSelect(intersectFromPointer());
    }

    pointerDown = null;
  }

  renderer.domElement.addEventListener("pointermove", onPointerMove);
  renderer.domElement.addEventListener("pointerdown", onPointerDown);
  renderer.domElement.addEventListener("pointerup", onPointerUp);

  controllers.forEach((controller) => {
    controller.addEventListener("selectstart", (event) => {
      handleSelect(intersectFromController(event.target));
    });
  });

  function update() {
    const pointerHit = intersectFromPointer();
    if (pointerHit) {
      setHovered(pointerHit);
      return;
    }

    for (const controller of controllers) {
      const controllerHit = intersectFromController(controller);
      if (controllerHit) {
        setHovered(controllerHit);
        return;
      }
    }

    setHovered(null);
  }

  return {
    setInteractables,
    setOnSelect,
    update,
  };
}
