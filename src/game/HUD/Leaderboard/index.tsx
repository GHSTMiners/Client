import React, { useContext, useEffect, useState } from "react";
import styles from "./styles.module.css";
import Client from "matchmaking/Client";
import useVisible from "hooks/useVisible";
import useSortPlayers from "./hooks/useSortPlayers";
import { Player } from "matchmaking/Schemas";
import { IndexedPlayers, IndexedString } from "types";
import renderPlayerInfo from "./helpers/renderPlayerInfo";
import AavegotchiSVGFetcher from "game/Rendering/AavegotchiSVGFetcher";
import { convertInlineSVGToBlobURL } from "helpers/aavegotchi";
import { useGlobalStore } from "hooks/useGlobalStore";

interface Props {
    hidden: boolean;
  }
  
  const GameLeaderboard : React.FC<Props> = ({ hidden }) => { 

    const leaderboardVisibility = useVisible('leaderboard', !hidden);
    const worldCrypto = useGlobalStore( store => store.worldCrypto );
    const [ players , setPlayers] = useState({} as IndexedPlayers);
    const [ playerGotchiSVG, setplayerGotchiSVG] = useState({} as IndexedString);
    const {sortedPlayers} = useSortPlayers(players, leaderboardVisibility.state );

    useEffect(()=>{
        function updatePlayerList(player:Player){
            setPlayers( state => {
                state[player.gotchiID]=player; 
                return({...state})
            })

            const aavegotchiSVGFetcher = new AavegotchiSVGFetcher( player.gotchiID );
            aavegotchiSVGFetcher.frontWithoutBackground()
            .then((svg) => {
                let gotchiSVG = convertInlineSVGToBlobURL(svg);
                setplayerGotchiSVG( state => {state[player.gotchiID]=gotchiSVG; return {...state} }  )
            });
            
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

        { sortedPlayers.map( (id) =>  renderPlayerInfo(+id, players, sortedPlayers, worldCrypto, playerGotchiSVG[id])) }

    </div>
    )
};

export default React.memo(GameLeaderboard)
