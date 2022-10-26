import styles from "./styles.module.css";
import globalStyles from 'theme/globalStyles.module.css';
import { DepthGraph } from "./components/DepthGraph";
import GotchiPreview from "components/GotchiPreview";
import cupWinner from "assets/svgs/cup_winner.svg"
import statisticsTabs from "./tabs";
import { useState } from "react";
import SlickTabs from "components/SlickTabs";
import RoomRanking from "./components/RoomRanking";

const EndGame= () => {
    const [selectedTab, setSelectedTab] = useState<number>(statisticsTabs[0].index);
    return(
        <div className={styles.basicGrid}>
            <div className={`${globalStyles.gridTile} ${styles.roomRanking}`} >
                <div className={globalStyles.tileTitle} style={{alignSelf: 'flex-start'}}> Ranking </div>
                <div className={globalStyles.tileContent} >
                    <div className={styles.rankingPanel}>
                        <RoomRanking />
                        <div className={styles.gotchiContainer}>
                            <GotchiPreview tokenId={'22536'}  />
                            <img src={cupWinner} className={styles.cup} alt={'champion_cup'}/>
                        </div>
                    </div>
                </div>
            </div>

            <div className={`${globalStyles.gridTile} ${styles.myStats}`}>
                <SlickTabs selectedTab={selectedTab} onClick={setSelectedTab} tabs={statisticsTabs} />
            </div> 
            
            <div className={`${globalStyles.gridTile} ${styles.depthHistory}`} >
                <div className={globalStyles.tileTitle} style={{alignSelf: 'flex-start'}}> Depth History </div>
                <div className={globalStyles.tileContent}>
                    <DepthGraph />
                </div>
            </div>
        </div>
    )
}

export default EndGame