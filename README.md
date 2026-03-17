# Visionation WebXR Living Room Scene

A beginner-friendly Vite + vanilla JS + Three.js WebXR project with:
- 1 reusable panorama sphere,
- 2 styles: classic, modern,
- each style covers 4 spaces: kitchen (1 pano), living room (3 panos), hallway (2 panos), bedroom (3 panos),
- 1 transparent full-house GLB overlay for collision/raycasting only.

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
- Switch panorama pose: press `N`.
- VR: enter with the `VR` button (`VRButton`).

## Assets Used
- Naming convention of panorama file: 
  `{style_index}_{space}{index_in_space}.jpeg`

## Main Files
- `src/config/scene.js` single-scene
- `src/main.js` app wiring, panorama switching, collision house model setup.
- `src/pano/*` panorama sphere + texture manager.
- `src/models/loadGLB.js` GLB loader used for the transparent collision house model.
- `src/xr/*` WebXR button + controllers.
- `src/navigation/lookControls.js` drag-to-look controls.

## Notes For Beginners
- The panorama sphere is created once in `src/pano/createPanoSphere.js`.
- The full-house collision model is loaded once and made fully transparent (`opacity: 0`) in `src/main.js`.
- Configure collision model transform with `COLLISION_HOUSE_MODEL` in `src/config/scene.js`.
- Switch between styles by changing `PANORAMA_STYLE` in `src/config/scene.js` (`"s1"` or `"s2"`).
