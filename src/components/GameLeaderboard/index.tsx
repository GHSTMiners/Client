import styles from "./styles.module.css";
import Client from "matchmaking/Client";
import React, { useEffect, useState } from "react";
import { IndexedArray } from "types";
import { Player } from "matchmaking/Schemas/Player";


interface Props {
  hidden: boolean;
}

const GameLeaderboard : React.FC<Props> = ({ hidden }) => {
    
    type IndexedPlayers =  {[key: string]: Player} ;

    const [displayLeaderboard,setDisplayLeaderboard] = useState(!hidden);
    const [players, setPlayers] = useState<IndexedPlayers>({});
    const worldCryptoId: string = Client.getInstance().chiselWorld.world_crypto_id.toString();


    useEffect(()=>{
        Client.getInstance().phaserGame.events.on( "open_leaderboard", ()=> {setDisplayLeaderboard(true); console.log('opening leaderboard')});
        Client.getInstance().phaserGame.events.on("close_leaderboard", ()=> {setDisplayLeaderboard(false); console.log('closing leaderboard') });
        if ( Client.getInstance().colyseusRoom){
            Client.getInstance().colyseusRoom.state.players.onAdd = ( newPlayer, key ) => { players[key]=newPlayer } ;
            Client.getInstance().colyseusRoom.state.players.onChange = (modPlayer , key )=>{ players[key]=modPlayer } }
    },[])

      // List of players to be displayed in the UI
    const playerIDs = Object.keys(players)

    const renderPlayerInfo = (id:number) => {

        let playerGGEMS = players[id].wallet.get(worldCryptoId)?.amount;        
        
        return(
        <>
        <div className={styles.playerEntry} key={id}>
            <div>
                Rank
            </div>            
            <div>
                {players[id].name}
            </div>
            <div>
                {playerGGEMS? playerGGEMS: 0 } GGEMS
            </div>
            <div>
                Upgrades
            </div>
            <div>
                Deaths
            </div>
        </div>
        </>
        )
    }

    return(
    <div className={`${styles.leaderboardContainer} ${displayLeaderboard? styles.displayOn:styles.displayOff}`}>
       
        {   playerIDs.map( (id) => { 
            return( renderPlayerInfo(+id)) }
            )
        }
    </div>
    )
};

export default GameLeaderboard;
