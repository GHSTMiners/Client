import { useEffect, useState } from "react";
import { HighScore } from "types";
import styles from "./styles.module.css";


interface Props {
  highscores?: Array<HighScore>;
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

const LeaderboardTable = ({highscores,ownedGotchis,onlyMine,competition}:Props) => {

  const [leaderboardData, setLeaderboardData] = useState<Array<LeaderbordData>>([]);
  const [displayedScores, setDisplayedScores] = useState<Array<LeaderbordData>>([]);
  const [currentPage, setCurrentPage] = useState(0);

  const pageTotal = 100; // entries per page

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
  }, [highscores]);

  // Filtering and setting up on screen the selected dataset
  useEffect(() => {
    if (onlyMine && ownedGotchis) {
      const myLeaderboardData = [...leaderboardData].filter((score) =>
        ownedGotchis.includes(score.tokenId)
      );
      setDisplayedScores(myLeaderboardData);
    } else {
      setDisplayedScores(leaderboardData);
    }
  }, [onlyMine, leaderboardData, ownedGotchis]);
  
  const renderRankingRow = ( rank:number, name:string, score: number) =>{
    return(
    <div className={styles.tableRow}>
      <div> `&#35;` {rank}</div>
      <div>{name}</div>
      <div>{score}</div>
    </div>
    )
  }
  
  let leaderboardDisplayData = displayedScores?.map(function (row,i) {
    return( renderRankingRow( row.position, row.name, row.score) )
  });

  return (
    <>
      <div className={styles.rankingList}>
        <div className={`${styles.rankingHeader} ${styles.tableRow}`}>
          <div>Rank</div>
          <div>Name</div>
          <div>Score</div>
        </div>
        {leaderboardDisplayData}
      </div>
    </>
  );
};

export default LeaderboardTable;
