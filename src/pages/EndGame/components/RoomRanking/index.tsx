import goldMedal from "assets/svgs/gold_medal.svg"
import silverMedal from "assets/svgs/silver_medal.svg"
import bronzeMedal from "assets/svgs/bronze_medal.svg"
import noMedal from "assets/svgs/no_medal.svg"
import styles from "./styles.module.css"


type RankingData = { cryptoValue: number, gotchiName: string}

const fakeData: RankingData[] = [
    { cryptoValue: 250340, gotchiName: 'Voyager'},
    { cryptoValue: 198652, gotchiName: 'Tyson Fury'},
    { cryptoValue: 165351, gotchiName: 'Machete'},
    { cryptoValue: 122110, gotchiName: 'Corleone'},
    { cryptoValue: 95639, gotchiName: 'Yoda'},
];

const RoomRanking = () => {
    return(
        <>
            <div className={styles.rankingWrapper}> 
                {fakeData.map((element,index) => {
                    let iconImage = ''
                    switch  (index){
                        case 0:
                            iconImage = goldMedal;
                            break;
                        case 1:
                            iconImage = silverMedal;
                            break;
                        case 2:
                            iconImage = bronzeMedal;
                            break;
                        default:
                            iconImage = noMedal;
                            break;
                    }

                    return( 
                     <div className={styles.rankingEntry} key={element.gotchiName}>
                        <img src={iconImage} className={styles.medal} alt={`rank${index+1}_medal`}/>
                        <div className={styles.rankEntryData}>
                            <div className={styles.rankName}>{element.gotchiName}</div>
                            <div className={styles.rankValue}>{`$ ${element.cryptoValue}`}</div>
                        </div>
                     </div>) 
                })}
            </div>
        </>
    )
}

export default RoomRanking