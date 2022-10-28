import { useState } from "react";
import starIcon from "assets/svgs/star.svg"
import styles from "./styles.module.css"
import useGameStatistics from "hooks/useGameStatistics";

const StatisticsTabs = () => {
    const [selectedTab, setSelectedTab] = useState<number>(0);
    const gameStatistics = useGameStatistics();
    console.log(gameStatistics.myStatistics)
    return(
        <>
            <div className={styles.tabHeaderButton}>
                <button className={`${styles.tabButton} ${styles.firstTabButton} ${selectedTab===0? styles.selectedTab: styles.inactiveTab}`}
                    onClick={()=>{ setSelectedTab(0) }}> My stats </button>

                <button className={`${styles.tabButton} ${styles.lastTabButton} ${selectedTab===1? styles.selectedTab:styles.inactiveTab}`}
                    onClick={()=>{ setSelectedTab(1) }}> GigaChads </button>
            </div>
                
                <div className={styles.tabPanel} hidden={selectedTab===0? false:true}>
                    {  gameStatistics.categories.map( entry => {
                        const statisticData = gameStatistics.myStatistics.find( stat => stat.game_statistic_category_id === entry.id )
                        const topScore = gameStatistics.mytopScore[entry.id];
                        return(
                            <>  
                                { (statisticData && statisticData.value>0) ? 
                                    <div className={styles.entryWrapper}>
                                        <div className={styles.statsEntry}>
                                            <div className={styles.entryName}>{entry.name}</div>
                                            <div className={styles.entryAmount}>{statisticData?.value}</div>
                                        </div>
                                        { topScore? 
                                            <div className={styles.topScoreContainer}>
                                                <img src={starIcon} style={{height: '2rem'}} alt={'top score!'}/>
                                                Top score!
                                            </div>
                                        : null}
                                    </div>
                                : null}
                            </>
                            )
                        })
                    }
                </div>
                <div className={styles.tabPanel} hidden={selectedTab===1? false:true}>
                    Work in progress...
                </div>
        </>
    )
}

export default StatisticsTabs