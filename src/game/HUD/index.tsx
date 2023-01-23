import Chat from "components/Chat";
import Vitals from "./Vitals";
import Diagnostics from "./Diagnostics";
import Console from "./Console";
import Score from "./Score";
import Client from "matchmaking/Client";
import styles from "./styles.module.css";
import gameEvents from "game/helpers/gameEvents";
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
          <Vitals />
          <Console />
          <Chat />
          <Score />
          <Diagnostics hidden={true} />
      </div> 
    </>
  );
};
