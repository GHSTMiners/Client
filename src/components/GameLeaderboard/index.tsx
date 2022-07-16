import styles from "./styles.module.css";
import Client from "matchmaking/Client";
import React, { useEffect, useState } from "react";
import { IndexedArray } from "types";
import { Player } from "matchmaking/Schemas/Player";
import { GotchiSVG } from "components/GotchiSVG";


interface Props {
  hidden: boolean;
}

const GameLeaderboard : React.FC<Props> = ({ hidden }) => {
    
    type IndexedPlayers =  {[key: string]: Player} ;
    type playerObj = {playerId: number, ggems: number };

    const [displayLeaderboard,setDisplayLeaderboard] = useState(!hidden);
    const [players, setPlayers] = useState<IndexedPlayers>({});
    const [sortedPlayers, setSortedPlayers] = useState<number[]>([]);
    const worldCryptoId: string = Client.getInstance().chiselWorld.world_crypto_id.toString();


    useEffect(()=>{
        Client.getInstance().phaserGame.events.on( "open_leaderboard", ()=> {setDisplayLeaderboard(true); console.log('opening leaderboard')});
        Client.getInstance().phaserGame.events.on("close_leaderboard", ()=> {setDisplayLeaderboard(false); console.log('closing leaderboard') });
        if ( Client.getInstance().colyseusRoom){
            Client.getInstance().colyseusRoom.state.players.onAdd = ( newPlayer, key ) => { players[newPlayer.gotchiID]=newPlayer } ;
            Client.getInstance().colyseusRoom.state.players.onChange = (modPlayer , key )=>{ players[modPlayer.gotchiID]=modPlayer } }
    },[])

    
      // List of players to be displayed in the UI
      const playerIDs = Object.keys(players)

    // Hook to sort players depending on their score
    useEffect(()=>{
        //const sortedDisplayData = data.sort((n1,n2) => n2.score - n1.score);
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
            setSortedPlayers(sortedIds);
        }
    },[players])


    const renderPlayerInfo = (id:number) => {

        let playerGGEMS = players[id].wallet.get(worldCryptoId)?.amount;
        const playerRank = sortedPlayers.findIndex( element => element===id) +1 ;        
        return(
        <>
        <div className={styles.playerEntry} key={id}>
            <div>
                {playerRank}
            </div>            
            <div className={styles.gotchi}>
                {/*players[id].name*/}
                <div className={styles.gotchiPreviewContainer}>
                <GotchiSVG
                        side={0}
                        tokenId={players[id].gotchiID.toString()}
                        options={{ animate: false, removeBg: true }}
                      />
                </div>
                {players[id].name}
            </div>
            <div>
                {playerGGEMS? playerGGEMS: 0 } 
            </div>
            <div>
                
            </div>
        </div>
        </>
        )
    }

    return(
    <div className={`${styles.leaderboardContainer} ${displayLeaderboard? styles.displayOn:styles.displayOff}`}>
       
       <div className={styles.tableHeader}>
        <div>Rank</div>
        <div>Gotchi</div>
        <div>GGEMS</div>
        <div>Upgrades</div>
       </div>

        {   playerIDs.map( (id) => { 
            return( renderPlayerInfo(+id)) }
            )
        }

    </div>
    )
};

export default GameLeaderboard;
