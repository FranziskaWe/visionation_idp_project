export const RENDER_SETTINGS = {
  fov: 70,
  near: 0.1,
  far: 2000,
  // Keep this larger than any transparent collision-house bounds from [0,0,0].
  // If the overlay model is outside the panorama sphere, the pano can hide it.
  panoRadius: 50,
  // Increase XR render target sharpness in-headset (higher = sharper + heavier GPU cost).
  xrFramebufferScaleFactor: 1.2,
  // Cap anisotropy to keep texture sampling sharper without overspending GPU.
  panoMaxAnisotropy: 8,
};

export const XR_SETTINGS = {
  // Use "local" so the camera stays centered in the panorama capture point.
  referenceSpaceType: "local",
};

export const UI_SETTINGS = {
  // Useful when you want a slightly larger click target for desktop.
  hotspotRaycasterThreshold: 0.02,
};
