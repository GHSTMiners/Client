import Client from "matchmaking/Client";
import MainScene from "game/Scenes/MainScene";
import { useGlobalStore } from "store";
import { VOLUMENPOWERORDER } from "helpers/vars";

const useSoundFXManager = () => {
  
  const soundFXManager = (Client.getInstance().phaserGame?.scene.getScene('MainScene') as MainScene)?.soundFXManager;
 
  const play = (key:string) => {
    soundFXManager?.play(key)
  }

  const setVolume = (value:number) =>{
    soundFXManager?.setVolume( Math.pow(value,4) );
  }

  const getVolume = () =>{
    const rawVolume = useGlobalStore.getState().soundFXVolume;
    return Math.pow( rawVolume, 1/VOLUMENPOWERORDER ) ;
  }

  return { play , setVolume , getVolume }
}

export default useSoundFXManager