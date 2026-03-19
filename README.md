# Visionation WebXR Panorama Calibration Viewer

A Vite + vanilla JS + Three.js WebXR project with:
- 1 reusable panorama sphere,
- 2 panorama styles (`s1` classic, `s2` modern),
- 9 panorama viewpoints (kitchen, living room x3, hallway x2, bedroom x3),
- 1 full-house GLB framework overlay for alignment calibration.

This is monoscopic 360 (3DoF) and Quest 3 ready through `VRButton`.

## Run
1. `npm install`
2. `npm run dev`

For Quest 3 on local network:
1. `npm run dev -- --host`
2. Open the shown URL in Quest Browser.

If immersive mode does not appear, use HTTPS dev mode:
1. `npm run dev -- --host --https`
2. Accept the certificate warning in Quest Browser.

## Controls
- Desktop/Mobile: drag to look around.
- Switch panorama pose: press `N` or click `Switch Room`.
- Switch style: press `B` or choose from style list (`Classic`, `Modern`).
- Switch house calibration display mode: press `C` (`wireframe -> transparent -> hidden`).
- VR: enter with the `VR` button (`VRButton`).

## Assets Used
- Panorama naming convention:
  `{style}_{view}.jpeg`
  examples: `s1_LivingRoom1.jpeg`, `s2_Kitchen1.jpeg`
- House framework model:
  `public/models/model_no_textures.glb`

## Main Files
- `src/config/scene.js` panorama pose list + house model transform config.
- `src/main.js` panorama/style switching, style fallback, house calibration rendering.
- `src/pano/*` panorama sphere + texture manager.
- `src/models/loadGLB.js` GLB loader used for the house model.
- `src/xr/*` WebXR button + controllers.
- `src/navigation/lookControls.js` drag-to-look controls.

## Calibration Notes
- The panorama sphere is created once in `src/pano/createPanoSphere.js`.
- House model transform is configured in `COLLISION_HOUSE_MODEL` in `src/config/scene.js`.
- `COLLISION_HOUSE_MODEL.scale` defaults to `0.01` (UE cm -> web meter-like units).
- Panorama camera poses are configured in `PANORAMA_POSES` (position + yaw).
- When a selected style asset is missing for a view, runtime falls back to the `s1` panorama for that view.
