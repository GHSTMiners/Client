import { useState } from "react";
import starIcon from "assets/svgs/star.svg"
import styles from "./styles.module.css"
import useGameStatistics from "hooks/useGameStatistics";
import { useGlobalStore } from "store";
import { StatisticCategory } from "chisel-api-interface/lib/Statistics";

interface Props {
    roomId: string;
    gotchiId: string;
  }

const StatisticsTabs : React.FC<Props>  = ({ roomId, gotchiId }) => {
    const [selectedTab, setSelectedTab] = useState<number>(0);
    const gotchiSVGs = useGlobalStore( state => state.gotchiSVGs)
    const gameStatistics = useGameStatistics( roomId, gotchiId );
    return(
        <>
            <div className={styles.tabHeaderButton}>
                <button className={`${styles.tabButton} ${styles.firstTabButton} ${selectedTab===0? styles.selectedTab: styles.inactiveTab}`}
                    onClick={()=>{ setSelectedTab(0) }}> My stats </button>

                <button className={`${styles.tabButton} ${styles.lastTabButton} ${selectedTab===1? styles.selectedTab:styles.inactiveTab}`}
                    onClick={()=>{ setSelectedTab(1) }}> GigaChads </button>
            </div>
                
                <div className={styles.tabPanel} hidden={selectedTab===0? false:true} key={'myStats'}>
                    {  gameStatistics.categories.map( (entry:StatisticCategory,index:number ) => {
                        const statisticData = gameStatistics.myStatistics.find( stat => stat.game_statistic_category_id === entry.id )
                        const idKey = entry.id as number;
                        const isTopScore = idKey? gameStatistics.mytopScores[idKey]: false;
                        return(
                            <div key={`myStats#${index}`}>  
                                { (statisticData && statisticData.value>0) ? 
                                    <div className={styles.entryWrapper} key={entry.name}>
                                        <div className={styles.statsEntry}>
                                            <div className={styles.entryName}>{entry.name}</div>
                                            <div className={styles.entryAmount}>{statisticData?.value}</div>
                                        </div>
                                        { isTopScore? 
                                            <div className={styles.topScoreContainer}>
                                                <img src={starIcon} style={{height: '2rem'}} alt={'top score!'}/>
                                                Top score!
                                            </div>
                                        : null}
                                    </div>
                                : null}
                            </div>
                            )
                        })
                    }
                </div>
                <div className={styles.tabPanel} hidden={selectedTab===1? false:true} key={'gigaChads'}>
                    { gameStatistics.categories.map( (entry,index) => {
                        const gotchiId = gameStatistics.roomTopScores[entry.id]?.playerId;
                        const gotchiSVG = `${gotchiSVGs[gotchiId]}`;
                        return(
                            <div key={`myStats#${index}`}>  
                                 { ( gameStatistics.roomTopScores[entry.id] && gameStatistics.roomTopScores[entry.id].total>0) ? 
                                <div className={styles.entryWrapper} key={entry.name}>
                                    <div className={styles.statsEntry}>
                                        <div className={styles.entryName}>{entry.name}</div>
                                        <div className={styles.entryAmount}>{gameStatistics.roomTopScores[entry.id]?.total}</div>
                                    </div>
                                    <img src={gotchiSVG} className={styles.gotchiContainer} alt={`Gotchi#${gotchiId}`}/>
                                </div>
                                : null}
                            </div>
                            )
                        })
                    }
                </div>
        </> 
    )
}

export default StatisticsTabs