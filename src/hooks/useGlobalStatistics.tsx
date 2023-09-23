import Client from 'matchmaking/Client'
import { useEffect, useState } from 'react';
import { GlobalStatisticEntry, StatisticCategory } from 'chisel-api-interface/lib/Statistics'
import { TimeRange } from 'helpers/vars';
import { GraphData, GraphEntry, IndexedArray, ScatteredData } from 'types';
import { useGlobalStore } from "store";
import chroma from 'chroma-js';

const useGlobalStatistics = () => {
    const [categories, setCategories] = useState(new Array<StatisticCategory>())
    const [statistics, setStatistics] = useState(new Map<number,GlobalStatisticEntry>())
    const [serverGraphData, setServerGraphData] = useState<GraphData>({} as GraphData);
    const serverRegions = useGlobalStore( state => state.serverRegions)
    const [isLoading, setIsLoading] = useState(true)
    
    useEffect(()=>{
        let mounted = true;
        const rawGames = Client.getInstance().apiInterface.statistics_global_games();
        const rawCathegories = Client.getInstance().apiInterface.statistic_categories();
        const rawGameAmounts = Client.getInstance().apiInterface.game_amounts();

        if (mounted){
            rawCathegories.then(  cathegories => {
                if (cathegories) {
                    setCategories( state => { 
                        state=cathegories;
                        return([...state]); 
                    });
                    if (mounted){
                        rawGames.then( statistics => {
                            setStatistics( statistics )
                        });
                        if (mounted){
                            rawGameAmounts.then( gameAmountEntries => {
                                const graphDatasets: GraphEntry[] = [];
                                const serverColors = chroma.scale(['#fafa6e','#2A4858']).mode('lch').colors(serverRegions.length+1);
                                    
                                serverRegions.forEach( (serverRegion,index) => {
                                    let dataPoints:ScatteredData[] = [];
                                    gameAmountEntries.forEach( gameEntry => {
                                        const nGames = (gameEntry.games_per_region as unknown as IndexedArray)[`${index+1}`];
                                        const dataPoint = {
                                            x: new Date(gameEntry?.start_date).getTime(),
                                            y: nGames || 0
                                        }
                                        dataPoints.push(dataPoint)
                                    })

                                    const serverData = { 
                                        label: serverRegion.name,
                                        data: dataPoints,
                                        showLine: true,
                                        radius: 3,
                                        borderColor: serverColors[index],
                                        tension: 0.2,
                                      };
                                  
                                      graphDatasets.push(serverData)
                                })

                                setServerGraphData({ datasets: graphDatasets})
                                setIsLoading( false );
                            })
                        }
                    };
                } else {
                    console.log('Could not fetch stat categories from API')
                }
            })
            .catch( err => console.log(`Failed fetching promise ${err}`))            
        }
        return () => {mounted = false}
    },[serverRegions])

    function getAmount( cathegoryName: string, timeframe: TimeRange  ) { 
        const  cathegory = categories.find( entry => entry.name === cathegoryName);
        let amount = undefined;       
        if (cathegory?.id && timeframe){
            const selectedCathegory = statistics.get(cathegory.id);
            switch (timeframe){
                case TimeRange.last_24h:
                        amount = selectedCathegory?.last_24h;
                        break;    
                case TimeRange.last_7d:
                    amount = selectedCathegory?.last_7d;
                    break;
                case TimeRange.total:
                    amount = selectedCathegory?.total;
                    break;
                default : 
                    break;
            }
        }
        return amount
    }

    function deaths( timeframe: TimeRange ){
        return getAmount('Deaths', timeframe)
    }

    function cryptoCollected(timeframe: TimeRange ){
        return getAmount('Total crypto', timeframe)
    }

    function blocksMined(timeframe: TimeRange ){
        return getAmount('Blocks mined', timeframe)
    }

    function totalGames() { 
        return  statistics.get(-1)?.total 
    }

    return { categories, statistics , isLoading, serverGraphData, deaths, cryptoCollected, blocksMined, totalGames }
    
}

export default useGlobalStatistics