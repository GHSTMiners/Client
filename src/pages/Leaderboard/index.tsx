import styles from "./styles.module.css";
import { Podium, RockyCheckbox } from "components";
import { ChangeEvent, useEffect, useState } from "react";
import LeaderboardTable from "components/LeaderboardTable";
import LeaderboardHeader from "assets/svgs/leaderboard_header.svg"
import LeaderboardFooter from "assets/svgs/leaderboard_footer.svg"
import { useWeb3, updateAavegotchis } from "web3/context";
import { HighScore } from "types";
import { Pagination } from 'components/Pagination';
import * as Chisel from "chisel-api-interface";
import Client from "matchmaking/Client";
import { StatisticCategory } from "chisel-api-interface/lib/Statistics";
import { number } from "mathjs";


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
    
  const entriesPerPage = 50;
  const totalPages = Math.ceil(highScores.length/entriesPerPage);

  const renderSelectElement = ( key:string, id: number | string, tag:string) => {
    return <option key={key} value={id}>{tag}</option>
  }

  const emptyWorlds : JSX.Element[] = [];
  const emptyCathegories : JSX.Element[] = [];
  const emptyGameModes : JSX.Element[] = [];
  const emptyStatisticsCathegory: StatisticCategory[] =[];
  const emptyCathegory = {} as StatisticCategory;
  const [leaderboardWorlds,setLeaderboardWorlds] = useState(emptyWorlds);
  const [leaderboardCathegories,setLeaderboardCathegories] = useState(emptyCathegories);
  const [statisticsCathegories,setStatisticsCathegories] = useState(emptyStatisticsCathegory);
  const [activeCathegory,setActiveCathegory] = useState(emptyCathegory);

  //const [leaderboardGameModes,setLeaderboardGameModes] = useState(emptyGameModes); // TO DO
  
  // Retrieving data from Chisel
  useEffect(()=>{

    const rawWorlds = Client.getInstance().apiInterface.worlds();
    rawWorlds.then( worlds => {
         const worldOptions = worlds.map(
           function(world:Chisel.World) { return renderSelectElement(world.name,world.id,world.name) }
         ) 
         if (worldOptions){
          setLeaderboardWorlds(worldOptions);
         }
      })

    const rawCathegories = Client.getInstance().apiInterface.statistic_categories();
    rawCathegories.then( categoryList => {
      setStatisticsCathegories(categoryList);
         const optionList = categoryList.map(
           function(categoryObj) { return renderSelectElement(categoryObj.name as string,categoryObj.id as number,categoryObj.name as string) }
         ) 
         if (optionList){
          setLeaderboardCathegories(optionList);
         }
      })

  },[])

  const updateCathegory = (event: ChangeEvent<HTMLSelectElement>) => {
    if (statisticsCathegories){
      const selectedId = number(event.target.value) as number;
      const selectedName = statisticsCathegories.find( element => element.id==selectedId)?.name;
      if (selectedName){
        const requestedCathegory: StatisticCategory= {id:selectedId, name:selectedName};
        setActiveCathegory(requestedCathegory)
        console.log(`Active Leaderboard Cathegory: ${selectedId} - ${selectedName}`); 
      }
    }
  }

  useEffect(()=>{
    if (activeCathegory){
      const rawHighScores = Client.getInstance().apiInterface.highscores(activeCathegory)
      
      rawHighScores.then( rawScoresData => {
        console.log(rawScoresData)
        }
      )
    }
  },[activeCathegory])

  return (
     <div className={styles.leaderboardContainer}>
       
       <div className={styles.gotchiPodiumContainer}>
         <Podium gotchiIDs={[20689,21223,3934]} />
       </div>
  
       <div className={styles.tableContainer}>
         <img className={styles.leaderboardHeader} src={LeaderboardHeader} /> 
         <div className={styles.tableBackground}>
           <div className={styles.tableToolbar}>
             <div>
               <div className={styles.leaderboardTag}>World</div>
               <select onChange={()=>{}} className={styles.selectDropdown}>
                 {leaderboardWorlds}
               </select>
             </div>
             <div>
               <div className={styles.leaderboardTag}>Game Mode</div>
               <select onChange={()=>{}} className={styles.selectDropdown}>
                 <option key={'Classic'} value={1}>Classic</option>
               </select>
             </div>
             <div>
               <div className={styles.leaderboardTag}>Category</div>
               <select onChange={(e)=>updateCathegory(e)} className={styles.selectDropdown}>
                 {leaderboardCathegories}
               </select>
             </div>
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
           <Pagination page={currentPage} 
                   totalPages={totalPages} 
                   handlePagination={handlePages} />
            
         </div>
         <img className={styles.leaderboardFooter} src={LeaderboardFooter} />
       </div> 
     
     </div>
  );  
};

export default Leaderboard;
