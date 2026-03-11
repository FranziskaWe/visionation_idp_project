const clamp = (value, min, max) => Math.min(max, Math.max(min, value));

export function createLookControls({ camera, domElement }) {
  let enabled = true;
  let isDragging = false;
  let lastX = 0;
  let lastY = 0;
  let yaw = 0;
  let pitch = 0;

  const sensitivity = 0.0025;
  const maxPitch = Math.PI / 2 - 0.05;

  function updateCamera() {
    camera.rotation.set(pitch, yaw, 0, "YXZ");
  }

  function onPointerDown(event) {
    if (!enabled) return;
    isDragging = true;
    lastX = event.clientX;
    lastY = event.clientY;
  }

  function onPointerMove(event) {
    if (!enabled || !isDragging) return;

    const dx = event.clientX - lastX;
    const dy = event.clientY - lastY;

    yaw -= dx * sensitivity;
    pitch -= dy * sensitivity;
    pitch = clamp(pitch, -maxPitch, maxPitch);

    lastX = event.clientX;
    lastY = event.clientY;

    updateCamera();
  }

  function onPointerUp() {
    isDragging = false;
  }

  domElement.addEventListener("pointerdown", onPointerDown);
  domElement.addEventListener("pointermove", onPointerMove);
  domElement.addEventListener("pointerup", onPointerUp);
  domElement.addEventListener("pointerleave", onPointerUp);

  updateCamera();

  return {
    setEnabled: (value) => {
      enabled = value;
      if (!enabled) {
        isDragging = false;
      }
    },
    update: () => {
      if (enabled) updateCamera();
    },
  };
}
