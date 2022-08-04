import { useCallback, useEffect, useState } from "react";
import Client from "matchmaking/Client";

const useConsolePosition = (): {state: boolean, up: ()=>void, down: ()=>void, change: ()=>void} => {
  const [state, setState] = useState(false);

  // Methods
  const up = () => {
    setState(true);
  }

  const down = () => {
    setState(false);
  }

  const change = useCallback( () => {
    setState(!state);
  },[state])

  // Listeners to phaser events
  useEffect(()=>{
    Client.getInstance().phaserGame.events.on("change_console_state", change );
    Client.getInstance().phaserGame.events.on("close_dialogs", down );

    return ()=> { 
        Client.getInstance().phaserGame.events.off("change_console_state", change )
        Client.getInstance().phaserGame.events.off("close_dialogs", down ) 
    }
  },[state,change])

    return { state,  up , down, change} 
}

export default useConsolePosition