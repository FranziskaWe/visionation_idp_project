import * as THREE from "three";

const ringGeometry = new THREE.RingGeometry(0.25, 0.35, 32);
const dotGeometry = new THREE.CircleGeometry(0.08, 24);

export function createHotspot(definition) {
  const group = new THREE.Group();
  group.position.set(...definition.position);
  group.userData = {
    type: "hotspot",
    id: definition.id,
    label: definition.label,
    target: definition.target,
  };

  const ringMaterial = new THREE.MeshBasicMaterial({
    color: 0x33d6ff,
    transparent: true,
    opacity: 0.9,
    side: THREE.DoubleSide,
  });

  const dotMaterial = new THREE.MeshBasicMaterial({ color: 0xffffff });

  const ring = new THREE.Mesh(ringGeometry, ringMaterial);
  const dot = new THREE.Mesh(dotGeometry, dotMaterial);

  ring.name = "HotspotRing";
  dot.name = "HotspotDot";

  group.add(ring, dot);

  group.userData.setActive = (isActive) => {
    ringMaterial.color.set(isActive ? 0xffd166 : 0x33d6ff);
    dotMaterial.color.set(isActive ? 0xfff3b0 : 0xffffff);
    group.scale.setScalar(isActive ? 1.15 : 1.0);
  };

  return group;
}
