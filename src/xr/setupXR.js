import { VRButton } from "three/examples/jsm/webxr/VRButton.js";
import { XR_SETTINGS } from "../config/settings.js";
import { createControllers } from "./controllers.js";

export function setupXR({ renderer, scene }) {
  renderer.xr.enabled = true;
  renderer.xr.setReferenceSpaceType(XR_SETTINGS.referenceSpaceType);

  const button = VRButton.createButton(renderer);
  button.classList.add("vr-button");

  const { controllers } = createControllers(renderer, scene);

  return { button, controllers };
}
