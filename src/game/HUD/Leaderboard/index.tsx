import React from "react";
import styles from "./styles.module.css";
import useVisible from "hooks/useVisible";
import useSortPlayers from "./hooks/useSortPlayers";
import renderPlayerInfo from "./helpers/renderPlayerInfo";
import { useGlobalStore } from "store";

interface Props {
    hidden: boolean;
  }
  
const GameLeaderboard : React.FC<Props> = ({ hidden }) => { 
  const leaderboardVisibility = useVisible('leaderboard', !hidden);
  const worldCrypto = useGlobalStore( store => store.worldCrypto );
  const players = useGlobalStore( store => store.players );
  const playerGotchiSVG = useGlobalStore( store => store.gotchiSVGs);
  const {sortedPlayers} = useSortPlayers(players, leaderboardVisibility.state );

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
