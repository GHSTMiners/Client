import Client from "matchmaking/Client";
import MainScene from "game/Scenes/MainScene";

const useSoundFXManager = () => {
  
  const soundFXManager = (Client.getInstance().phaserGame?.scene.getScene('MainScene') as MainScene)?.soundFXManager;
  const volumePowerOrder = 4 // to get a exponential feeling for the volume slider, more natural
  
  const play = (key:string) => {
    soundFXManager?.play(key)
  }

  const setVolume = (value:number) =>{
    soundFXManager?.setVolume( Math.pow(value,4) );
  }

  const getVolume = () =>{
    const rawVolume = soundFXManager?.getVolume();
    return rawVolume? Math.pow( rawVolume, 1/volumePowerOrder ): 1 ;
  }

  return { play , setVolume , getVolume }
}

export default useSoundFXManager