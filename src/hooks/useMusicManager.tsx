import Client from "matchmaking/Client";
import MainScene from "game/Scenes/MainScene";
import { useGlobalStore } from "store";
import { VOLUMENPOWERORDER } from "helpers/vars";

const useMusicManager = () => {
  
  const currentSong = useGlobalStore(state => state.currentSong);
  const musicManager = (Client.getInstance().phaserGame?.scene.getScene('MainScene') as MainScene)?.musicManager;

  const next = () => {
    musicManager?.next();
  }

  const setVolume = (value:number) =>{
    musicManager?.setVolume( Math.pow(value,VOLUMENPOWERORDER) );
  }

  const getVolume = () =>{
    const rawVolume = useGlobalStore.getState().musicVolume;
    return Math.pow( rawVolume, 1/ VOLUMENPOWERORDER ) ;
  }

  const stop = () => {
    musicManager?.stop();
  }

  return {currentSong, next, setVolume, getVolume, stop}

}

export default useMusicManager