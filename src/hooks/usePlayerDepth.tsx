import Config from "config";
import gameEvents from "game/helpers/gameEvents";
import Client from "matchmaking/Client";
import { useEffect, useState } from "react";

const usePlayerDepth = () => {

  const [ depth, setDepth ] = useState(0);

  useEffect(() => {
      const depthListener = () =>{
        Client.getInstance().ownPlayer.playerState.onChange = ( change ) => {
          change.forEach((value) => {
            if (value.field === "y")
              setDepth(Math.ceil(value.value / Config.blockHeight));
          });
        }
      }

      Client.getInstance().phaserGame.events.on( gameEvents.room.JOINED, depthListener )
      
      return () => {
          Client.getInstance().phaserGame.events.off( gameEvents.room.JOINED, depthListener )
      }
  },[])

  return { depth }
}

export default usePlayerDepth