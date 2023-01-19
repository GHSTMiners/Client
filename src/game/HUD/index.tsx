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
import MinedCryptoFX from "./Animations/MinedCryptoFX";
import { useGlobalStore } from "store";

export const HUD = () => {  
  const isGameLoaded = useGlobalStore( state => state.isGameLoaded );

  function handleClick (event:any ) {
    // if the user clicks on the background, all open dialogs are closed
    const divID = event.target.getAttribute('id');
    if (divID === 'game-background'){
      Client.getInstance().phaserGame.events.emit( gameEvents.chat.HIDE);
      Client.getInstance().phaserGame.events.emit( gameEvents.dialogs.HIDE);
    }
  }

  return (
    <>
      <div className={`${styles.hudContainer} ${!isGameLoaded? styles.hidden : styles.reveal }`} 
           onClick={e => handleClick(e)}
           id="game-background"
           hidden={!isGameLoaded}>
          {/* EFFECTS */}
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
