import * as THREE from "three";
import { createHotspot } from "./hotspot.js";

export function createHotspotManager(scene) {
  const group = new THREE.Group();
  group.name = "HotspotGroup";
  scene.add(group);

  let hotspots = [];

  function disposeHotspot(hotspot) {
    hotspot.traverse((child) => {
      if (child.material) child.material.dispose();
    });
  }

  function setHotspots(definitions = []) {
    hotspots.forEach(disposeHotspot);
    group.clear();

    hotspots = definitions.map((definition) => {
      const hotspot = createHotspot(definition);
      group.add(hotspot);
      return hotspot;
    });

    return hotspots;
  }

  function update(camera) {
    hotspots.forEach((hotspot) => {
      hotspot.lookAt(camera.position);
    });
  }

  return {
    setHotspots,
    update,
    getHotspots: () => hotspots,
  };
}
