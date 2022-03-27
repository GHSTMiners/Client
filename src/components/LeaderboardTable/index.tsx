import styles from "./styles.module.css";

const LeaderboardTable = () => {

  type LeaderboardRow = { rank:number; name:string; score: number };

  let leaderbordTable: LeaderboardRow[] = [];

  for (let i=0; i<100;i++){
    let randomName = (Math.random() + 1).toString(36).substring(7);
    leaderbordTable.push({ rank:i+1 , name: randomName, score: 100-i })
  }
  
  const renderRankingRow = ( rank:number, name:string, score: number ) =>{
    return(
    <div className={styles.tableRow}>
      <div>`&#35;` {rank}</div>
      <div>{name}</div>
      <div>{score}</div>
    </div>
    )
  }
  
  let leaderboardDisplayData = leaderbordTable.map(function (row) {
    return( renderRankingRow( row.rank, row.name, row.score ) )
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
