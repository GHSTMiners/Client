import { useContext, useEffect, useState } from "react";
import Client from "matchmaking/Client";
import styles from "./styles.module.css";
import ggemsIcon from "assets/icons/ggems_icon.svg";
import gearIcon from "assets/icons/gear.svg";
import Slider from 'rc-slider';
import 'rc-slider/assets/index.css';
import { useNavigate } from "react-router-dom";
import Marquee from "react-easy-marquee";
import gameEvents from "game/helpers/gameEvents";
import * as Chisel from "chisel-api-interface";
import useVisible from "hooks/useVisible";
import leaderboardIcon from "assets/icons/top_players_blue.svg"
import { HUDContext } from "..";

const Menu = () => {
  
  const [currentSong , setCurrentSong] = useState<string>('');
  const menuVisibility = useVisible('menu', false); 
  const navigator = useNavigate();
  const playerBalance = useContext(HUDContext);
  const world: Chisel.DetailedWorld | undefined =   Client.getInstance().chiselWorld;

  const updateMusicTrack = (songName:string)=>{
    setCurrentSong(songName);
  }

  const nextSong = () => {
    Client.getInstance().phaserGame.events.emit( gameEvents.music.NEXT )
  }

  const updateMusicVolume = (volume:number | number[]) =>{
    if (typeof volume === "number") {
      Client.getInstance().phaserGame.events.emit( gameEvents.music.VOLUME ,volume) 
    } else {
      Client.getInstance().phaserGame.events.emit( gameEvents.music.VOLUME ,volume[0]) 
    } 
  }

  const leaveGame = () => {
    Client.getInstance().colyseusRoom.leave();
    navigator('/')
   }

  useEffect( () => {
    Client.getInstance().phaserGame.events.on( gameEvents.music.NEW, updateMusicTrack)
  },[]);
          
  return (
    <>
      <div className={styles.playerMenuBarContainer}>

        <div className={styles.playerMenuBar}>
          <div className={styles.mainPlayerBalance}
                onClick={ () => Client.getInstance().phaserGame.events.emit( gameEvents.exchange.SHOW)  }>
            <img src={ggemsIcon} className={styles.ggemsIcon} alt={'GGEMS'}/>
            {(world.world_crypto_id)? playerBalance.wallet[world.world_crypto_id]: '0'}
          </div>
          
          <div className={styles.leaderboardShortcut} onClick={()=> Client.getInstance().phaserGame.events.emit( gameEvents.leaderboard.SHOW ) }>
            <img src={leaderboardIcon} className={styles.leaderboardIcon} alt={'Open/Close Room Leaderboard'}/> 
          </div>

          <div className={styles.menuButton} onClick={ menuVisibility.show }>
            <img src={gearIcon} className={styles.gearIcon} alt={'Settings'}/> 
          </div>
        </div>

        <div className={styles.soundtrack} onClick={nextSong}>
          <div className={styles.soundtrackText}>
            <Marquee duration={30000}>
                 Playing {currentSong}
            </Marquee>
          </div>   
        </div>
        
      </div>



      <div className={styles.fullScreenMenu} hidden={!menuVisibility.state}>
        <div className={styles.menuDialogContainer}>
          <button className={styles.closeButton} onClick={ menuVisibility.hide }>X</button>
          <div className={styles.volumeSlider}>
            <span className={styles.menuEntryTitle}> Sound FX </span>
            <Slider />
          </div>
          <div className={styles.volumeSlider}>
            <span className={styles.menuEntryTitle}> Music</span>
            <Slider max={1} step={0.01} onChange={updateMusicVolume} />
          </div>
          
          <button className={styles.leaveButton} onClick={leaveGame}>LEAVE GAME</button>
          
        </div>
      </div>
    </>
  );
};

export default Menu