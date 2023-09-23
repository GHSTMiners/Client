import Config from "config";
import gameEvents from "game/helpers/gameEvents";
import Client from "matchmaking/Client";
import { useEffect, useState } from "react";

const usePlayerDepth = () => {

  const [ playerDepth, setPlayerDepth ] = useState(0);

  useEffect(() => {
      const playerDepthListener = () =>{
        Client.getInstance().ownPlayer.playerState.onChange = ( change ) => {
          change.forEach((value) => {
            if (value.field === "y")
              setPlayerDepth(Math.ceil(value.value / Config.blockHeight));
          });
        }
      }

      Client.getInstance().phaserGame.events.on( gameEvents.room.JOINED, playerDepthListener )
      
      return () => {
          Client.getInstance().phaserGame.events.off( gameEvents.room.JOINED, playerDepthListener )
      }
  },[])

  return { playerDepth }
}

export default usePlayerDepth