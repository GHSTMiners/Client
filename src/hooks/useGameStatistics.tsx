import { GameStatistics, StatisticCategory } from "chisel-api-interface/lib/Statistics"
import Client from "matchmaking/Client";
import { StatisticEntry } from "chisel-api-interface/lib/Statistics"
import { useEffect, useState } from "react";
import { IndexedBooleanArray } from "types";

const useGameStatistics = () => {
    const [ categories, setCategories] = useState(new Array<StatisticCategory>())
    const [ gameStatistics, setGameStatistics ] = useState({});
    const [ myStatistics, setMyStatistics ] = useState<StatisticEntry[]>([]);
    const [ mytopScore, setMyTopScore ] = useState<IndexedBooleanArray>({});
    const myGotchiID = 3934; //Client.getInstance().ownPlayer.gotchiID;
  
    useEffect(() => {
        Client.getInstance().apiInterface.statistic_categories().then( (cathegories: StatisticCategory[]) => {
            setCategories( state => { 
                state=cathegories; 
                return([...state]) 
            })
        })
    },[])

  useEffect(() => {
      if (categories.length > 0 ){
        Client.getInstance().apiInterface.game('f4d626eb-c3be-4f06-9483-a490403d257c').then( (info: GameStatistics) => {
            setGameStatistics(info.statistic_entries)
            setMyStatistics(info.statistic_entries.filter(entry => entry.gotchi.gotchi_id === myGotchiID)) 
          })   
      }
  },[categories])

  useEffect(() => {
    if (myStatistics.length>0){
        myStatistics.forEach( entry => {
            setMyTopScore( state => {state[entry.game_statistic_category_id] = true; return({...state}) });
        })
    }
  },[myStatistics])

  return { gameStatistics , myStatistics, mytopScore, categories }
}

export default useGameStatistics