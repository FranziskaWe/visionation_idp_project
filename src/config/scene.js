export const PANORAMA_STYLE = "s1";
export const COLLISION_HOUSE_MODEL = {
  url: "/models/Interior3.glb",
  position: [0, 0, 0],
  // rotationDeg: [x, y, z] => [pitch, yaw, roll] in degrees
  rotationDeg: [0, 180, 0],
  // Unreal cm -> web meter-like units (first-pass calibration scale).
  scale: 1,
};

function panoramaPath(viewName) {
  return `/assets/panoramas/${PANORAMA_STYLE}_${viewName}.jpeg`;
}

export const PANORAMA_POSES = {
  kitchen1: {
    id: "kitchen1",
    name: "Kitchen 1",
    panorama: panoramaPath("Kitchen1"),
    position: [4867.6407, -27203.7245, 11092.365],
    rotationDeg: [0, 90, 0],
    hotspots: [
      {
        id: "to-living-room",
        label: "Living Room",
        target: "livingRoom1",
        position: [4500, -27000, 10800], // raw UE world cm
      },
    ],
  },
  livingRoom1: {
    id: "livingRoom1",
    name: "Living Room 1",
    panorama: panoramaPath("LivingRoom1"),
    position: [3325.304, 32184.4237, 10221.9781],
    rotationDeg: [0, -90, 0],
  },
  livingRoom2: {
    id: "livingRoom2",
    name: "Living Room 2",
    panorama: panoramaPath("LivingRoom2"),
    position: [-12845.4502, 30228.7795, 8610.4447],
    rotationDeg: [0, -54.529848, 0],
  },
  livingRoom3: {
    id: "livingRoom3",
    name: "Living Room 3",
    panorama: panoramaPath("LivingRoom3"),
    position: [-2976.7753, 8530.1647, 9751.4493],
    rotationDeg: [0, 127.800009, 0],
  },
  hallway1: {
    id: "hallway1",
    name: "Hallway 1",
    panorama: panoramaPath("Hallway1"),
    position: [-20954.6016, -216.7607, 12618.6866],
    rotationDeg: [0, -136.772048, 0],
  },
  hallway2: {
    id: "hallway2",
    name: "Hallway 2",
    panorama: panoramaPath("Hallway2"),
    position: [-41949.5699, -2154.3695, 13344.2306],
    rotationDeg: [0, 50.399293, 0],
  },
  bedroom1: {
    id: "bedroom1",
    name: "Bedroom 1",
    panorama: panoramaPath("Bedroom1"),
    position: [-64702.1949, 34607.7815, 9575.1008],
    rotationDeg: [0, 146.627952, 0],
  },
  bedroom2: {
    id: "bedroom2",
    name: "Bedroom 2",
    panorama: panoramaPath("Bedroom2"),
    position: [-46399.9576, 46731.2206, 8960.2186],
    rotationDeg: [0, -152.989429, 0],
  },
  bedroom3: {
    id: "bedroom3",
    name: "Bedroom 3",
    panorama: panoramaPath("Bedroom3"),
    position: [-81667.4096, 32278.7404, 11917.6019],
    rotationDeg: [0, 0, 0],
  },
};

export const DEFAULT_PANORAMA_ID = "livingRoom1";
