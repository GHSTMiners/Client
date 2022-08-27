import { useState, useEffect, createContext } from "react";
import { Chat } from "components/Chat";
import GameLeaderboard from "./Leaderboard";
import Vitals from "./Vitals";
import Diagnostics from "./Diagnostics";
import Console from "./Console";
import Exchange from "./Exchange";
import Menu from "./Menu";
import Shop from "./Shop";
import Client from "matchmaking/Client";
import { PlayerContext, PlayerVitals } from "types";
import styles from "./styles.module.css";
import gameEvents from "game/helpers/gameEvents";
import usePlayerCrypto from "hooks/usePlayerCrypto";
import useWorldCrypto from "hooks/useWorldCrypto";
import useWorldExplosives from "hooks/useWorldExplosives";
import usePlayerExplosives from "hooks/usePlayerExplosives";
import usePlayerDepth from "hooks/usePlayerDepth";
import Vignette from "./Vignette";
import RefineCryptoFX from "./Animations/RefineCryptoFX";
import usePlayerVitals from "hooks/usePlayerVitals";
import usePlayerCargo from "hooks/usePlayerCargo";
import MinedCryptoFX from "./Animations/MinedCryptoFX";


export const HUDContext = createContext<PlayerContext>({ 
  world:  { crypto: {}, explosives: {} } , 
  player: { crypto: {}, 
            explosives: {}, 
            depth: 0 , 
            vitals : {} as PlayerVitals,
            crystals: {} }  
});

export const HUD = () => {  
  const { worldExplosives } = useWorldExplosives();
  const { playerExplosives } = usePlayerExplosives();
  const playerVitals = usePlayerVitals();
  const playerCargo = usePlayerCargo();
  const { playerDepth } = usePlayerDepth();
  const [gameLoaded, setgameLoaded] = useState(false);
  const [loadingPercentage, setLoadingPercentage] = useState<number>(0);
  const [cryptoRecord] = useWorldCrypto();
  const {walletBalance, setWalletBalance} = usePlayerCrypto();
  
  useEffect(()=>{
    (Object.keys(cryptoRecord)).forEach((id)=> setWalletBalance( s => {s[+id]=0; return s}) )
    // eslint-disable-next-line react-hooks/exhaustive-deps
  },[cryptoRecord])

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

  }, [playerExplosives]);

  return (
    <>
      <div className={`${styles.loadingScene} ${gameLoaded? styles.hidden : styles.reveal }`} >
        {loadingBar(loadingPercentage)}
      </div>
      <div className={`${styles.hudContainer} ${!gameLoaded? styles.hidden : styles.reveal }`} 
           onClick={e => handleClick(e)}
           id="game-background"
           hidden={!gameLoaded}>
        <HUDContext.Provider value={{ 
              world:  { crypto: cryptoRecord,  explosives: worldExplosives} , 
              player: { crypto: walletBalance, 
                        explosives: playerExplosives, 
                        depth: playerDepth, 
                        vitals: playerVitals,
                        crystals: playerCargo.balance
                      } 
              }}>
          {/* EFFECTS */}
          <RefineCryptoFX />
          <MinedCryptoFX />
          <Vignette />
          {/* PERMANENT HUD ELEMENTS */}
          <Vitals />
          <Console />
          <Chat gameMode={true} />
          <Menu />
          {/* DIALOGS HUD */}
          <Shop />
          <Exchange hidden={true} />
          <GameLeaderboard hidden={true} />
          <Diagnostics hidden={true} />
        </HUDContext.Provider>
      </div> 
    </>
  );
};
