import { useState } from "react";
import starIcon from "assets/svgs/star.svg"
import styles from "./styles.module.css"

type roomStatsData = { name: string, amount: number};
const fakeData: roomStatsData[] = [
    { name: 'Blocks Mined', amount: 986},
    { name: 'Collected Money', amount: 123456},
    { name: 'Endgame crypto', amount: 99653},
    { name: 'Damage taken', amount: 159},
    { name: 'Amount spent in explosives', amount: 655},
    { name: 'Amount spent in upgrades', amount: 1450},
    { name: 'Travelled distance', amount: 123512},
    { name: 'Fueld consumed', amount: 400},
]

const StatisticsTabs = () => {
    const [selectedTab, setSelectedTab] = useState<number>(0);

    return(
        <>
            <div className={styles.tabHeaderButton}>
                <button className={`${styles.tabButton} ${styles.firstTabButton} ${selectedTab===0? styles.selectedTab: styles.inactiveTab}`}
                    onClick={()=>{ setSelectedTab(0) }}> My stats </button>

                <button className={`${styles.tabButton} ${styles.lastTabButton} ${selectedTab===1? styles.selectedTab:styles.inactiveTab}`}
                    onClick={()=>{ setSelectedTab(1) }}> GigaChads </button>
            </div>
                
                <div className={styles.tabPanel} hidden={selectedTab===0? false:true}>
                    {  fakeData.map( entry => {
                        return(
                            <>  
                                <div className={styles.entryWrapper}>
                                    <div className={styles.statsEntry}>
                                        <div className={styles.entryName}>{entry.name}</div>
                                        <div className={styles.entryAmount}>{entry.amount}</div>
                                    </div>
                                    <div className={styles.topScoreContainer}>
                                        <img src={starIcon} style={{height: '2rem'}} alt={'top score!'}/>
                                        Top score!
                                    </div>
                                </div>
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