import styles from "./styles.module.css";
import { GotchiSVG, Header } from "components";
import gotchiPodium from "assets/svgs/podium.svg"
import React from "react";
import LeaderboardTable from "components/LeaderboardTable";
import LeaderboardFooter from "assets/svgs/leaderboard_footer.svg"

const Leaderboard = (): JSX.Element => {

  const renderGotchi = (id:number)=>{
    return(
      <GotchiSVG tokenId={`${id}`}  
      options={{ animate: true, removeBg: true }}
      />
    )
  }

  return (
    <div className={styles.backgroundContainer}>
    <Header />
        <div className={styles.leaderboardContainer}>
          <div className={styles.gotchiPodiumContainer}>
            <div className={styles.gotchiRank1}>
              {renderGotchi(20689)}
            </div>
            <div className={styles.gotchiRank2}>
              {renderGotchi(21223)}
            </div>
            <div className={styles.gotchiRank3}>
              {renderGotchi(3934)}
            </div>
            <img className={styles.gotchiPodium} src={gotchiPodium} />
          </div>
          <LeaderboardTable />
          <img className={styles.leaderboardFooter} src={LeaderboardFooter} />      
        </div>
    </div>
  );
};

export default Leaderboard;
