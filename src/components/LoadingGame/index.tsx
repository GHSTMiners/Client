import { useEffect, useState } from "react";
import { useGlobalStore } from "store";
import Client from "matchmaking/Client";
import gameEvents from "game/helpers/gameEvents";
import styles from "./styles.module.css"
import ReactPlayer from "react-player";
import useCountdown from "hooks/useCountdown";
import demoVideo from "assets/videos/demo.mp4";
import helmetIcon  from "assets/icons/helmet.svg"

const tips = [
  'TIP: Bitcoin crypto crystals can be found below 400 blocks deep',
  'TIP: You can convert any of your crypto into GHST by using the top menu of the Shop',
  'TIP: If you open the console (SPACE), you can drag-and-drop explosives and consumables into the shortcut buttons',
  'TIP: Press F11 to enjoy a full-screen gaming experience',
  'TIP: Use the arrow button at the bottom of the screen to open/close the console and check your inventory',
  'TIP: You can skip the current song by clicking on the soundtrack marquee (top right)',
  'TIP: Check the room ranking by pressing-and-holding TAB or using the medal icon on the top right side',
  'TIP: The most valuable crystals are buried deep, try to start your game digging as vertical as possible',
];

const LoadingGame = () =>{
  const isGameLoaded = useGlobalStore( state => state.isGameLoaded);
  const [loadingPercentage, setLoadingPercentage] = useState<number>(0);
  const [loadedTime, setLoadedTime] = useState(new Date().getTime());
  const [tip, setTip] = useState('');
  const waitingTime = 1000 * 40;
  const {seconds} = useCountdown(new Date( loadedTime + waitingTime ), 1000);

  useEffect(() => {
    setTip(tips[Math.floor(Math.random() * tips.length)]);
  }, []);

  useEffect(()=>{
    setLoadedTime(new Date().getTime());
  },[loadingPercentage])

  // Declaring event listeners
  useEffect(() => {
    const handleLoadingBar = (percentage:number) => setLoadingPercentage(percentage);
    Client.getInstance().phaserGame.events.on( gameEvents.phaser.LOADING, handleLoadingBar );
    
    return () => {
      Client.getInstance().phaserGame.events.off(gameEvents.phaser.LOADING, handleLoadingBar );
    }
  }, []);

  return(
    <div className={`${styles.loadingScene} ${isGameLoaded? styles.hidden : styles.reveal }`} >
      <div className={styles.loadingInfoContainer}>
        <div className={styles.loadingText} hidden={isGameLoaded}>
          { loadingPercentage < 100 ? 'Loading game...': (seconds>=0) && `Waiting for other players [${seconds}s]` }
        </div>
        <div className={styles.progressBar} hidden={isGameLoaded}>
            <div className={styles.progressValue} style={{width: `${loadingPercentage}%`}} />
        </div>
      </div>
      <div className={styles.tipContainer}>
        <img src={helmetIcon} className={styles.tipIcon} alt={'TIP'} />
        <div className={styles.tipText}>
          {tip}
        </div>
      </div>
       <div className={styles.videoContainer}>
        <ReactPlayer url={demoVideo} playing={!isGameLoaded} muted={false} width={'100%'} height={'100%'} />
       </div>
    </div>
  )
}

export default LoadingGame