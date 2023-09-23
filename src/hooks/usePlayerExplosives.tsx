import gameEvents from "game/helpers/gameEvents";
import Client from "matchmaking/Client";
import { useEffect, useState } from "react";
import { IndexedArray } from "types";

const usePlayerExplosives = () => {
  
  const [playerExplosives, setPlayerExplosives] = useState<IndexedArray>({});

  useEffect(() => {

    const updateExplosives = (id:number, value:number) => {
      
      setPlayerExplosives( state => { 
        state[id]=value ; 
        return( {...state} ) })
    }

    const explosiveListeners = () => {
      Client.getInstance().ownPlayer.explosives.onAdd = (item) => {
        item.onChange = () => {updateExplosives(item.explosiveID,item.amount);} 
      };             
    }

    Client.getInstance().phaserGame.events.on( gameEvents.room.JOINED, explosiveListeners);
    
    return () => {
      Client.getInstance().phaserGame.events.off( gameEvents.room.JOINED , explosiveListeners);
    }

  }, []);
    
  return { playerExplosives }

}

export default usePlayerExplosives