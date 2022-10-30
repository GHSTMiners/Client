import styles from "./styles.module.css";
import globalStyles from 'theme/globalStyles.module.css';
import { DepthGraph } from "./components/DepthGraph";
import GotchiPreview from "components/GotchiPreview";
import cupWinner from "assets/svgs/cup_winner.svg"
import RoomRanking from "./components/RoomRanking";
import StatisticsTabs from "./components/StatisticTabs";
import { useGlobalStore } from "store";
import { useParams } from "react-router-dom";

const EndGame= () => {
    // 'f4d626eb-c3be-4f06-9483-a490403d257c'
    const roomLeaderboard = useGlobalStore( state=> state.roomLeaderboard)
    const {roomId,gotchiId} = useParams();

    return(
        <div className={styles.basicGrid}>
            <div className={`${globalStyles.gridTile} ${styles.roomRanking}`} >
                <div className={globalStyles.tileTitle} style={{alignSelf: 'flex-start'}}> Ranking </div>
                <div className={globalStyles.tileContent} >
                    <div className={styles.rankingPanel}>
                        <RoomRanking />
                        <div className={styles.gotchiContainer}>
                            <GotchiPreview tokenId={`${roomLeaderboard[0]?.gotchi.gotchi_id}`}  />
                            <img src={cupWinner} className={styles.cup} alt={'champion_cup'}/>
                        </div>
                    </div>
                </div>
            </div>

            <div className={`${globalStyles.gridTile} ${styles.myStats}`}>
                <StatisticsTabs roomId={  roomId as string} gotchiId = {gotchiId as string} />
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
