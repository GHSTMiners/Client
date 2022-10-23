import styles from "./styles.module.css";
import globalStyles from 'theme/globalStyles.module.css';

const EndGame= () => {
    return(
        <div className={styles.basicGrid}>
            <div className={`${globalStyles.gridTile} ${styles.roomRanking}`} >
                <div className={styles.textShine}>GAME OVER</div>
                Game statistics and much moaar will be displayed here
            </div>

            <div className={`${globalStyles.gridTile} ${styles.myStats}`} ></div> 
            
            <div className={`${globalStyles.gridTile} ${styles.depthHistory}`} ></div>

        </div>
    )
}

export default EndGame