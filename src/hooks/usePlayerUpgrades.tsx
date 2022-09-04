import { useEffect, useState } from "react";
import Client from "matchmaking/Client";
import { IndexedArray } from "types";
import gameEvents from "game/helpers/gameEvents";

const usePlayerUpgrades = () => {

    const [currentTiers, setCurrentTiers] = useState<IndexedArray>({});

    useEffect(()=>{
        
        const updatePlayerTiers = (id:number,value:number) => {
            setCurrentTiers( (state) => { state[id]=value;  return {...state}  } );
        }
        
        //const getPlayerUpgrades = () => {
            Client.getInstance().ownPlayer.upgrades.forEach( (upgrade) => {
                updatePlayerTiers(upgrade.id,upgrade.tier);
                upgrade.onChange = () => {
                    updatePlayerTiers(upgrade.id,upgrade.tier);
                    console.log(`Upgrade updated! ID: ${upgrade.id} to tier ${upgrade.tier}`)
                } 
            });
        //}
        /*
        Client.getInstance().phaserGame.events.on( gameEvents.room.JOINED, getPlayerUpgrades);
  
        return () => {
          Client.getInstance().phaserGame.events.off( gameEvents.room.JOINED , getPlayerUpgrades);
        }
        */
    },[])

    return { currentTiers , setCurrentTiers }
}

export default usePlayerUpgrades