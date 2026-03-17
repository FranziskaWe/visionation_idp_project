export const PANORAMA_STYLE = "s1";
export const PANORAMA_VIEW_INDEX = 1;
export const COLLISION_HOUSE_MODEL = {
  url: "/models/House_Bones_Anc_LR.glb",
  position: [0, 0, 0],
  rotation: [0, 0, 0],
  scale: 1,
};

function panoramaPath(roomName) {
  // Both styles (s1 and s2) use numbered filenames like *_LivingRoom1.jpeg.
  return `/assets/panoramas/${PANORAMA_STYLE}_${roomName}${PANORAMA_VIEW_INDEX}.jpeg`;
}

export const PANORAMA_POSES = {
  livingRoom: {
    id: "livingRoom",
    name: "Living Room",
    panorama: panoramaPath("LivingRoom"),
    // position: [x, y, z] => [left/right, up/down, forward/back]
    position: [0, 0, 0],
    // rotationDeg: [x, y, z] => [pitch, yaw, roll] in degrees
    rotationDeg: [0, 90, 0],
  },
  kitchen: {
    id: "kitchen",
    name: "Kitchen",
    panorama: panoramaPath("Kitchen"),
    // TODO: replace with your measured kitchen panorama pose.
    position: [2.4, 0, -3.1],
    rotationDeg: [0, 90, 0],
  },
};

export const DEFAULT_PANORAMA_ID = "livingRoom";
