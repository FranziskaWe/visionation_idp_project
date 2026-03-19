export const PANORAMA_STYLE = "s1";
export const COLLISION_HOUSE_MODEL = {
  url: "/models/model_no_textures.glb",
  position: [168000, -55000, -8000],
  // rotationDeg: [x, y, z] => [pitch, yaw, roll] in degrees
  rotationDeg: [0, 90, 0],
  // Unreal cm -> web meter-like units (first-pass calibration scale).
  scale: 5.5,
};

function panoramaPath(viewName) {
  return `/assets/panoramas/${PANORAMA_STYLE}_${viewName}.jpeg`;
}

export const PANORAMA_POSES = {
  kitchen1: {
    id: "kitchen1",
    name: "Kitchen 1",
    panorama: panoramaPath("Kitchen1"),
    position: [48.676407, -272.037245, 110.92365],
    rotationDeg: [0, 90, 0],
  },
  livingRoom1: {
    id: "livingRoom1",
    name: "Living Room 1",
    panorama: panoramaPath("LivingRoom1"),
    position: [33.25304, 321.844237, 102.219781],
    rotationDeg: [0, -90, 0],
  },
  livingRoom2: {
    id: "livingRoom2",
    name: "Living Room 2",
    panorama: panoramaPath("LivingRoom2"),
    position: [-128.454502, 302.287795, 86.104447],
    rotationDeg: [0, -54.529848, 0],
  },
  livingRoom3: {
    id: "livingRoom3",
    name: "Living Room 3",
    panorama: panoramaPath("LivingRoom3"),
    position: [-29.767753, 85.301647, 97.514493],
    rotationDeg: [0, 127.800009, 0],
  },
  hallway1: {
    id: "hallway1",
    name: "Hallway 1",
    panorama: panoramaPath("Hallway1"),
    position: [-209.546016, -2.167607, 126.186866],
    rotationDeg: [0, -136.772048, 0],
  },
  hallway2: {
    id: "hallway2",
    name: "Hallway 2",
    panorama: panoramaPath("Hallway2"),
    position: [-419.495699, -21.543695, 133.442306],
    rotationDeg: [0, 50.399293, 0],
  },
  bedroom1: {
    id: "bedroom1",
    name: "Bedroom 1",
    panorama: panoramaPath("Bedroom1"),
    position: [-647.021949, 346.077815, 95.751008],
    rotationDeg: [0, 146.627952, 0],
  },
  bedroom2: {
    id: "bedroom2",
    name: "Bedroom 2",
    panorama: panoramaPath("Bedroom2"),
    position: [-463.999576, 467.312206, 89.602186],
    rotationDeg: [0, -152.989429, 0],
  },
  bedroom3: {
    id: "bedroom3",
    name: "Bedroom 3",
    panorama: panoramaPath("Bedroom3"),
    position: [-816.674096, 322.787404, 119.176019],
    rotationDeg: [0, 0, 0],
  },
};

export const DEFAULT_PANORAMA_ID = "livingRoom1";
