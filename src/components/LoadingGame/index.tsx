import { useEffect, useState } from "react";
import { useGlobalStore } from "store"
import Client from "matchmaking/Client";
import gameEvents from "game/helpers/gameEvents";
import styles from "./styles.module.css"
import ReactPlayer from "react-player";
import Config from "config";

const LoadingGame = () =>{
  const isGameLoaded = useGlobalStore( state => state.isGameLoaded);
  const [loadingPercentage, setLoadingPercentage] = useState<number>(0);
  const loadingVideoURL = `${Config.storageURL}/${Client.getInstance().chiselWorld.teaser}`;

    // Declaring event listeners
    useEffect(() => {
      const handleLoadingBar = (percentage:number) => setLoadingPercentage(percentage);
      Client.getInstance().phaserGame.events.on( gameEvents.phaser.LOADING, handleLoadingBar );
      
      return () => {
        Client.getInstance().phaserGame.events.off(gameEvents.phaser.LOADING, handleLoadingBar );
      }
    }, []);
  
    return(
      <div className={`${styles.loadingScene} ${isGameLoaded? styles.hidden : styles.reveal }`}>
        <div className={styles.loadingText} hidden={isGameLoaded}>
          { loadingPercentage < 100 ? 'Loading game...': 'Waiting for other players' }
        </div>
        <div className={styles.progressBar} hidden={isGameLoaded}>
            <div className={styles.progressValue} style={{width: `${loadingPercentage}%`}} />
         </div>
         <div className={styles.videoContainer}>
          <ReactPlayer url={loadingVideoURL} playing={!isGameLoaded} muted={false} width={'100%'} height={'100%'} />
         </div>
      </div>
    )
}

export default LoadingGame