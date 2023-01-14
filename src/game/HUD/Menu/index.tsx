import Client from "matchmaking/Client";
import styles from "./styles.module.css";
import gearIcon from "assets/icons/gear.svg";
import Slider from 'rc-slider';
import 'rc-slider/assets/index.css';
import Marquee from "react-easy-marquee";
import gameEvents from "game/helpers/gameEvents";
import useVisible from "hooks/useVisible";
import leaderboardIcon from "assets/icons/top_players_blue.svg"
import useMusicManager from "hooks/useMusicManager";
import { useGlobalStore } from "store";
import useSoundFXManager from "hooks/useSoundFXManager";
import MainScene from "game/Scenes/MainScene";
import GameControls from "components/GameControls";
import KeyboardLayoutToggle from "components/KeyboardLayoutToggle";

const Menu = () => {
  
  const menuVisibility = useVisible('menu', false); 
  const musicManager = useMusicManager();
  const soundFXManager = useSoundFXManager();
  const playerTotalCrypto = useGlobalStore( state => state.totalValue);
  const wallet = useGlobalStore( state => state.wallet );
  const worldCrypto = useGlobalStore( state => state.worldCrypto );
  
  const updateMusicVolume = (volume:number | number[]) =>{
    if (typeof volume === "number") {
      musicManager.setVolume(volume);
    } else {
      musicManager.setVolume(volume[0])
    } 
  }

  const updateSoundFXVolume = (volume:number | number[]) =>{
    if (typeof volume === "number") {
      soundFXManager.setVolume(volume);
    } else {
      soundFXManager.setVolume(volume[0])
    } 
  }

  function leaveGame () {
    (Client.getInstance().phaserGame?.scene.getScene('MainScene') as MainScene)?.lifeCycleManager?.requestLeave();
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
            { Object.keys(wallet)
                .filter( key => wallet[key]>0 )
                .map( cryptoKey => 
                  <img src={worldCrypto[cryptoKey].image} 
                    className={styles.coinThumbnail}
                    alt={`${worldCrypto[cryptoKey].name}_thumbnail`}  
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
          <div className={styles.menuWrapper}>
            
            <div className={styles.gameControlsContainer}>
              <div className={styles.gameControlsTitle}> Game Controls </div>
              <div className={styles.gameControlsWrapper}>
                <GameControls />
              </div>
            </div>

            <div className={styles.settingsContainer}>
              <div className={styles.keyboardLayoutWrapper}>
                <div className={styles.menuEntryTitle}> Keyboard Layout</div>
                <KeyboardLayoutToggle />
              </div>
              <div className={styles.volumeSlider}>
                <span className={styles.menuEntryTitle}> Sound FX </span>
                <Slider max={1} step={0.01} defaultValue={ soundFXManager.getVolume() } onChange={updateSoundFXVolume} />
              </div>
              <div className={styles.volumeSlider}>
                <span className={styles.menuEntryTitle}> Music</span>
                <Slider max={1} step={0.01} defaultValue={ musicManager.getVolume() } onChange={updateMusicVolume} />
              </div>
            </div>
            <div className={styles.leaveContainer}>
              <button className={styles.leaveButton} onClick={leaveGame}>LEAVE GAME</button>
            </div>
            
          
          </div>
          
        </div>
      </div>
    </>
  );
};

export default Menu