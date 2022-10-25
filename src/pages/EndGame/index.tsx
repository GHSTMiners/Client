import styles from "./styles.module.css";
import globalStyles from 'theme/globalStyles.module.css';
import { DepthGraph } from "./DepthGraph";
import GotchiPreview from "components/GotchiPreview";
import cupWinner from "assets/svgs/cup_winner.svg"


type RankingData = { cryptoValue: number, gotchiName: string}
const fakeData: RankingData[] = [
    { cryptoValue: 250340, gotchiName: 'Voyager'},
    { cryptoValue: 198652, gotchiName: 'Tyson Fury'},
    { cryptoValue: 165351, gotchiName: 'Machete'},
    { cryptoValue: 122110, gotchiName: 'Corleone'},
    { cryptoValue: 95639, gotchiName: 'Yoda'},
];

const EndGame= () => {
    return(
        <div className={styles.basicGrid}>
            <div className={`${globalStyles.gridTile} ${styles.roomRanking}`} >
                <div className={globalStyles.tileTitle} style={{alignSelf: 'flex-start'}}> Ranking </div>
                <div className={globalStyles.tileContent} >
                    <div className={styles.rankingPanel}>
                        <div className={styles.rankingWrapper}> 
                            {fakeData.map(element => {
                                   return( 
                                    <div className={styles.rankingEntry} key={element.gotchiName}>
                                        <div className={styles.rankName}>{element.gotchiName}</div>
                                        <div className={styles.rankValue}>{`$ ${element.cryptoValue}`}</div>

                                    </div>) 
                            })}
                        </div>
                        <div className={styles.gotchiContainer}>
                            <GotchiPreview tokenId={'22536'}  />
                            <img src={cupWinner} className={styles.cup}/>
                        </div>
                    </div>
                </div>
            </div>

            <div className={`${globalStyles.gridTile} ${styles.myStats}`}>
                WARNING! THIS DATA IS NOT RELATED TO YOUR GAME, COMING SOON...
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