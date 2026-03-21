import "./style.css";

import { createCore } from "./core/createCore.js";
import { setupResize } from "./core/resize.js";
import { createLoop } from "./core/loop.js";

import { createPanoSphere } from "./pano/createPanoSphere.js";
import { createPanoManager } from "./pano/panoManager.js";

import { createLookControls } from "./navigation/lookControls.js";

import { uePositionToThree, ueRotationToThree } from "./utils/unrealToThree.js";
import { createHotspotManager } from "./navigation/hotspotManager.js";

import { setupXR } from "./xr/setupXR.js";
import {
  PANORAMA_POSES,
  DEFAULT_PANORAMA_ID,
  PANORAMA_STYLE,
  COLLISION_HOUSE_MODEL,
} from "./config/scene.js";
import { loadGLB } from "./models/loadGLB.js";
import * as THREE from "three";

const app = document.querySelector("#app");
const ui = document.querySelector("#ui");
const roomName = document.querySelector("#room-name");
const switchRoomBtn = document.querySelector("#switch-room");
const styleSelect = document.querySelector("#style-select");
const xrDiagnostics = document.querySelector("#xr-diagnostics");

const { scene, camera, renderer } = createCore(app);

// Add this line:
const hotspotManager = createHotspotManager(scene);

// Panorama sphere is created once and reused.
const panoSphere = createPanoSphere();
scene.add(panoSphere);

const panoManager = createPanoManager(panoSphere, {
  maxAnisotropy: renderer.capabilities.getMaxAnisotropy(),
});

const { button } = setupXR({ renderer, scene });
ui.appendChild(button);

const lookControls = createLookControls({ camera, domElement: renderer.domElement });

const panoramaOrder = Object.keys(PANORAMA_POSES);
let currentPanoramaId = DEFAULT_PANORAMA_ID;
let currentPanoramaStyle = PANORAMA_STYLE;
let houseModel = null;
const calibrationModes = ["wireframe", "transparent", "hidden"];
let currentCalibrationModeIndex = 0;
const UE_TO_WEB_SCALE = 0.01;


// After creating hotspotManager...
const raycaster = new THREE.Raycaster();
const pointer = new THREE.Vector2();
let hoveredHotspot = null;

function getHotspotAtPointer(clientX, clientY) {
  const rect = renderer.domElement.getBoundingClientRect();
  pointer.x = ((clientX - rect.left) / rect.width) * 2 - 1;
  pointer.y = -((clientY - rect.top) / rect.height) * 2 + 1;

  raycaster.setFromCamera(pointer, camera);
  const hits = raycaster.intersectObjects(hotspotManager.getHotspots(), true);
  if (hits.length === 0) return null;

  // Walk up to the Group that has userData.type === "hotspot"
  let obj = hits[0].object;
  while (obj && obj.userData.type !== "hotspot") obj = obj.parent;
  return obj ?? null;
}

renderer.domElement.addEventListener("pointermove", (event) => {
  if (renderer.xr.isPresenting) return;
  const hit = getHotspotAtPointer(event.clientX, event.clientY);

  if (hit !== hoveredHotspot) {
    hoveredHotspot?.userData.setActive(false);
    hoveredHotspot = hit;
    hoveredHotspot?.userData.setActive(true);
    renderer.domElement.style.cursor = hit ? "pointer" : "";
  }
});

renderer.domElement.addEventListener("click", (event) => {
  if (renderer.xr.isPresenting) return;
  const hit = getHotspotAtPointer(event.clientX, event.clientY);
  if (hit?.userData.target) {
    void setPanorama(hit.userData.target);
  }
});

function panoramaUrlForStyle(baseUrl, style) {
  return baseUrl.replace(/\/assets\/panoramas\/s[0-9]+_/, `/assets/panoramas/${style}_`);
}

function panoramaUrlForS1(baseUrl) {
  return panoramaUrlForStyle(baseUrl, "s1");
}

function applyScale(object, scale) {
  if (Array.isArray(scale)) {
    const [sx = 1, sy = 1, sz = 1] = scale;
    object.scale.set(sx, sy, sz);
    return;
  }
  object.scale.setScalar(scale ?? 1);
}

function applyHouseCalibrationMode() {
  if (!houseModel) return;
  const mode = calibrationModes[currentCalibrationModeIndex];

  houseModel.traverse((child) => {
    if (!child.isMesh) return;
    const materials = Array.isArray(child.material) ? child.material : [child.material];
    materials.forEach((material) => {
      if (!material) return;

      if (mode === "hidden") {
        material.transparent = true;
        material.opacity = 0;
        material.wireframe = false;
        material.depthWrite = false;
      } else if (mode === "wireframe") {
        material.transparent = true;
        material.opacity = 1;
        material.wireframe = true;
        material.depthWrite = false;
      } else {
        material.transparent = true;
        material.opacity = 0.28;
        material.wireframe = false;
        material.depthWrite = false;
      }
      material.needsUpdate = true;
    });
  });
}

function worldTransformToPanoramaLocal(worldTransform, panoramaPose) {
  const [wxRaw, wyRaw, wzRaw] = worldTransform.position || [0, 0, 0];
  const [pxRaw, pyRaw, pzRaw] = panoramaPose.position || [0, 0, 0];
  const wx = wxRaw * UE_TO_WEB_SCALE;
  const wy = wyRaw * UE_TO_WEB_SCALE;
  const wz = wzRaw * UE_TO_WEB_SCALE;
  const px = pxRaw * UE_TO_WEB_SCALE;
  const py = pyRaw * UE_TO_WEB_SCALE;
  const pz = pzRaw * UE_TO_WEB_SCALE;
  const yaw = toYaw(panoramaPose.rotationDeg);

  const dx = wx - px;
  const dy = wy - py;
  const dz = wz - pz;

  const cos = Math.cos(-yaw);
  const sin = Math.sin(-yaw);

  const lx = dx * cos - dz * sin;
  const lz = dx * sin + dz * cos;
  const ly = dy;

  const [wrxDeg = 0, wryDeg = 0, wrzDeg = 0] = worldTransform.rotationDeg || [0, 0, 0];
  const [wrx, wry, wrz] = [
    THREE.MathUtils.degToRad(wrxDeg),
    THREE.MathUtils.degToRad(wryDeg),
    THREE.MathUtils.degToRad(wrzDeg),
  ];
  return {
    position: [lx, ly, lz],
    rotation: [wrx, wry - yaw, wrz],
  };
}

/*function updateHouseForPanorama(panoramaPose) {

  const localTransform = worldTransformToPanoramaLocal(
    {
      position: COLLISION_HOUSE_MODEL.position || [0, 0, 0],
      rotationDeg: COLLISION_HOUSE_MODEL.rotationDeg || [0, 0, 0],
    },
    panoramaPose
  );

  const [x, y, z] = localTransform.position;
  const [rx, ry, rz] = localTransform.rotation;
  houseModel.position.set(x, y, z);
  houseModel.rotation.set(rx, ry, rz);
  applyScale(houseModel, COLLISION_HOUSE_MODEL.scale);
}*/

function updateHouseForPanorama(panoramaPose) {
  if (!houseModel || !panoramaPose) return;

  // Convert both positions from UE space to Three.js space
  const housePos = uePositionToThree(...COLLISION_HOUSE_MODEL.position);
  const cameraPos = uePositionToThree(...panoramaPose.position);

  // The house position relative to the camera (user is always at origin)
  const relativePos = housePos.clone().sub(cameraPos);
  houseModel.position.copy(relativePos);

  // Apply house rotation, accounting for coordinate system flip
  const [px, py, pz] = COLLISION_HOUSE_MODEL.rotationDeg;
  houseModel.rotation.copy(ueRotationToThree(px, py, pz));

  // Apply scale (UE cm → Three units already handled above, 
  // but if your GLB is exported in UE units you may still need this)
  applyScale(houseModel, COLLISION_HOUSE_MODEL.scale);
}

async function addCollisionHouseModel() {
  if (!COLLISION_HOUSE_MODEL?.url) return;

  try {
    const house = await loadGLB(COLLISION_HOUSE_MODEL.url);

    house.traverse((child) => {
      if (!child.isMesh) return;

      child.frustumCulled = false;
      child.castShadow = false;
      child.receiveShadow = false;
      const materials = Array.isArray(child.material) ? child.material : [child.material];
      materials.forEach((material) => {
        if (!material) return;
        material.side = THREE.DoubleSide;
        material.needsUpdate = true;
      });
    });

    houseModel = house;
    scene.add(house);
    updateHouseForPanorama(PANORAMA_POSES[currentPanoramaId]);
    applyHouseCalibrationMode();
  } catch (error) {
    console.warn("Failed to load collision house model:", error);
  }
}

async function updateXRDiagnostics() {
  return;
  const lines = [];
  lines.push(`secureContext: ${window.isSecureContext ? "yes" : "no"}`);

  const xr = navigator.xr;
  lines.push(`navigator.xr: ${xr ? "available" : "missing"}`);

  if (xr && xr.isSessionSupported) {
    try {
      const supported = await xr.isSessionSupported("immersive-vr");
      lines.push(`immersive-vr support: ${supported ? "yes" : "no"}`);
    } catch (error) {
      lines.push(`immersive-vr support: error (${error?.name || "unknown"})`);
    }
  } else {
    lines.push("immersive-vr support: not checkable");
  }

  lines.push(`xr presenting: ${renderer.xr.isPresenting ? "yes" : "no"}`);
  xrDiagnostics.textContent = `XR diagnostics\n${lines.join("\n")}`;
}

function toYaw(rotationDeg = [0, 0, 0]) {
  return THREE.MathUtils.degToRad(rotationDeg[1] ?? 0);
}

async function setPanorama(panoramaId) {
  const pose = PANORAMA_POSES[panoramaId];
  if (!pose) return;

  const preferredUrl = panoramaUrlForStyle(pose.panorama, currentPanoramaStyle);
  try {
    await panoManager.setPanorama(preferredUrl);
  } catch {
    // Some views only exist in s1. Fallback keeps navigation working.
    await panoManager.setPanorama(panoramaUrlForS1(pose.panorama));
  }

  const yawRad = THREE.MathUtils.degToRad(-pose.rotationDeg[1]); // flip for RH coords
  panoSphere.rotation.set(0, yawRad, 0);

  roomName.textContent = pose.name;
  currentPanoramaId = panoramaId;
  updateHouseForPanorama(pose);

  hoveredHotspot = null; // clear hover state on transition

  hotspotManager.setHotspots([
    {
      id: "debug",
      label: "Debug",
      target: "kitchen1",
      position: [0, 0, -2], // 2 meters straight ahead in Three.js space
    }
  ]);

  /*hotspotManager.setHotspots(
    (pose.hotspots ?? []).map((hs) => ({
      ...hs,
      position: uePositionToThree(...hs.position)   // ← converts UE cm → Three.js space
        .sub(uePositionToThree(...pose.position))    // ← relative to camera
        .toArray(),
    }))
  );*/

  /*panoSphere.rotation.set(0, -toYaw(pose.rotationDeg), 0);
  roomName.textContent = pose.name;
  currentPanoramaId = panoramaId;
  updateHouseForPanorama(pose);*/
}

function switchToNextPanorama() {
  const currentIndex = panoramaOrder.indexOf(currentPanoramaId);
  const nextIndex = (currentIndex + 1) % panoramaOrder.length;
  const nextPanoramaId = panoramaOrder[nextIndex];

  void setPanorama(nextPanoramaId);
}

function switchToNextStyle() {
  currentPanoramaStyle = currentPanoramaStyle === "s1" ? "s2" : "s1";
  styleSelect.value = currentPanoramaStyle;
  void setPanorama(currentPanoramaId);
}

function switchCalibrationMode() {
  currentCalibrationModeIndex =
    (currentCalibrationModeIndex + 1) % calibrationModes.length;
  applyHouseCalibrationMode();
}

switchRoomBtn.addEventListener("click", switchToNextPanorama);
styleSelect.addEventListener("change", () => {
  currentPanoramaStyle = styleSelect.value;
  void setPanorama(currentPanoramaId);
});

window.addEventListener("keydown", (event) => {
  if (event.key.toLowerCase() === "n") {
    switchToNextPanorama();
  }
  if (event.key.toLowerCase() === "b") {
    switchToNextStyle();
  }
  if (event.key.toLowerCase() === "c") {
    switchCalibrationMode();
  }
});

styleSelect.value = currentPanoramaStyle;
await setPanorama(DEFAULT_PANORAMA_ID);
await addCollisionHouseModel();

setupResize({ camera, renderer });


const loop = createLoop({
  renderer, scene, camera,
  update: () => {
    lookControls.setEnabled(!renderer.xr.isPresenting);
    lookControls.update();
    hotspotManager.update(camera); // ← your partner's update already takes camera
  },
});

/*const loop = createLoop({
  renderer,
  scene,
  camera,
  update: () => {
    lookControls.setEnabled(!renderer.xr.isPresenting);
    lookControls.update();
  },
});*/

renderer.setAnimationLoop(loop);

void updateXRDiagnostics();
renderer.xr.addEventListener("sessionstart", () => {
  void updateXRDiagnostics();
});
renderer.xr.addEventListener("sessionend", () => {
  void updateXRDiagnostics();
});
