import { useCallback, useEffect, useState } from "react";
import gameEvents from "game/helpers/gameEvents";
import Client from "matchmaking/Client";
import { GameEventKey } from "types";

const useVisible = (UIElement:GameEventKey): {state: boolean, show: ()=>void, hide: ()=>void, change: ()=>void} => {
  const [state, setState] = useState(false);

  // Methods
  const show = () => {
    setState(true);
  }

  const hide = () => {
    setState(false);
  }

  const change = useCallback( () => {
    setState(!state);
  },[state])

  // Listeners to phaser events
  useEffect(()=>{
      Client.getInstance().phaserGame.events.on(gameEvents[UIElement].SHOW, show );
      Client.getInstance().phaserGame.events.on(gameEvents[UIElement].HIDE, hide );
      Client.getInstance().phaserGame.events.on(gameEvents[UIElement].CHANGE, change );
      Client.getInstance().phaserGame.events.on(gameEvents['dialogs'].HIDE, hide );
      
    return ()=> { 
      Client.getInstance().phaserGame.events.off(gameEvents[UIElement].SHOW, show );
      Client.getInstance().phaserGame.events.off(gameEvents[UIElement].HIDE, hide );
      Client.getInstance().phaserGame.events.off(gameEvents[UIElement].CHANGE, change );
      Client.getInstance().phaserGame.events.off(gameEvents['dialogs'].HIDE, hide );
    }
  },[state,change])

    return { state,  show , hide, change} 
}

export default useVisible