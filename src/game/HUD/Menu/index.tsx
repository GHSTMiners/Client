import { useContext, useEffect, useState } from "react";
import Client from "matchmaking/Client";
import styles from "./styles.module.css";
import ggemsIcon from "assets/icons/ggems_icon.svg";
import Slider from 'rc-slider';
import 'rc-slider/assets/index.css';
import { useNavigate } from "react-router-dom";
import Marquee from "react-fast-marquee";
import CountdownTimer  from "game/HUD/Menu/components/CountdownTimer";
import gameEvents from "game/helpers/gameEvents";
import * as Chisel from "chisel-api-interface";
import useVisible from "hooks/useVisible";
import { HUDContext } from "..";

const Menu = () => {
  
  //const [playerGGEMS, setPlayerGGEMS] = useState<number>(0);
  //const { walletBalance } = usePlayerCrypto();
  const [currentSong , setCurrentSong] = useState<string>('');
  const [playerReady] = useState(false);
  const menuVisibility = useVisible('menu', false); 
  const navigator = useNavigate();
  const playerBalance = useContext(HUDContext);
  const world: Chisel.DetailedWorld | undefined =   Client.getInstance().chiselWorld;
  
  
/*
  const updatePlayerBalance = (quantity:number) =>{
    setPlayerGGEMS(Math.round(quantity*10)/10);
  }
*/

  const updateMusicTrack = (songName:string)=>{
    setCurrentSong(songName);
  }

  const nextSong = () => {
    Client.getInstance().phaserGame.events.emit('next song')
  }

  const updateMusicVolume = (volume:number | number[]) =>{
    if (typeof volume === "number") {
      Client.getInstance().phaserGame.events.emit('music volume',volume) 
    } else {
      Client.getInstance().phaserGame.events.emit('music volume',volume[0]) 
    } 
  }

  const leaveGame = () => {
    Client.getInstance().colyseusRoom.leave();
    navigator('/')
   }

  useEffect( () => {
    Client.getInstance().phaserGame.events.on("newSong", updateMusicTrack)
    /*
    Client.getInstance().phaserGame.events.on( gameEvents.room.JOINED, () => {
      Client.getInstance().phaserGame.events.on("updated balance", updatePlayerBalance )
      setPlayerReady(true);
    });
    */
  },[]);
//
  return (
    <>
      <div className={styles.playerMenuBarContainer}>
        <div className={styles.playerMenuBar}>
          <div className={styles.mainPlayerBalance}
                onClick={ () => Client.getInstance().phaserGame.events.emit( gameEvents.exchange.SHOW)  }>
            <img src={ggemsIcon} className={styles.ggemsIcon} alt={'GGEMS'}/>
            {(world.world_crypto_id)? playerBalance.wallet[world.world_crypto_id]: '0'}
          </div>
          <CountdownTimer targetDate={ (new Date(Client.getInstance().colyseusRoom.state.gameEndUTC )) }/>

          <div className={styles.menuButton} onClick={ menuVisibility.show }>MENU</div>
        </div>
        <div onClick={nextSong}>
          <Marquee className={styles.marquee} gradient={false} play={playerReady}>
             Playing <span className={styles.songTitle}>{currentSong}</span>
          </Marquee>
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