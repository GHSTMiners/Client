import styles from "./styles.module.css";
import globalStyles from 'theme/globalStyles.module.css';
import { DepthGraph } from "./components/DepthGraph";
import GotchiPreview from "components/GotchiPreview";
import cupWinner from "assets/svgs/cup_winner.svg"
import RoomRanking from "./components/RoomRanking";
import StatisticsTabs from "./components/StatisticTabs";

const EndGame= () => {
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
                <StatisticsTabs />
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