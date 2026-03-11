export const PANORAMA_POSES = {
  livingRoom: {
    id: "livingRoom",
    name: "Living Room",
    panorama: "/assets/panoramas/LivingRoom1.jpeg",
    position: [0, 0, 0],
    rotationDeg: [0, 90, 0],
  },
  kitchen: {
    id: "kitchen",
    name: "Kitchen",
    panorama: "/assets/panoramas/Kitchen1.jpeg",
    position: [2.4, 0, -3.1],
    rotationDeg: [0, 90, 0],
  },
};

export const DEFAULT_PANORAMA_ID = "livingRoom";

export const FULL_SCENE_MODEL = {
  url: "/assets/full_model.glb",
  transform: {
    position: [0, 0, 0],
    rotation: [0, 0, 0],
    scale: 1,
  },
};

/*export const PANORAMA_POSES = {
  livingRoom: {
    id: "livingRoom",
    name: "Living Room",
    panorama: "/assets/panoramas/LivingRoom1.jpeg",
    // World-space capture pose of this panorama camera.
    // position: [x, y, z] => [left/right, up/down, forward/back]
    position: [0, 0, 0],
    // rotationDeg: [x, y, z] => [pitch, yaw, roll] in degrees
    rotationDeg: [0, 90, 0],
    visibleFurniture: ["sofa", "plant", "lamp"],
  },
  kitchen: {
    id: "kitchen",
    name: "Kitchen",
    panorama: "/assets/panoramas/Kitchen1.jpeg",
    // TODO: replace with your measured kitchen panorama pose.
    // position: [x, y, z] => [left/right, up/down, forward/back]
    position: [2.4, 0, -3.1],
    // Nudge kitchen start view slightly to the left.
    // rotationDeg: [x, y, z] => [pitch, yaw, roll] in degrees
    rotationDeg: [0, 90, 0],
    // visibleFurniture: ["sofa", "plant", "lamp"],
  },
};

export const DEFAULT_PANORAMA_ID = "livingRoom";

// Reusable shared-world anchors.
// Same anchor is reused across panoramas; runtime converts world -> active panorama local.
// position: [x, y, z] => [forward/back, down/up, left/right] in shared world space
// rotationDeg: [x, y, z] => [pitch, yaw, roll] in degrees (world axes).
// Important: visual left/right on screen can differ when panorama yaw is rotated.
export const FURNITURE_ANCHORS_WORLD = {
  sofaMain: {
    position: [350, -120, -20],
    rotationDeg: [0, 90, 0],
    scale: 1,
  },
  plantMain: {
    position: [350, -120, 0],
    rotationDeg: [0, 90, 0],
    scale: 1,
  },
  lampMain: {
    position: [300, -120, -40],
    rotationDeg: [0, 90, 0],
    scale: 1,
  },
  // tvWallMain: {
  //   position: [150, -150, 50],
  //   rotationDeg: [0, 90, 0],
  //   scale: 1,
  // },
};

function withWorldAnchor(anchorKey, model) {
  return { ...model, worldTransform: FURNITURE_ANCHORS_WORLD[anchorKey] };
}

export const SOFA_VARIANTS = {
  green: withWorldAnchor("sofaMain", {
    key: "green",
    label: "Green Sofa",
    furnitureType: "sofa",
    forceOpaqueMaterial: true,
    url: "/models/sofa_green.glb",
    // Fine-tune only the living room pano placement in local pano space.
    panoramaPositionOffsets: {
      livingRoom: [0, -0.25, -0.8],
    },
  }),
  beige: withWorldAnchor("sofaMain", {
    key: "beige",
    label: "Wooden Sofa",
    furnitureType: "sofa",
    forceOpaqueMaterial: true,
    url: "/models/LR_Sofa_Wooden.glb",
  }),
};

export const FULL_SCENE_MODEL = {
  url: "/assets/full_model.glb",
  transform: {
    position: [0, 0, 0],
    rotation: [0, 0, 0],
    scale: 1,
  },
};

export const DEFAULT_SOFA_VARIANT = "green";

export const DECOR_MODELS = {
  plant: withWorldAnchor("plantMain", {
    key: "plant",
    label: "Plant",
    furnitureType: "plant",
    url: "/models/LR_Plant.glb",
  }),
  lamp: withWorldAnchor("lampMain", {
    key: "lamp",
    label: "Lamp",
    furnitureType: "lamp",
    url: "/models/LR_Lamp.glb",
  }),
  // tvWall: withWorldAnchor("tvWallMain", {
  //   key: "tvWall",
  //   label: "TV Wall",
  //   furnitureType: "tvWall",
  //   url: "/models/LR_TV_Wall.glb",
  // }),
};
*/