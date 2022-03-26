import styles from "./styles.module.css";

const LeaderboardTable = () => {

  type LeaderboardRow = { rank:number; name:string; score: number };

  let leaderbordTable: LeaderboardRow[] = [];

  leaderbordTable.push({ rank:1 , name: 'Badass', score: 669656 })
  leaderbordTable.push({ rank:2 , name: ';kjfa', score: 5536 })
  leaderbordTable.push({ rank:3 , name: 'asdfa', score: 2214 })
  leaderbordTable.push({ rank:4 , name: 'fda', score: 1333 })
  leaderbordTable.push({ rank:5 , name: 'fad fadlk', score: 1222 })
  leaderbordTable.push({ rank:6 , name: 'dfasdfa', score: 1111 })
  leaderbordTable.push({ rank:7 , name: 'cvzxvz', score: 999 })
  leaderbordTable.push({ rank:8 , name: 'hghgh', score: 888 })
  leaderbordTable.push({ rank:9 , name: 'cvcv', score: 777 })
  leaderbordTable.push({ rank:10 , name: 'erere', score: 666 }) 
  leaderbordTable.push({ rank:11 , name: 'erere', score: 666 }) 
  leaderbordTable.push({ rank:12 , name: 'erere', score: 666 }) 
  leaderbordTable.push({ rank:13 , name: 'erere', score: 666 }) 
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
