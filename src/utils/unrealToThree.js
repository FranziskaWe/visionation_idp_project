import * as THREE from "three";

// Unreal Engine uses cm, left-handed (X-fwd, Y-right, Z-up)
// Three.js uses meters (or any unit), right-handed (X-right, Y-up, Z-back)
// Scale: if your panorama positions are already in UE cm, use 0.01 to get meters.

const UE_SCALE = 0.01;

export function uePositionToThree(ueX, ueY, ueZ) {
    return new THREE.Vector3(
       ueX * 0.01,   // X → X (cm to meters)
       ueZ * 0.01,   // Z → Y (up)
      -ueY * 0.01    // -Y → Z
    );
  }
/*export function uePositionToThree(ueX, ueY, ueZ) {
    return new THREE.Vector3(
       ueX,   // X → X
       ueZ,   // Z → Y (up)
      -ueY    // -Y → Z
    );
  }*/

export function ueRotationToThree(pitchDeg, yawDeg, rollDeg) {
  // Unreal rotation order: Yaw (Z), Pitch (Y), Roll (X)
  // We only care about yaw for panorama alignment in most cases
  const euler = new THREE.Euler(
    THREE.MathUtils.degToRad(pitchDeg),   // pitch → X rotation
    THREE.MathUtils.degToRad(-yawDeg),    // yaw → -Y rotation (handedness flip)
    THREE.MathUtils.degToRad(rollDeg),
    "YXZ"
  );
  return euler;
}