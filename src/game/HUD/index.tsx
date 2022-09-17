import { useState, useEffect } from "react";
import Chat from "components/Chat";
import GameLeaderboard from "./Leaderboard";
import Vitals from "./Vitals";
import Diagnostics from "./Diagnostics";
import Console from "./Console";
import Menu from "./Menu";
import Shop from "./Shop";
import Client from "matchmaking/Client";
import styles from "./styles.module.css";
import gameEvents from "game/helpers/gameEvents";
import Vignette from "./Vignette";
import RefineCryptoFX from "./Animations/RefineCryptoFX";
import MinedCryptoFX from "./Animations/MinedCryptoFX";

export const HUD = () => {  
  const [gameLoaded, setgameLoaded] = useState(false);
  const [loadingPercentage, setLoadingPercentage] = useState<number>(0);

  const loadingBar = (value:number) =>{
    return(
        <div className={styles.progressBar} hidden={gameLoaded}>
          <div className={styles.progressValue} style={{width: `${value}%`}}></div>
       </div>
    )
  }

  function handleClick (event:any ) {
    // if the user clicks on the background, all open dialogs are closed
    const divID = event.target.getAttribute('id');
    if (divID === 'game-background'){
      Client.getInstance().phaserGame.events.emit( gameEvents.chat.HIDE);
      Client.getInstance().phaserGame.events.emit( gameEvents.dialogs.HIDE);
    }
  }

  // Declaring event listeners
  useEffect(() => {
    const setGameReady = () => {setgameLoaded(true)};
    const handleLoadingBar = (percentage:number) => setLoadingPercentage(percentage);

    Client.getInstance().phaserGame.events.on( gameEvents.phaser.LOADING, handleLoadingBar );
    Client.getInstance().phaserGame.events.on( gameEvents.phaser.MAINSCENE, setGameReady);

    return () => {
      Client.getInstance().phaserGame.events.off(gameEvents.phaser.LOADING, handleLoadingBar );
      Client.getInstance().phaserGame.events.off(gameEvents.phaser.MAINSCENE, setGameReady);
    }
  }, []);

  const loadingImgURL = `https://chisel.gotchiminer.rocks/storage/${Client.getInstance().chiselWorld.thumbnail}`;

  return (
    <>
      <div className={`${styles.loadingScene} ${gameLoaded? styles.hidden : styles.reveal }`} >
        <div className={styles.loadingText}>{!gameLoaded?'Loading game...':''}</div>
        {loadingBar(loadingPercentage)}
        <img src={loadingImgURL} 
            alt={'world preview'}
            className={styles.backgroundImage}/>
      </div>
      <div className={`${styles.hudContainer} ${!gameLoaded? styles.hidden : styles.reveal }`} 
           onClick={e => handleClick(e)}
           id="game-background"
           hidden={!gameLoaded}>
          {/* EFFECTS */}
          <RefineCryptoFX />
          <MinedCryptoFX />
          <Vignette />
          {/* PERMANENT HUD ELEMENTS */}
          <Vitals />
          <Console />
          <Chat />
          <Menu />
          {/* DIALOGS HUD */}
          <Shop />
          <GameLeaderboard hidden={true} />
          <Diagnostics hidden={true} />
      </div> 
    </>
  );
};
