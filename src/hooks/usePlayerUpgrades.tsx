import { useEffect, useState } from "react";
import Client from "matchmaking/Client";
import { IndexedArray } from "types";

const usePlayerUpgrades = () => {

    const [currentTiers, setCurrentTiers] = useState<IndexedArray>({});

    useEffect(()=>{
        
        const updatePlayerTiers = (id:number,value:number) => {
            setCurrentTiers( (state) => { state[id]=value;  return {...state}  } );
        }
        
        Client.getInstance().ownPlayer.upgrades.forEach( (upgrade) => {
            updatePlayerTiers(upgrade.id,upgrade.tier);
            upgrade.onChange = () => {
                updatePlayerTiers(upgrade.id,upgrade.tier);
                console.log(`Upgrade updated! ID: ${upgrade.id} to tier ${upgrade.tier}`)
            } 
        });
    
    },[])

    return { currentTiers , setCurrentTiers }
}

export default usePlayerUpgrades