import Client from "matchmaking/Client";
import MainScene from "game/Scenes/MainScene";

const useSoundFXManager = () => {
  
  const soundFXManager = (Client.getInstance().phaserGame?.scene.getScene('MainScene') as MainScene)?.soundFXManager;
  
  const playSound = (key:string) => {
    soundFXManager?.playSound(key)
  }

  const setVolume = (value:number) =>{
    soundFXManager?.setVolume(value);
  }

  return { playSound , setVolume }
}

export default useSoundFXManager