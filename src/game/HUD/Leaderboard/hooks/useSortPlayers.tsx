import Client from "matchmaking/Client";
import { useEffect, useState } from "react";
import { IndexedPlayers, playerObj } from "types";

const useSortPlayers = (players:IndexedPlayers)=>{
    
    const [sortedPlayers, setSortedPlayers] = useState<number[]>([]);
    const worldCryptoId: string = Client.getInstance().chiselWorld.world_crypto_id.toString();
    
    useEffect(()=>{
        // Sorting players ids based on their GGEMS balance
        if (players){
            const unsortedkeys = Object.keys(players);
            let unsortedData: playerObj[] = [];
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
    },[players,worldCryptoId])

    return { sortedPlayers }
}

export default useSortPlayers