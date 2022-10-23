import Client from 'matchmaking/Client'
import { useEffect, useState } from 'react';
import { GlobalStatisticEntry, StatisticCategory } from 'chisel-api-interface/lib/Statistics'

const useGlobalStatistics = () => {
    
    const [categories, setCategories] = useState(new Array<StatisticCategory>)
    const [statistics, setStatistics] = useState(new Map<number,GlobalStatisticEntry>)
    const [isLoading, setIsLoading] = useState(true)

    useEffect(()=>{
        let mounted = true;
        const rawGames = Client.getInstance().apiInterface.statistics_global_games();
        const rawCathegories = Client.getInstance().apiInterface.statistic_categories();
        
        if (mounted){
            rawCathegories.then(  cathegories => {
                setCategories( state => { 
                    state=cathegories; 
                    return([...state]) 
                })
                if (mounted){
                    rawGames.then( statistics => {
                        setStatistics( statistics )
                        setIsLoading( false );
                    })
                }
            })            
        }

        return () => {mounted = false}
    },[])

    function getAmount( cathegoryName: string, timeframe?: string  ) { 
        const  cathegory = categories.find( entry => entry.name === cathegoryName);
        return (
         (cathegory?.id)? statistics.get(cathegory.id)?.total : undefined    
        )
    }

    function getTotalGames( timeframe?: string  ) { 
        return  statistics.get(-1)?.total 
    }

    return { categories, statistics , isLoading, getAmount , getTotalGames }
    
}

export default useGlobalStatistics