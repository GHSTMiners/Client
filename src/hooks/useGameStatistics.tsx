import { GameStatistics, StatisticCategory } from "chisel-api-interface/lib/Statistics"
import Client from "matchmaking/Client";
import { StatisticEntry } from "chisel-api-interface/lib/Statistics"
import { useEffect, useState } from "react";
import { IndexedBalance, IndexedBooleanArray } from "types";
import { AavegotchisNameArray, getAavegotchiNames } from "web3/actions/queries";
import { callSubgraph } from "web3/actions";
import { useGlobalStore } from "store";
import AavegotchiSVGFetcher from "game/Rendering/AavegotchiSVGFetcher";
import { convertInlineSVGToBlobURL } from "helpers/aavegotchi";
import axios from "axios";

const useGameStatistics = (roomId : string , myGotchiID: string) => {
    const [ categories, setCategories] = useState(new Array<StatisticCategory>())
    const [ gameStatistics, setGameStatistics ] = useState<StatisticEntry[]>([]);
    const [ myStatistics, setMyStatistics ] = useState<StatisticEntry[]>([]);
    const [ mytopScores, setMyTopScores ] = useState<IndexedBooleanArray>({});
    const [ roomTopScores, setRoomTopScores ] = useState<IndexedBalance>({});
    const setRoomLeaderboard = useGlobalStore( state => state.setRoomLeaderboard);
    const setGotchiName = useGlobalStore( state => state.setGotchiName )
    const setGotchiSVG = useGlobalStore( state => state.setGotchiSVG )
  
    useEffect(() => {
        // Fetching base statistics cathegories
        Client.getInstance().apiInterface.statistic_categories().then( (cathegories: StatisticCategory[]) => {
            setCategories( state => { 
                state=cathegories; 
                return([...state]) 
            })
        })
        // Fetching game statistics for all the players
        Client.getInstance().apiInterface.game(roomId).then( (info: GameStatistics) => {
            console.log(info)
            if (info.room_id){
              const dataURL = `https://chisel.gotchiminer.rocks/storage/${info.log_entry.log_file}`;
              console.log(`Fetching data from URL:${dataURL}`)
              
              Client.getInstance().databaseFacade.fetchDatabase(dataURL);
              
              axios.get(dataURL).then( response => {

                //db.run(response.data)
                console.log(response.data)
                console.log(response.headers)
                console.log(response.config)
                const uInt8Array = new Uint8Array(response.data);
                //console.log(db)
                console.log(uInt8Array)
                /*
                const database = new Database( response.data , (err) => {
                  if(!err) console.log('database loaded successfully!')
                })
                console.log(database)*/
              })              
            }
            setGameStatistics(info.statistic_entries)
            setMyStatistics(info.statistic_entries.filter(entry => entry.gotchi.gotchi_id === +myGotchiID)) 
          }) 
    // eslint-disable-next-line react-hooks/exhaustive-deps
    },[])    

    useEffect(() => {
      if (myStatistics.length>0){

        // Checking my player top scores across all cathegories  
        myStatistics.forEach( entry => {
              const filteredData = gameStatistics.filter( searchEntry => searchEntry.game_statistic_category_id === entry.game_statistic_category_id );
              const higherScore = filteredData.find( dataEntry => dataEntry.value> entry.value )
              const isTopScore = higherScore? false: true ;
              setMyTopScores( state => {state[entry.game_statistic_category_id] = isTopScore; return({...state}) });
          })

        // Finding unique gotchis
        const singleCathegoryData =  gameStatistics.filter( entry => entry.game_statistic_category_id === myStatistics[0].game_statistic_category_id );
        const uniqueGotchiIds = singleCathegoryData.map( entry => `${entry.gotchi.gotchi_id}` )
        // Fetching and storing gotchi names
        callSubgraph<AavegotchisNameArray>( getAavegotchiNames(uniqueGotchiIds) ).then( data =>{
          data.aavegotchis.forEach( gotchi => {
            setGotchiName( gotchi.id, gotchi.name )
          })
        });

        // Fetching and storing gotchi SVGs
        const aavegotchiSVGFetcher = new AavegotchiSVGFetcher();
        uniqueGotchiIds.forEach( gotchiId => {
          aavegotchiSVGFetcher.frontWithoutBackground(+gotchiId).then((svg) => {
            setGotchiSVG( gotchiId, convertInlineSVGToBlobURL(svg))
          }); 
        })

        // Sorting General ranking
        const winningCategory =  categories.find( entry => entry.name === 'Endgame crypto') ;
        const unsortedData = gameStatistics.filter( entry => entry.game_statistic_category_id === winningCategory?.id )
        const sortedData = unsortedData.sort((entry1,entry2)=> entry2.value - entry1.value)
        setRoomLeaderboard( sortedData );

        // Checking the top players per cathegory
        categories.forEach( entry=>{
            const filteredData = gameStatistics.filter( searchEntry => searchEntry.game_statistic_category_id === entry.id );
            const topEntry = filteredData.reduce( function (prev,current){
                return (prev.value > current.value)? prev : current
            } )
            const idKey = entry.id as number;
            if (idKey){
              setRoomTopScores( state => {
                state[idKey] = {playerId: topEntry.gotchi.gotchi_id, total: topEntry.value };
                return({...state}) 
              });  
            } 
        })
      }
    // eslint-disable-next-line react-hooks/exhaustive-deps
    },[gameStatistics,myStatistics,categories])

  return { gameStatistics, myStatistics, mytopScores, roomTopScores, categories }
}

export default useGameStatistics