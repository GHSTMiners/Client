import React, { useContext, useEffect, useState } from "react";
import styles from "./styles.module.css";
import Client from "matchmaking/Client";
import useVisible from "hooks/useVisible";
import renderPlayerInfo from "./helpers/renderPlayerInfo";
import useSortPlayers from "./hooks/useSortPlayers";
import { Player } from "matchmaking/Schemas";
import { IndexedPlayers } from "types";
import { HUDContext } from "..";

interface Props {
    hidden: boolean;
  }
  
  const GameLeaderboard : React.FC<Props> = ({ hidden }) => { 

    const leaderboardVisibility = useVisible('leaderboard', !hidden);
    const hudContext = useContext(HUDContext); 
    const [ players , setPlayers] = useState({} as IndexedPlayers);
    const {sortedPlayers} = useSortPlayers(players, leaderboardVisibility.state );

    useEffect(()=>{
        function updatePlayerList(player:Player){
            setPlayers( state => {
                state[player.gotchiID]=player; 
                return({...state})
            })
        }

        if ( Client.getInstance().colyseusRoom){
            Client.getInstance().colyseusRoom.state.players.onAdd = (player) => { updatePlayerList(player) }
            Client.getInstance().colyseusRoom.state.players.onChange = (player) => { updatePlayerList(player) }
        } 
    },[players])

    return(
    <div className={`${styles.leaderboardContainer} ${leaderboardVisibility.state? styles.displayOn:styles.displayOff}`}>
       
        <div className={styles.tableHeader}>
            <div>Rank</div>
            <div>Gotchi</div>
            <div>$</div>
            <div>Upgrades</div>
        </div>

        { sortedPlayers.map( (id) =>  renderPlayerInfo(+id, players, sortedPlayers, hudContext.world.crypto )) }

    </div>
    )
};

export default GameLeaderboard
