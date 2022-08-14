import Client from "matchmaking/Client";
import MainScene from "game/Scenes/MainScene";

const useSoundFXManager = () => {
  
  const soundFXManager = (Client.getInstance().phaserGame?.scene.getScene('MainScene') as MainScene)?.soundFXManager;
  
  const playLowFuel = () => {
    soundFXManager?.playLowFuel()
  }

  return { playLowFuel }
}

export default useSoundFXManager