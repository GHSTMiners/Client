import { StatisticCategory } from "chisel-api-interface/lib/Statistics";
import { formatScore } from "helpers/functions";
import { ReactNode, useEffect, useState } from "react";
import { HighScore } from "types";
import styles from "./styles.module.css";


interface Props {
  pageIndex:number;
  entriesPerPage:number;
  highscores?: Array<HighScore>;
  category?: StatisticCategory;
  ownedGotchis?: Array<string>;
  onlyMine?: boolean;
  competition?: {
    endDate: Date;
    rewards: (position: number, score?: number) => React.ReactNode;
  };
}

interface LeaderbordData extends HighScore {
  position: number;
  reward?: React.ReactNode;
}

export const LeaderboardTable = ({pageIndex,entriesPerPage,highscores,category,ownedGotchis,onlyMine,competition}:Props) => {

  const [leaderboardData, setLeaderboardData] = useState<Array<LeaderbordData>>([]);
  const [displayedScores, setDisplayedScores] = useState<Array<LeaderbordData>>([]);

  // Adding competition and ranking fields to the highscores data
  useEffect(() => {
    if (highscores) {
      const hs = highscores.map((score, i) => {
        const position = i + 1;
        return {
          ...score,
          position,
          reward: competition
            ? competition.rewards(position, score.score)
            : undefined,
        };
      });
      setLeaderboardData(hs);
    }
  }, [highscores,competition]);

  // Filtering and setting up on screen the selected dataset
  useEffect(() => {
    if (onlyMine && ownedGotchis && leaderboardData) {
      const myLeaderboardData = [...leaderboardData].filter((score) =>
        ownedGotchis.includes(score.tokenId)
      );
      setDisplayedScores(myLeaderboardData);
    } else {
      let pageData = leaderboardData.slice((pageIndex-1) * entriesPerPage, pageIndex * entriesPerPage );
      setDisplayedScores(pageData);
    }
  }, [onlyMine, leaderboardData, ownedGotchis, entriesPerPage, pageIndex]);
  
  const renderRankingRow = ( rank:number, name:string, score: number, reward?:ReactNode, wallet?:string) =>{
    console.log(`${rank}: ${wallet}`)
    return(
    <div className={styles.tableRow} key={`${name}${score}`}>
      <div> `&#35;` {rank}</div>
      <div>{name}</div>
      <div className={styles.rewardColumn} >{(category?.name === 'Endgame crypto')? reward: ''}</div>
      <div>{formatScore(score,category)}</div>
    </div>
    )
  }
  
  let leaderboardDisplayData = displayedScores?.map( (row,i) => {
    return( renderRankingRow( row.position, row.name, row.score, row.reward , row.wallet) )
  });

  return (
      <div className={styles.rankingList}>
        <div className={`${styles.rankingHeader} ${styles.tableRow}`} key={"leaderboardHeader"}>
          <div>Rank</div>
          <div>Name</div>
          <div>{(category?.name === 'Endgame crypto')? 'Reward': ''}</div>
          <div>Score</div>
        </div>
        <div className={styles.rankingData}  key={"leaderboardDataList"}>
          {leaderboardDisplayData}
        </div>
      </div>
  );
};