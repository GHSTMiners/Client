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
import { Action } from "web3/context/reducer";
import { callSubgraph } from "web3/actions";
import { AavegotchisNameArray, getAavegotchiNames } from "web3/actions/queries";


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
    
  const entriesPerPage = 50;
  const totalPages = 1;// Math.ceil(highScores.length/entriesPerPage);

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
  const [highScoresData,setHighScoresData] = useState(highScores);
  const [totalDataPages,setTotalDataPages] = useState(totalPages);

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

      setActiveCathegory( {id:2, name:"Blocks mined"} );

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

  // fetching aavegotchi names from highScore data
  const getHighScoresWithNames = async (gotchiIDs:string[],displayData:HighScore[]): Promise<Array<HighScore>> => {
    let updateList=[...displayData];
    try {
      const res = await callSubgraph<AavegotchisNameArray>(
        getAavegotchiNames(gotchiIDs)
      );
      if (res){
        res.aavegotchis.map( entry =>{
          let unnamedEntry = updateList.find( oldEntry => oldEntry.tokenId==entry.id);
          if (unnamedEntry) unnamedEntry.name = entry.name;
        })
        console.log(res)
      }
    } catch (err) {
    }
    return updateList
  };

  // fetching leaderboard data for the selected cathegory
  useEffect(()=>{
    if (activeCathegory){
      const rawHighScores = Client.getInstance().apiInterface.highscores(activeCathegory)
      rawHighScores.then( rawScoresData => {
        // cleaning dummy data
        let displayData: Array<HighScore> = [];
        let idArray : Array<string>=[];
        rawScoresData.map( data => {
          const entryId = data.gotchi.gotchi_id.toString();
          const entryScore = data.entry.value;
          const entryName = `${entryId}`;
          idArray.push(entryId);
          displayData.push({ tokenId: entryId, name: entryName, score: entryScore })
        })
        const highScoreDataWithNames = getHighScoresWithNames(idArray,displayData);
        highScoreDataWithNames.then( data => {
          const sortedDisplayData = data.sort((n1,n2) => n2.score - n1.score);
          setHighScoresData(sortedDisplayData);
          setTotalDataPages(Math.ceil(highScoresData.length/entriesPerPage))
        })
        }
      )
    }
  },[activeCathegory])

  return (
     <div className={styles.leaderboardContainer}>
       
       <div className={styles.gotchiPodiumContainer}>
         <Podium podiumGotchis={highScoresData} />
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
               <select value={activeCathegory.id} onChange={(e)=>updateCathegory(e)} className={styles.selectDropdown}>
                 {leaderboardCathegories}
               </select>
             </div>
             <RockyCheckbox onClick={()=> setShowOnlyMine(!showOnlyMine)}
                            textLabel={'Only Mine'} />            
           </div>
           <div className={styles.leaderboardTableContainer}>
             <LeaderboardTable pageIndex={currentPage}
                             entriesPerPage={entriesPerPage}
                             highscores={highScoresData}
                             ownedGotchis={usersAavegotchis?.map((gotchi) => gotchi.id)}
                             onlyMine={showOnlyMine}
                             competition={competition}   />
           </div>
           <Pagination page={currentPage} 
                   totalPages={totalDataPages}
                   hideElement={totalDataPages==1} 
                   handlePagination={handlePages} />
         </div>
         <img className={styles.leaderboardFooter} src={LeaderboardFooter} />
       </div> 
     
     </div>
  );  
};

export default Leaderboard;
