import { useState } from "react";
import styles from "./styles.module.css"

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
                    <div className={styles.statsEntry}>Mined blocks</div>
                    <div className={styles.statsEntry}>Collected Money</div>
                    <div className={styles.statsEntry}>Endgame crypto</div>
                    <div className={styles.statsEntry}>Damage taken</div>
                    <div className={styles.statsEntry}>Amount spent in explosives</div>
                    <div className={styles.statsEntry}>Amount spent in upgrades</div>
                    <div className={styles.statsEntry}>Travelled distance</div>
                    <div className={styles.statsEntry}>Fueld consumed</div>
                </div>
                <div className={styles.tabPanel} hidden={selectedTab===1? false:true}>
                    <div className={styles.statsEntry}>Chad Mined blocks</div>
                    <div className={styles.statsEntry}>Chad Collected Money</div>
                    <div className={styles.statsEntry}>Chad Endgame crypto</div>
                    <div className={styles.statsEntry}>Chad Damage taken</div>
                    <div className={styles.statsEntry}>Amount spent in explosives</div>
                    <div className={styles.statsEntry}>Amount spent in upgrades</div>
                    <div className={styles.statsEntry}>Travelled distance</div>
                    <div className={styles.statsEntry}>Fueld consumed</div>
                </div>
            
        </>
    )
}

export default StatisticsTabs