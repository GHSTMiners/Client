import styles from "./styles.module.css";
import { GotchiSVG, Header, LeaderboardCoyote } from "components";
import gotchiPodium from "assets/svgs/podium.svg"
import React from "react";
import LeaderboardTable from "components/LeaderboardTable";
import LeaderboardFooter from "assets/svgs/leaderboard_footer.svg"
import { useWeb3 } from "web3/context";
import { HighScore } from "types";

const Leaderboard = (): JSX.Element => {

  const { state: { usersAavegotchis } } = useWeb3();
  const highScores : Array<HighScore> = [];
  
  // Competition parameters 
  const endDate = new Date('April 15, 2022 16:00:00 UTC+2') ;
  const getReward = (position : number , score?:  number) => {
    if (position == 1) {
      return "1 x MYTHICAL TICKET"
    } else if (position <= 3 ) {
      return "1 x LEGENDARY TICKET"
    } else if (position <= 5 ) {
      return "1 x RARE TICKET"
    } else if (position <= 10 ) {
      return "1 x UNCOMMON TICKET"
    } else {
      return ""
    }
  }
  const competition = { endDate , rewards:getReward };

  const renderGotchi = (id:number, winner:boolean)=>{
    return(
      <GotchiSVG tokenId={`${id}`}  
      options={{ animate: true, removeBg: true, armsUp:winner }}
      />
    )
  }

  return (
    <div className={styles.backgroundContainer}>
    <Header />
        <div className={styles.leaderboardContainer}>
          <div className={styles.gotchiPodiumContainer}>
            <div className={styles.gotchiRank1}>
              {renderGotchi(20689,true)}
            </div>
            <div className={`${styles.podiumText} ${styles.rank1Text}`}>
              Martens
              <div style={{color:'#ffffff'}} >420</div>
            </div>
            <div className={styles.gotchiRank2}>
              {renderGotchi(21223,false)}
            </div>
            <div className={`${styles.podiumText} ${styles.rank2Text}`}>
              Corelone
              <div style={{color:'#ffffff'}} >169</div>
            </div>
            <div className={styles.gotchiRank3}>
              {renderGotchi(3934,false)}
            </div>
            <div className={`${styles.podiumText} ${styles.rank3Text}`}>
              Yoda
              <div style={{color:'#ffffff'}} >101</div>
            </div>
            <img className={styles.gotchiPodium} src={gotchiPodium} />
          </div>

          <div className={styles.tableContainer}>
            <LeaderboardTable />
            {/*<LeaderboardCoyote highscores={highScores} 
                               ownedGotchis={usersAavegotchis?.map((gotchi) => gotchi.id)}
                               competition={competition}  
          />*/}
          </div> 
        </div>
        <img className={styles.leaderboardFooter} src={LeaderboardFooter} /> 
    </div>
  );
};

export default Leaderboard;
