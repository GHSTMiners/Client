import Client from "matchmaking/Client";
import MainScene from "game/Scenes/MainScene";

const useSoundFXManager = () => {
  
  const soundFXManager = (Client.getInstance().phaserGame?.scene.getScene('MainScene') as MainScene)?.soundFXManager;
  
  const play = (key:string) => {
    soundFXManager?.play(key)
  }

  const setVolume = (value:number) =>{
    soundFXManager?.setVolume( Math.pow(value,4) );
  }

  return { play , setVolume }
}

export default useSoundFXManager