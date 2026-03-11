import "./style.css";
import * as THREE from "three";

import { createCore } from "./core/createCore.js";
import { setupResize } from "./core/resize.js";
import { createLoop } from "./core/loop.js";

import { createPanoSphere } from "./pano/createPanoSphere.js";
import { createPanoManager } from "./pano/panoManager.js";

import { createModelManager } from "./models/modelManager.js";
import { createLookControls } from "./navigation/lookControls.js";
import { setupXR } from "./xr/setupXR.js";

import {
  PANORAMA_POSES,
  DEFAULT_PANORAMA_ID,
  FULL_SCENE_MODEL,
} from "./config/scene.js";

const app = document.querySelector("#app");
const ui = document.querySelector("#ui");
const roomName = document.querySelector("#room-name");
const switchRoomBtn = document.querySelector("#switch-room");

const { scene, camera, renderer } = createCore(app);

scene.background = new THREE.Color(0x222222);

// Camera starts slightly forward for panorama viewing.
camera.position.set(0, 1.6, 0.01);

const panoSphere = createPanoSphere();
scene.add(panoSphere);

const panoManager = createPanoManager(panoSphere, {
  maxAnisotropy: renderer.capabilities.getMaxAnisotropy(),
});

const fullSceneModelManager = createModelManager(scene);

const { button } = setupXR({ renderer, scene });
ui.appendChild(button);

const lookControls = createLookControls({
  camera,
  domElement: renderer.domElement,
});

const panoramaOrder = Object.keys(PANORAMA_POSES);
let currentPanoramaId = DEFAULT_PANORAMA_ID;
let fullSceneLoaded = false;

function toYaw(rotationDeg = [0, 0, 0]) {
  return THREE.MathUtils.degToRad(rotationDeg[1] ?? 0);
}

async function setPanorama(panoramaId) {
  const pose = PANORAMA_POSES[panoramaId];
  if (!pose) return;

  await panoManager.setPanorama(pose.panorama);
  panoSphere.rotation.set(0, -toYaw(pose.rotationDeg), 0);

  if (roomName) {
    roomName.textContent = pose.name;
  }

  currentPanoramaId = panoramaId;
}

async function setFullSceneModel() {
  const model = await fullSceneModelManager.setModel(FULL_SCENE_MODEL);

  if (!fullSceneLoaded && model) {
    const box = new THREE.Box3().setFromObject(model);
    const center = new THREE.Vector3();
    const size = new THREE.Vector3();

    box.getCenter(center);
    box.getSize(size);

    console.log("Model center:", center);
    console.log("Model size:", size);

    if (Number.isFinite(size.x) && Number.isFinite(size.y) && Number.isFinite(size.z)) {
      const maxDim = Math.max(size.x, size.y, size.z);

      if (maxDim > 0) {
        // Put the camera at a reasonable spot relative to the model.
        camera.position.set(
          center.x,
          center.y + Math.max(1.6, size.y * 0.25),
          center.z + Math.max(3, maxDim * 0.75)
        );
        camera.lookAt(center);
      }
    }

    fullSceneLoaded = true;
  }

  return model;
}

function switchToNextPanorama() {
  const currentIndex = panoramaOrder.indexOf(currentPanoramaId);
  const nextIndex = (currentIndex + 1) % panoramaOrder.length;
  const nextPanoramaId = panoramaOrder[nextIndex];

  void setPanorama(nextPanoramaId);
}

if (switchRoomBtn) {
  switchRoomBtn.addEventListener("click", switchToNextPanorama);
}

window.addEventListener("keydown", (event) => {
  if (event.key.toLowerCase() === "n") {
    switchToNextPanorama();
  }
});

setupResize({ camera, renderer });

const loop = createLoop({
  renderer,
  scene,
  camera,
  update: () => {
    lookControls.setEnabled(!renderer.xr.isPresenting);
    lookControls.update();
  },
});

renderer.setAnimationLoop(loop);

void (async () => {
  try {
    await setPanorama(DEFAULT_PANORAMA_ID);
    await setFullSceneModel();
  } catch (err) {
    console.error("Startup failed:", err);
  }
})();



/*import "./style.css";

import { createCore } from "./core/createCore.js";
import { setupResize } from "./core/resize.js";
import { createLoop } from "./core/loop.js";

import { createPanoSphere } from "./pano/createPanoSphere.js";
import { createPanoManager } from "./pano/panoManager.js";

import { createModelManager } from "./models/modelManager.js";

import { createLookControls } from "./navigation/lookControls.js";

import { setupXR } from "./xr/setupXR.js";
import {
  PANORAMA_POSES,
  DEFAULT_PANORAMA_ID,
  FULL_SCENE_MODEL,
  //SOFA_VARIANTS,
  //DEFAULT_SOFA_VARIANT,
  //DECOR_MODELS,
} from "./config/scene.js";
import * as THREE from "three";

const app = document.querySelector("#app");
const ui = document.querySelector("#ui");
const roomName = document.querySelector("#room-name");
const sofaLabel = document.querySelector("#sofa-label");
const switchSofaBtn = document.querySelector("#switch-sofa");
const switchRoomBtn = document.querySelector("#switch-room");

const { scene, camera, renderer } = createCore(app);

// Panorama sphere is created once and reused.
const panoSphere = createPanoSphere();
scene.add(panoSphere);

const panoManager = createPanoManager(panoSphere, {
  maxAnisotropy: renderer.capabilities.getMaxAnisotropy(),
});

const fullSceneModelManager = createModelManager(scene);*/

/*const sofaModelManager = createModelManager(scene);
const decorManagers = Object.fromEntries(
  Object.keys(DECOR_MODELS).map((key) => [key, createModelManager(scene)])
);*/

/*const { button } = setupXR({ renderer, scene });
ui.appendChild(button);

const lookControls = createLookControls({ camera, domElement: renderer.domElement });

//const sofaOrder = ["green", "beige"];
const panoramaOrder = Object.keys(PANORAMA_POSES);
//let currentSofaKey = DEFAULT_SOFA_VARIANT;
let currentPanoramaId = DEFAULT_PANORAMA_ID;*/

/*function isFurnitureVisibleInPanorama(furnitureType, panoramaPose) {
  const visibleFurniture = panoramaPose.visibleFurniture || [];
  return visibleFurniture.includes(furnitureType);
}*/

/*function toRadians(rotationDeg = [0, 0, 0]) {
  return rotationDeg.map((value) => THREE.MathUtils.degToRad(value));
}

function toYaw(rotationDeg = [0, 0, 0]) {
  return THREE.MathUtils.degToRad(rotationDeg[1] ?? 0);
}*/

/*function worldTransformToPanoramaLocal(worldTransform, panoramaPose) {
  const [wx, wy, wz] = worldTransform.position || [0, 0, 0];
  const [px, py, pz] = panoramaPose.position || [0, 0, 0];
  const yaw = toYaw(panoramaPose.rotationDeg);

  const dx = wx - px;
  const dy = wy - py;
  const dz = wz - pz;

  const cos = Math.cos(-yaw);
  const sin = Math.sin(-yaw);

  const lx = dx * cos - dz * sin;
  const lz = dx * sin + dz * cos;
  const ly = dy;

  const worldRotation = toRadians(worldTransform.rotationDeg || [0, 0, 0]);
  const localRotation = [worldRotation[0], worldRotation[1] - yaw, worldRotation[2]];

  return {
    position: [lx, ly, lz],
    rotation: localRotation,
    scale: worldTransform.scale ?? 1,
  };
}*/

/*async function setPanorama(panoramaId) {
  const pose = PANORAMA_POSES[panoramaId];
  if (!pose) return;

  await panoManager.setPanorama(pose.panorama);
  panoSphere.rotation.set(0, -toYaw(pose.rotationDeg), 0);
  roomName.textContent = pose.name;
  currentPanoramaId = panoramaId;
}*/

/*async function setSofaVariant(variantKey) {
  const variant = SOFA_VARIANTS[variantKey];
  if (!variant) return;

  const panoramaPose = PANORAMA_POSES[currentPanoramaId];
  const isVisible = isFurnitureVisibleInPanorama(
    variant.furnitureType || "sofa",
    panoramaPose
  );

  if (!isVisible) {
    await sofaModelManager.setModel(null);
    currentSofaKey = variant.key;
    sofaLabel.textContent = `${variant.label} (hidden in this pano)`;
    switchSofaBtn.disabled = true;
    return;
  }

  let localTransform =
    variant.transform ||
    worldTransformToPanoramaLocal(variant.worldTransform || {}, panoramaPose);

  const positionOffset = variant.panoramaPositionOffsets?.[currentPanoramaId];
  if (positionOffset) {
    const [x, y, z] = localTransform.position || [0, 0, 0];
    const [ox, oy, oz] = positionOffset;
    localTransform = {
      ...localTransform,
      position: [x + ox, y + oy, z + oz],
    };
  }

  await sofaModelManager.setModel({
    ...variant,
    transform: localTransform,
  });
  currentSofaKey = variant.key;
  sofaLabel.textContent = variant.label;
  switchSofaBtn.disabled = false;
}*/

/*function switchToNextSofa() {
  const currentIndex = sofaOrder.indexOf(currentSofaKey);
  const nextIndex = (currentIndex + 1) % sofaOrder.length;
  void setSofaVariant(sofaOrder[nextIndex]);
}*/

/*async function setDecorModels() {
  const panoramaPose = PANORAMA_POSES[currentPanoramaId];
  const work = Object.entries(DECOR_MODELS).map(async ([key, modelConfig]) => {
    const manager = decorManagers[key];
    if (!manager) return;

    const isVisible = isFurnitureVisibleInPanorama(
      modelConfig.furnitureType || key,
      panoramaPose
    );
    if (!isVisible) {
      await manager.setModel(null);
      return;
    }

    const localTransform =
      modelConfig.transform ||
      worldTransformToPanoramaLocal(modelConfig.worldTransform || {}, panoramaPose);

    await manager.setModel({
      ...modelConfig,
      transform: localTransform,
    });
  });

  await Promise.all(work);
}*/

/*async function setFullSceneModel() {
  await fullSceneModelManager.setModel(FULL_SCENE_MODEL);
}

function switchToNextPanorama() {
  const currentIndex = panoramaOrder.indexOf(currentPanoramaId);
  const nextIndex = (currentIndex + 1) % panoramaOrder.length;
  const nextPanoramaId = panoramaOrder[nextIndex];

  void setPanorama(nextPanoramaId).then(async () => {
    await Promise.all([setSofaVariant(currentSofaKey), setDecorModels()]);
  });
}

switchSofaBtn.addEventListener("click", switchToNextSofa);
switchRoomBtn.addEventListener("click", switchToNextPanorama);

window.addEventListener("keydown", (event) => {
  if (event.key.toLowerCase() === "m") {
    switchToNextSofa();
  }
  if (event.key.toLowerCase() === "n") {
    switchToNextPanorama();
  }
});

await setPanorama(DEFAULT_PANORAMA_ID);
//await Promise.all([setSofaVariant(DEFAULT_SOFA_VARIANT), setDecorModels()]);
await setFullSceneModel();




setupResize({ camera, renderer });

scene.background = new THREE.Color(0x222222);

const loop = createLoop({
  renderer,
  scene,
  camera,
  update: () => {
    lookControls.setEnabled(!renderer.xr.isPresenting);
    lookControls.update();
  },
});

renderer.setAnimationLoop(loop);

void (async () => {
  try {
    await setPanorama(DEFAULT_PANORAMA_ID);
    await Promise.all([
      setSofaVariant(DEFAULT_SOFA_VARIANT),
      setDecorModels(),
    ]);
  } catch (err) {
    console.error("Startup failed:", err);
  }
})();*/

/*
setupResize({ camera, renderer });

const loop = createLoop({
  renderer,
  scene,
  camera,
  update: () => {
    lookControls.setEnabled(!renderer.xr.isPresenting);
    lookControls.update();
  },
});

renderer.setAnimationLoop(loop);*/
