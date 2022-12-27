import { useEffect, useState } from "react";
import Client from "matchmaking/Client";
import MainScene from "game/Scenes/MainScene";
import gameEvents from "game/helpers/gameEvents";

const useMusicManager = () => {
  
  const [currentSong , setCurrentSong] = useState<string>('');
  const musicManager = (Client.getInstance().phaserGame?.scene.getScene('MainScene') as MainScene)?.musicManager;
  const volumePowerOrder = 4 // to get a exponential feeling for the volume slider, more natural

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
    musicManager?.setVolume( Math.pow(value,volumePowerOrder) );
  }

  const getVolume = () =>{
    const rawVolume = musicManager?.getVolume();
    return rawVolume? Math.pow( rawVolume, 1/volumePowerOrder ): 0.5 ;
  }

  const stop = () => {
    musicManager?.stop();
  }

  return {currentSong, next, setVolume, getVolume, stop}

}

export default useMusicManager