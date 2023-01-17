import { useEffect, useState } from "react";
import Client from "matchmaking/Client";
import MainScene from "game/Scenes/MainScene";
import gameEvents from "game/helpers/gameEvents";
import { useGlobalStore } from "store";
import { VOLUMENPOWERORDER } from "helpers/vars";

const useMusicManager = () => {
  
  const [currentSong , setCurrentSong] = useState<string>('');
  const musicManager = (Client.getInstance().phaserGame?.scene.getScene('MainScene') as MainScene)?.musicManager;
  //const volumePowerOrder = 4 // to get a exponential feeling for the volume slider, more natural

  useEffect(()=>{
    Client.getInstance().phaserGame.events.on( gameEvents.phaser.MAINSCENE, updateSong )
  },[])
  
  function updateSong(){
    console.log('About to play a new song...')
    const musicManager = (Client.getInstance().phaserGame?.scene.getScene('MainScene') as MainScene)?.musicManager;
    if (musicManager){
      const new_song = musicManager?.currentSongName();
        if (new_song)  setCurrentSong(new_song)
    }
  }
  
  const next = () => {
    musicManager?.next();
    updateSong();
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