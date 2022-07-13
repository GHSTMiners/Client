import styles from "./styles.module.css";
import Client from "matchmaking/Client";
import React, { useEffect, useState } from "react";


interface Props {
  hidden: boolean;
}

const GameLeaderboard : React.FC<Props> = ({ hidden }) => {

    const [displayLeaderboard,setDisplayLeaderboard] = useState(!hidden);

    useEffect(()=>{
        Client.getInstance().phaserGame.events.on( "open_leaderboard", ()=> {setDisplayLeaderboard(true); console.log('opening leaderboard')});
        Client.getInstance().phaserGame.events.on("close_leaderboard", ()=> {setDisplayLeaderboard(false); console.log('closing leaderboard') });
    },[])

    return(
    <div className={`${styles.leaderboardContainer} ${displayLeaderboard? styles.displayOn:styles.displayOff}`}>
        GAME LEADERBOARD COMING SOON...
    </div>
    )
};

export default GameLeaderboard;
