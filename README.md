# Visionation WebXR Living Room Scene

A beginner-friendly Vite + vanilla JS + Three.js WebXR project with:
- one reusable panorama sphere,
- one living-room panorama,
- one sofa model shown by default (green),
- one-click model switch to beige.

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
- Switch sofa: click `Switch Sofa` button or press `M`.
- Switch panorama pose: press `N`.
- VR: enter with the `VR` button (`VRButton`).

## Assets Used
- Panorama: `public/assets/panoramas/LivingRoom1.jpeg`
- Green sofa: `public/models/LR_Sofa_Green.glb`
- Wooden sofa: `public/models/LR_Sofa_Wooden.glb`

## Main Files
- `src/config/scene.js` single-scene and sofa-variant config.
- `src/main.js` app wiring and sofa switch logic.
- `src/pano/*` panorama sphere + texture manager.
- `src/models/*` GLB loader + model manager.
- `src/xr/*` WebXR button + controllers.
- `src/navigation/lookControls.js` drag-to-look controls.

## Notes For Beginners
- The panorama sphere is created once in `src/pano/createPanoSphere.js`.
- Model switching does not rebuild the scene. It only swaps visible GLB via `setModel`.
- If sofa placement needs tuning, edit position/rotation/scale in `src/config/scene.js`.
- Shared coordinates are configured in `PANORAMA_POSES` + `FURNITURE_ANCHORS_WORLD` in `src/config/scene.js`.
