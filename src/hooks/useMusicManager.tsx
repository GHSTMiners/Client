import { useEffect, useState } from "react";
import Client from "matchmaking/Client";
import MainScene from "game/Scenes/MainScene";
import gameEvents from "game/helpers/gameEvents";

const useMusicManager = () => {
  
  const [currentSong , setCurrentSong] = useState<string>('');
  const musicManager = (Client.getInstance().phaserGame?.scene.getScene('MainScene') as MainScene)?.musicManager;

  useEffect(()=>{
    Client.getInstance().phaserGame.events.on( gameEvents.phaser.MAINSCENE, updateSong )
  },[])
  
  function updateSong(){
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
    musicManager?.setVolume(value);
  }

  const stop = () => {
    musicManager?.stop();
  }

  return {currentSong, next, setVolume, stop}

}

export default useMusicManager