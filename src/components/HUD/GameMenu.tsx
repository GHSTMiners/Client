import { useEffect, useState } from "react";
import Client from "matchmaking/Client";
import styles from "./styles.module.css";
import ggemsIcon from "assets/icons/ggems_icon.svg";
import Slider from 'rc-slider';
import 'rc-slider/assets/index.css';
import { useNavigate } from "react-router-dom";
import Marquee from "react-fast-marquee";
import CountdownTimer  from "components/CountdownTimer";

const GameMenu = () => {
  
  const [playerGGEMS, setPlayerGGEMS] = useState<number>(0);
  const [showMenu, setShowMenu] = useState(false);
  const [currentSong , setCurrentSong] = useState<string>('');
  const [playerReady, setPlayerReady] = useState(false);
  const navigator = useNavigate();
  

  const updatePlayerBalance = (quantity:number) =>{
    setPlayerGGEMS(Math.round(quantity*10)/10);
  }

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
    Client.getInstance().phaserGame.events.on("joined_game", () => {
      Client.getInstance().phaserGame.events.on("updated balance", updatePlayerBalance )
      setPlayerReady(true);
    });
  },[]);

  return (
    <>
      <div className={styles.playerMenuBarContainer}>
        <div className={styles.playerMenuBar}>
          <div className={styles.mainPlayerBalance}
                onClick={ () => Client.getInstance().phaserGame.events.emit("open_exchange")  }>
            <img src={ggemsIcon} className={styles.ggemsIcon} alt={'GGEMS'}/>
            {playerGGEMS}
          </div>
          <CountdownTimer targetDate={ (new Date(Client.getInstance().colyseusRoom.state.gameEndUTC )) }/>

          <div className={styles.menuButton} onClick={()=> setShowMenu(true)}>MENU</div>
        </div>
        <div onClick={nextSong}>
          <Marquee className={styles.marquee} gradient={false} play={playerReady}>
             Playing <span className={styles.songTitle}>{currentSong}</span>
          </Marquee>
        </div>
      </div>
      <div className={styles.fullScreenMenu} hidden={!showMenu}>
        <div className={styles.menuDialogContainer}>
          <button className={styles.closeButton} onClick={()=>setShowMenu(false)}>X</button>
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

export default GameMenu;
