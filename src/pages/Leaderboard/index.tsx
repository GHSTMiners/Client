import styles from "./styles.module.css";
import { GotchiSVG, Header, RockyCheckbox } from "components";
import gotchiPodium from "assets/svgs/podium.svg"
import { useEffect, useState } from "react";
import LeaderboardTable from "components/LeaderboardTable";
import LeaderboardHeader from "assets/svgs/leaderboard_header.svg"
import LeaderboardFooter from "assets/svgs/leaderboard_footer.svg"
import { useWeb3, updateAavegotchis } from "web3/context";
import { HighScore } from "types";
import { Pagination } from 'components/Pagination';
import * as Chisel from "chisel-api-interface";
import Client from "matchmaking/Client";
import { StatisticCategory } from "chisel-api-interface/lib/Statistics";


const Leaderboard = (): JSX.Element => {

  const highScores : Array<HighScore> = [];
  const [showOnlyMine,setShowOnlyMine] = useState<boolean>(false);
  const { state: { usersAavegotchis, address },dispatch } = useWeb3();
  const [currentPage, setCurrentPage] = useState(1);
  const handlePages = (updatePage: number) => setCurrentPage(updatePage);

  useEffect(() => {
    if (address)  updateAavegotchis(dispatch, address);
  }, [address]);

  // Competition parameters. TO DO: get this from Chisel
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

  // Random data
  for (let i=0; i<20000;i++){
    let gotchiID = i+3930;
    let randomName = i.toString(36) //.substring(7);
    if (gotchiID == 3934) randomName='Yoda'
    if (gotchiID == 3935) randomName='Attila'
    highScores.push({ tokenId: `${gotchiID}`, name: randomName, score: 300-i })
  }

  const renderGotchi = (id:number, winner:boolean)=>{
    return(
      <GotchiSVG tokenId={`${id}`}  
      options={{ animate: true, removeBg: true, armsUp:winner }}
      />
    )
  }
    
  const entriesPerPage = 50;
  const totalPages = Math.ceil(highScores.length/entriesPerPage);

  const renderCathegoryElement = ( cathegoryObj:StatisticCategory) => {
    return <option value={cathegoryObj.id}>{cathegoryObj.name}</option>
  }

  const emptyList : JSX.Element[] = [];
  const [leaderboardCathegories,setLeaderboardCathegories] = useState(emptyList);
  
  useEffect(()=>{
    const rawCathegories = Client.getInstance().apiInterface.statistic_categories();
    rawCathegories.then( cathegoryList => {
         const optionList = cathegoryList.map(
           function(cathegoryObj) { return renderCathegoryElement(cathegoryObj) }
         ) 
         if (optionList){
          setLeaderboardCathegories(optionList);
         }
      })
  },[])

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
          <img className={styles.leaderboardHeader} src={LeaderboardHeader} /> 
          <div className={styles.tableBackground}>
            <div className={styles.tableToolbar}>
              <select onChange={()=>{}} className={styles.selectDropdown}>
                {leaderboardCathegories}
              </select>
              <Pagination page={currentPage} 
                    totalPages={totalPages} 
                    handlePagination={handlePages} />
              <RockyCheckbox onClick={()=> setShowOnlyMine(!showOnlyMine)}
                             textLabel={'Only Mine'} />            
            </div>
            <div className={styles.leaderboardTableContainer}>
              <LeaderboardTable pageIndex={currentPage}
                              entriesPerPage={entriesPerPage}
                              highscores={highScores}
                              ownedGotchis={usersAavegotchis?.map((gotchi) => gotchi.id)}
                              onlyMine={showOnlyMine}
                              competition={competition}   />
            </div>
          </div>
          <img className={styles.leaderboardFooter} src={LeaderboardFooter} /> 
        </div> 
      </div>
       
    </div>
  );  
};

export default Leaderboard;
