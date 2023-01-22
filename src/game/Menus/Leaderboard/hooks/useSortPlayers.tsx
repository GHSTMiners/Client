import { useEffect, useState } from "react";
import { IndexedArray, IndexedPlayers, PlayerBalance } from "types";
import { useGlobalStore } from "store";

const useSortPlayers = (players:IndexedPlayers, refresh:boolean):{ sortedPlayers : number[]} => {
    
    const [sortedPlayers, setSortedPlayers] = useState<number[]>([]);
    const worldCrypto = useGlobalStore( store => store.worldCrypto );
    
    useEffect(()=>{
        if (players){
            const unsortedkeys = Object.keys(players);
            let unsortedData: PlayerBalance[] = [];
            
            unsortedkeys.forEach( playerEntry =>{
                let playerWallet: IndexedArray = {};
                players[playerEntry].wallet.forEach( entry => playerWallet[entry.cryptoID]=entry.amount );
                const playerTotal = Object.keys( playerWallet ).reduce( 
                    (accumulated, key) =>  playerWallet[key] * worldCrypto[key].price + accumulated, 0  )
                unsortedData.push({playerId:+playerEntry,total:playerTotal})
            })
            
            const sortedData = unsortedData.sort((entry1,entry2)=> entry2.total - entry1.total)
            const sortedIds = sortedData.map( entry => entry.playerId);
            setSortedPlayers([...sortedIds]);
        }
    },[players,worldCrypto,refresh])

    return { sortedPlayers }
}

export default useSortPlayers