import goldMedal from "assets/svgs/gold_medal.svg"
import silverMedal from "assets/svgs/silver_medal.svg"
import bronzeMedal from "assets/svgs/bronze_medal.svg"
import noMedal from "assets/svgs/no_medal.svg"
import styles from "./styles.module.css"
import { useGlobalStore } from "store"

const RoomRanking = () => {
    const roomLeaderboard = useGlobalStore( state => state.roomLeaderboard );
    const gotchiNames = useGlobalStore( state => state.gotchiNames );
    return(
        <>
            <div className={styles.rankingWrapper}> 
                {roomLeaderboard.map((element,index) => {
                    let iconImage = ''
                    let coinStyle = styles.noMedal
                    switch  (index){
                        case 0:
                            iconImage = goldMedal;
                            coinStyle = styles.goldenMedalContainer;
                            break;
                        case 1:
                            iconImage = silverMedal;
                            coinStyle = styles.silverMedalContainer;
                            break;
                        case 2:
                            iconImage = bronzeMedal;
                            coinStyle = styles.bronzeMedalContainer;
                            break;
                        default:
                            iconImage = noMedal;
                            break;
                    }

                    return( 
                     <div className={styles.rankingEntry} key={element.gotchi.gotchi_id}>
                        <div className={coinStyle}>
                            <img src={iconImage} className={styles.medal} alt={`rank${index+1}_medal`}/>
                        </div>
                        <div className={styles.rankEntryData}>
                            <div className={styles.rankName}>{gotchiNames[element.gotchi.gotchi_id]}</div>
                            <div className={styles.rankValue}>{`$ ${element.value}`}</div>
                        </div>
                     </div>) 
                })}
            </div>
        </>
    )
}

export default RoomRanking