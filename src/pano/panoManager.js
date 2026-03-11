import * as THREE from "three";
import { RENDER_SETTINGS } from "../config/settings.js";

export function createPanoManager(panoMesh, { maxAnisotropy = 1 } = {}) {
  const loader = new THREE.TextureLoader();
  let currentTexture = null;

  function setPanorama(url) {
    return new Promise((resolve, reject) => {
      loader.load(
        url,
        (texture) => {
          texture.colorSpace = THREE.SRGBColorSpace;
          texture.minFilter = THREE.LinearMipmapLinearFilter;
          texture.magFilter = THREE.LinearFilter;
          texture.generateMipmaps = true;
          texture.anisotropy = Math.min(
            maxAnisotropy,
            RENDER_SETTINGS.panoMaxAnisotropy
          );

          if (currentTexture) {
            currentTexture.dispose();
          }

          currentTexture = texture;
          panoMesh.material.map = texture;
          panoMesh.material.needsUpdate = true;
          resolve(texture);
        },
        undefined,
        (error) => reject(error)
      );
    });
  }

  return {
    setPanorama,
    getCurrentTexture: () => currentTexture,
  };
}
