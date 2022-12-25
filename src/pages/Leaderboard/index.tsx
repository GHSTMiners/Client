import { ChangeEvent, useEffect, useState } from "react";
import { Pagination, RockyCheckbox } from "components";
import { Podium , LeaderboardTable } from "./components";
import { getAavegotchis } from "web3/context";
import * as Chisel from "chisel-api-interface";
import Client from "matchmaking/Client";
import { HighScore } from "types";
import { StatisticCategory } from "chisel-api-interface/lib/Statistics";
import { number } from "mathjs";
import LeaderboardHeader from "assets/svgs/leaderboard_header.svg"
import LeaderboardFooter from "assets/svgs/leaderboard_footer.svg"
import styles from "./styles.module.css";
import { getHighScoresWithNames } from "helpers/aavegotchi"
import { useGlobalStore } from "store";
import globalStyles from "theme/globalStyles.module.css"


const Leaderboard = (): JSX.Element => {

  // Initializing internal variables and hooks
  const highScores : Array<HighScore> = [];
  const [showOnlyMine,setShowOnlyMine] = useState<boolean>(false);
  const [currentPage, setCurrentPage] = useState(1);
  const handlePages = (updatePage: number) => setCurrentPage(updatePage);
  const entriesPerPage : number = 50;
  const totalPages: number = 1;
  const emptyWorlds : JSX.Element[] = [];
  const emptyCathegories : JSX.Element[] = [];
  const emptyStatisticsCategory: StatisticCategory[] =[];
  const emptyCategory = {} as StatisticCategory;
  const [leaderboardWorlds,setLeaderboardWorlds] = useState(emptyWorlds);
  const [leaderboardCathegories,setLeaderboardCathegories] = useState(emptyCathegories);
  const [statisticsCathegories,setStatisticsCathegories] = useState(emptyStatisticsCategory);
  const [activeCategory,setActiveCategory] = useState(emptyCategory);
  const [highScoresData,setHighScoresData] = useState(highScores);
  const [totalDataPages,setTotalDataPages] = useState(totalPages);
  const isLoading = useGlobalStore( state => state.isLoading );
  const usersWalletAddress = useGlobalStore( state => state.usersWalletAddress )
  const usersAavegotchis = useGlobalStore( state => state.usersAavegotchis )

  // Component to convert Chisel data into React Select options
  const renderSelectElement = ( key:string, id: number | string, tag:string) => {
    return <option key={key} value={id}>{tag}</option>
  }

  //Fetch user's aavegotchis
  useEffect(() => {
    if (usersWalletAddress)  getAavegotchis(usersWalletAddress);
  }, [usersWalletAddress]);
  
  // Retrieving data from Chisel
  useEffect(()=>{
    let mounted = true;
    try{
      // Getting world options
      const rawWorlds = Client.getInstance().apiInterface.worlds();
      if (mounted){
        rawWorlds.then( worlds => {
             const worldOptions = worlds.map(
               function(world:Chisel.World) { return renderSelectElement(world.name,world.id,world.name) }
             ) 
             if (worldOptions){
              setLeaderboardWorlds(worldOptions);
             }
          })
      }
      // Getting statistics cathegories 
      const rawCathegories = Client.getInstance().apiInterface.statistic_categories();
      if (mounted){
        rawCathegories.then( categoryList => {
          setStatisticsCathegories(categoryList);
             const optionList = categoryList.map(
               function(categoryObj) { 
                 return renderSelectElement(categoryObj.name as string, categoryObj.id as number, categoryObj.name as string) 
                }
             )
             .filter( element => (element.key !== 'Playtime') ) 
             .filter( element => (element.key !== 'Amount spent on upgrades') ) 

             if (optionList && mounted){
              setLeaderboardCathegories(optionList);
             }
          })
      }
      // Setting default statistic category
      setActiveCategory( {id:3, name:"Endgame crypto"} );
    } catch (err) {
      console.log(err);
    }

    return () => {mounted = false}; // cleanup function
  },[])

  // Updating component of the drop-down select category element
  const updateCategory = (event: ChangeEvent<HTMLSelectElement>) => {
    if (statisticsCathegories){
      let selectedId = number(event.target.value) as number;
      let selectedName = statisticsCathegories.find( element => element.id === selectedId)?.name;
      if (selectedName){
        const requestedCategory: StatisticCategory= {id:selectedId, name:selectedName};
        setActiveCategory(requestedCategory);
      }
    }
  }

  // Fetching leaderboard data for the selected category
  useEffect(()=>{
    let mounted = true;
    if (activeCategory && Object.keys(activeCategory).length !== 0 ){
      try{
        const rawHighScores = Client.getInstance().apiInterface.highscores(activeCategory)
        if (mounted){
          rawHighScores.then( rawScoresData => {
            let displayData: Array<HighScore> = [];
            let idArray : Array<string>=[];
            rawScoresData.forEach( data => {
              const entryId = data.gotchi.gotchi_id.toString();
              const entryScore = data.entry.value;
              const entryName = `${entryId}`;
              idArray.push(entryId);
              displayData.push({ tokenId: entryId, name: entryName, score: entryScore });
            })
            const highScoreDataWithNames = getHighScoresWithNames(idArray,displayData);
            if (mounted){
              highScoreDataWithNames.then( data => {
                const sortedDisplayData = data.sort((n1,n2) => n2.score - n1.score);
                if (mounted){
                  setHighScoresData(sortedDisplayData);
                  setTotalDataPages(Math.ceil(highScoresData.length/entriesPerPage));
                }
              })
            }
            }
          )
        }
      } catch (err) {
        console.log(err);
      }
    }
    return () => {mounted = false}; // cleanup function
  },[activeCategory,highScoresData.length])

  // Competition parameters [Please don't puke, it's just an example of the data format :P ]. TO DO: get this from Chisel
  const endDate = new Date('December 25, 2022 22:00:00 UTC+1') ;
  const getReward = (position : number , score?:  number):string => {
    if (position === 1) {
      return "1 x MINER HELMET"
    } else if (position === 2 ) {
      return "1 x LAAND PARCEL"
    } else if (position === 3 ) {
      return "1 x LE GOLDEN TILE"
    } else if (position <= 10 ) {
      return "1 x DECORATION"
    } else {
      return ""
    }
  }
  const competition = { endDate , rewards:getReward };  

  return (
     <div className={`${styles.leaderboardContainer} ${isLoading? globalStyles.isLoading :null}`}>
       
       <div className={styles.gotchiPodiumContainer}>
         <Podium podiumGotchis={highScoresData} category={activeCategory}/>
       </div>
  
       <div className={styles.tableContainer}>
         <img className={styles.leaderboardHeader} src={LeaderboardHeader} alt={'Leaderboard Header'}/> 
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
               <select value={activeCategory.id} onChange={(e)=>updateCategory(e)} className={styles.selectDropdown}>
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
                             category={activeCategory}
                             ownedGotchis={usersAavegotchis?.map((gotchi) => gotchi.id)}
                             onlyMine={showOnlyMine}
                             competition={competition}   />
           </div>
           <Pagination page={currentPage} 
                   totalPages={totalDataPages}
                   hideElement={totalDataPages<2} 
                   handlePagination={handlePages} />
         </div>
         <img className={styles.leaderboardFooter} src={LeaderboardFooter} alt={'Leaderboard Footer'} />
       </div> 
     
     </div>
  );  
};

export default Leaderboard;
