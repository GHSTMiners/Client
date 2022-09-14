import Client from "matchmaking/Client";
import { useEffect, useState } from "react";
import { IndexedPlayers, PlayerBalance } from "types";

const useSortPlayers = (players:IndexedPlayers, refresh:boolean):{ sortedPlayers : number[]} => {
    
    const [sortedPlayers, setSortedPlayers] = useState<number[]>([]);
    
    useEffect(()=>{
        const worldCryptoId: string = Client.getInstance().chiselWorld.world_crypto_id.toString();
    
        if (players){
            const unsortedkeys = Object.keys(players);
            let unsortedData: PlayerBalance[] = [];
            
            unsortedkeys.forEach( playerEntry =>{
                let GGEMS = players[playerEntry].wallet.get(worldCryptoId);
                let id = players[playerEntry].gotchiID;
                let GGEMSbalance = 0;
                if (GGEMS) GGEMSbalance = GGEMS.amount;
                unsortedData.push({playerId:id,ggems:GGEMSbalance})
            })
            const sortedData = unsortedData.sort((entry1,entry2)=> entry2.ggems - entry1.ggems)
            const sortedIds = sortedData.map( entry => entry.playerId);
            setSortedPlayers([...sortedIds]);
        }
    },[players,refresh])

    return { sortedPlayers }
}

export default useSortPlayers