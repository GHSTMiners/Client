import { useContext } from "react";
import Client from "matchmaking/Client";
import styles from "./styles.module.css";
import gearIcon from "assets/icons/gear.svg";
import Slider from 'rc-slider';
import 'rc-slider/assets/index.css';
import { useNavigate } from "react-router-dom";
import Marquee from "react-easy-marquee";
import gameEvents from "game/helpers/gameEvents";
import useVisible from "hooks/useVisible";
import leaderboardIcon from "assets/icons/top_players_blue.svg"
import { HUDContext } from "..";
import useMusicManager from "hooks/useMusicManager";

const Menu = () => {
  
  const menuVisibility = useVisible('menu', false); 
  const musicManager = useMusicManager();
  const navigator = useNavigate();
  const hudContext = useContext(HUDContext);
  const playerTotalCrypto = Math.round(hudContext.player.total*10)/10;

  const updateMusicVolume = (volume:number | number[]) =>{
    if (typeof volume === "number") {
      musicManager.setVolume(volume);
    } else {
      musicManager.setVolume(volume[0])
    } 
  }

  const leaveGame = () => {
    Client.getInstance().colyseusRoom.leave();
    navigator('/')
   }

          
  return (
    <>
      <div className={styles.playerMenuBarContainer}>

        <div className={styles.playerMenuBar}>
          
          <div className={styles.mainPlayerBalance}
              onClick={ () => Client.getInstance().phaserGame.events.emit( gameEvents.exchange.SHOW)  }
              key={'Tota_Worth_Value'}>
            $ {playerTotalCrypto}
          </div>

          <div className={styles.coinThumbnailContainer}
              onClick={ () => Client.getInstance().phaserGame.events.emit( gameEvents.exchange.SHOW)  }
              key={'Thumbnail_cointainer'}>
            { Object.keys(hudContext.player.crypto)
                .filter( key => hudContext.player.crypto[key]>0 )
                .map( cryptoKey => 
                  <img src={hudContext.world.crypto[cryptoKey].image} 
                    className={styles.coinThumbnail}
                    alt={`${hudContext.world.crypto[cryptoKey].name}_thumbnail`}  
                    key={`coin_thumbnail_${cryptoKey}`}/>
              )
            }
          </div>
          
          <div className={styles.leaderboardShortcut} onClick={()=> Client.getInstance().phaserGame.events.emit( gameEvents.leaderboard.SHOW ) }>
            <img src={leaderboardIcon} className={styles.leaderboardIcon} alt={'Open/Close Room Leaderboard'}/> 
          </div>

          <div className={styles.menuButton} onClick={ menuVisibility.show }>
            <img src={gearIcon} className={styles.gearIcon} alt={'Settings'}/> 
          </div>
        </div>

        <div className={styles.soundtrack} onClick={musicManager.next}>
          <div className={styles.soundtrackText}>
            <Marquee duration={30000}>
                 Playing {musicManager.currentSong}
            </Marquee>
          </div>   
        </div>
        
      </div>

      <div className={styles.fullScreenMenu} hidden={!menuVisibility.state}>
        <div className={styles.menuDialogContainer}>
          <button className={styles.closeButton} onClick={ menuVisibility.hide }>X</button>
          <div className={styles.volumeSlider}>
            <span className={styles.menuEntryTitle}> Sound FX </span>
            <Slider max={1} step={0.01} defaultValue={1} />
          </div>
          <div className={styles.volumeSlider}>
            <span className={styles.menuEntryTitle}> Music</span>
            <Slider max={1} step={0.01} defaultValue={1} onChange={updateMusicVolume} />
          </div>
          
          <button className={styles.leaveButton} onClick={leaveGame}>LEAVE GAME</button>
          
        </div>
      </div>
    </>
  );
};

export default Menu