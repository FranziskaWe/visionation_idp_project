export function createRoomManager({ rooms, pano, modelManager, hotspotManager, interaction, onRoomChanged }) {
  let currentRoomId = null;
  let isTransitioning = false;

  async function setRoom(id) {
    if (isTransitioning || id === currentRoomId) return;
    const room = rooms[id];

    if (!room) {
      console.warn(`Room "${id}" does not exist.`);
      return;
    }

    isTransitioning = true;

    try {
      await pano.setPanorama(room.panorama);
      await modelManager.setModel(room.model);

      const hotspots = hotspotManager.setHotspots(room.hotspots || []);
      interaction.setInteractables(hotspots);

      currentRoomId = id;
      if (onRoomChanged) onRoomChanged(room);
    } finally {
      isTransitioning = false;
    }
  }

  interaction.setOnSelect((hotspot) => {
    if (hotspot?.userData?.target) {
      setRoom(hotspot.userData.target);
    }
  });

  return {
    setRoom,
    getCurrentRoom: () => rooms[currentRoomId] || null,
  };
}
