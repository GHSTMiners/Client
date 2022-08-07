import styles from "./styles.module.css";
import Client from "matchmaking/Client";
import React, { useEffect, useState } from "react";
import useVisible from "hooks/useVisible";
import { IndexedPlayers, playerObj } from "types";
import renderPlayerInfo from "./helpers/renderPlayerInfo";

interface Props {
    hidden: boolean;
  }
  
  const GameLeaderboard : React.FC<Props> = ({ hidden }) => { 

    const leaderboardVisibility = useVisible('leaderboard', !hidden); 
    const [ players ] = useState<IndexedPlayers>({});
    const [sortedPlayers, setSortedPlayers] = useState<number[]>([]);
    //const {sortedPlayers} = useSortPlayers(players);
    const worldCryptoId: string = Client.getInstance().chiselWorld.world_crypto_id.toString();

    useEffect(()=>{
        if ( Client.getInstance().colyseusRoom){
            Client.getInstance().colyseusRoom.state.players.onAdd = ( newPlayer, key ) => { players[newPlayer.gotchiID]=newPlayer } ;
            Client.getInstance().colyseusRoom.state.players.onChange = (modPlayer , key )=>{ players[modPlayer.gotchiID]=modPlayer } 
        } 
    },[players])

    
    // Hook to sort players depending on their score
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
    },[leaderboardVisibility.state,players,worldCryptoId])

    return(
    <div className={`${styles.leaderboardContainer} ${leaderboardVisibility.state? styles.displayOn:styles.displayOff}`}>
       
        <div className={styles.tableHeader}>
            <div>Rank</div>
            <div>Gotchi</div>
            <div>GGEMS</div>
            <div>Upgrades</div>
        </div>

        { sortedPlayers.map( (id) =>  renderPlayerInfo(+id, players, sortedPlayers)) }

    </div>
    )
};

export default GameLeaderboard
