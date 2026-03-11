import * as THREE from "three";
import { loadGLB } from "./loadGLB.js";

function resolveTransform(modelConfig) {
  const transform = modelConfig.transform || modelConfig;
  const position = transform.position || [0, 0, 0];
  const rotation = transform.rotation || [0, 0, 0];
  const rotationDeg = transform.rotationDeg || null;
  const scale = transform.scale ?? 1;

  return {
    position,
    rotation: rotationDeg
      ? rotationDeg.map((value) => THREE.MathUtils.degToRad(value))
      : rotation,
    scale,
  };
}

function applyScale(object, scale) {
  if (Array.isArray(scale)) {
    const [sx = 1, sy = 1, sz = 1] = scale;
    object.scale.set(sx, sy, sz);
    return;
  }
  object.scale.setScalar(scale);
}

function applyMaterialFix(material, { forceOpaque = false } = {}) {
  material.side = THREE.DoubleSide;
  material.shadowSide = THREE.DoubleSide;

  if (forceOpaque) {
    material.transparent = false;
    material.alphaTest = 0;
    material.opacity = 1;
    material.depthWrite = true;
  }

  material.needsUpdate = true;
}

export function createModelManager(scene) {
  const cache = new Map();
  let currentModel = null;

  async function setModel(modelConfig) {
    if (!modelConfig || !modelConfig.url) {
      if (currentModel) {
        currentModel.visible = false;
      }
      return null;
    }

    let model = cache.get(modelConfig.url);
    if (!model) {
      model = await loadGLB(modelConfig.url);
      model.traverse((child) => {
        if (child.isMesh) {
          child.castShadow = false;
          child.receiveShadow = false;
          // Imported bounds can be wrong; disable mesh culling to prevent disappearing parts.
          child.frustumCulled = false;
          if (child.geometry && !child.geometry.attributes.normal) {
            child.geometry.computeVertexNormals();
          }
          if (!child.material) {
            child.material = new THREE.MeshStandardMaterial({ color: 0xffffff });
          }
          if (Array.isArray(child.material)) {
            child.material.forEach((material) => {
              applyMaterialFix(material, {
                forceOpaque: modelConfig.forceOpaqueMaterial === true,
              });
            });
          } else {
            applyMaterialFix(child.material, {
              forceOpaque: modelConfig.forceOpaqueMaterial === true,
            });
          }
        }
      });
      cache.set(modelConfig.url, model);
      scene.add(model);
    }

    if (currentModel && currentModel !== model) {
      currentModel.visible = false;
    }

    currentModel = model;
    currentModel.visible = true;

    const { position, rotation, scale } = resolveTransform(modelConfig);
    const [x, y, z] = position;
    const [rx, ry, rz] = rotation;

    currentModel.position.set(x, y, z);
    currentModel.rotation.set(rx, ry, rz);
    applyScale(currentModel, scale);

    return currentModel;
  }

  return { setModel };
}
