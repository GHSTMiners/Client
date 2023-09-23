import GameControls from "components/GameControls";
import KeyboardLayoutToggle from "components/KeyboardLayoutToggle";
import { VOLUMENPOWERORDER } from "helpers/vars";
import useMusicManager from "hooks/useMusicManager";
import useSoundFXManager from "hooks/useSoundFXManager";
import useVisible from "hooks/useVisible";
import Slider from "rc-slider";
import Client from "matchmaking/Client";
import { useGlobalStore } from "store";
import styles from "./styles.module.css"
import MainScene from "game/Scenes/MainScene";

const Settings = () => {
    const menuVisibility = useVisible('menu', false); 
    const musicManager = useMusicManager();
    const soundFXManager = useSoundFXManager();
    const musicVolume = useGlobalStore( state => state.musicVolume );
    const soundFXVolume = useGlobalStore( state => state.soundFXVolume );
    
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

    return(
        
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
              <Slider max={1} step={0.01} value={ Math.pow( soundFXVolume, 1/ VOLUMENPOWERORDER ) } onChange={updateSoundFXVolume} />
            </div>
            <div className={styles.volumeSlider}>
              <span className={styles.menuEntryTitle}> Music</span>
              <Slider max={1} step={0.01} value={ Math.pow( musicVolume, 1/ VOLUMENPOWERORDER ) } onChange={updateMusicVolume} />
            </div>
          </div>
          <div className={styles.leaveContainer}>
            <button className={styles.leaveButton} onClick={leaveGame}>LEAVE GAME</button>
          </div>
        </div>
      </div>
    </div>
    )
}

export default Settings