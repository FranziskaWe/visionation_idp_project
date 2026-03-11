export const ROOMS = {
  lobby: {
    id: "lobby",
    name: "Lobby",
    panorama: "/MasterCam1_Stacked.jpg",
    // A single starter model placed in front of the viewer.
    model: {
      url: "/models/sample.glb",
      position: [0, -1.0, -3.2],
      rotation: [0, Math.PI * 0.15, 0],
      scale: 2.0,
    },
    hotspots: [
      {
        id: "to-gallery",
        label: "Go to Gallery",
        position: [4.5, 0.5, -8],
        target: "gallery",
      },
    ],
  },
  gallery: {
    id: "gallery",
    name: "Gallery",
    // Swap in another texture here when you add more panoramas.
    panorama: "/MasterCam1_Stacked.jpg",
    model: {
      url: "/models/sample.glb",
      position: [-1.2, -1.0, -3.6],
      rotation: [0, -Math.PI * 0.2, 0],
      scale: 1.8,
    },
    hotspots: [
      {
        id: "to-lobby",
        label: "Back to Lobby",
        position: [-4.2, 0.6, -7.5],
        target: "lobby",
      },
    ],
  },
};

export const START_ROOM = "lobby";
