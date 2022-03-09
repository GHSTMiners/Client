import styles from "./styles.module.css";
import Client from "matchmaking/Client";
import { useState, useEffect } from "react";
import VitalsConsole from "./VitalsConsole";
import MainConsole from "./MainConsole";
import MiningShop from "../MiningShop";

export const HUD = () => {
  const [gameLoaded, setgameLoaded] = useState(false);
  const [loadingPercentage, setLoadingPercentage] = useState<number>(0);

  const handleLoadingBar = (percentage:number) => {
    setLoadingPercentage(percentage)
  }

  const loadingBar = (value:number) =>{
    return(
        <div className={styles.progressBar} hidden={gameLoaded}>
          <div className={styles.progressValue} style={{width: `${value}%`}}></div>
       </div>
    )
  }

  useEffect(() => {
    Client.getInstance().phaserGame.events.on("loading", handleLoadingBar );
    // Display HUD only when the main scene was loaded
    Client.getInstance().phaserGame.events.on("mainscene_ready", () => {setgameLoaded(true)});
  }, []);

  return (
    <>
      <div className={`${styles.loadingScene} ${gameLoaded? styles.hidden : '' }`} >
        {loadingBar(loadingPercentage)}
      </div>
      <div className={styles.hudContainer} hidden={!gameLoaded}>
        <VitalsConsole />
        <MainConsole />
        <MiningShop />
      </div> 
    </>
  );
};
