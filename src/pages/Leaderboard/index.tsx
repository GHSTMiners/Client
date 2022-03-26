import styles from "./styles.module.css";
import { Header } from "components";
import gotchiPodium from "assets/svgs/podium.svg"
import React from "react";
import LeaderboardTable from "components/LeaderboardTable";
import LeaderboardFooter from "assets/svgs/leaderboard_footer.svg"

const Leaderboard = (): JSX.Element => {

  return (
    <div className={styles.backgroundContainer}>
    <Header />
        <div className={styles.leaderboardContainer}>
          <img className={styles.gotchiPodium} src={gotchiPodium} />
          <LeaderboardTable />
          <img className={styles.leaderboardFooter} src={LeaderboardFooter} />      
        </div>
    </div>
  );
};

export default Leaderboard;
