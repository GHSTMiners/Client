import { useGlobalStore } from "store";
import styles from "./styles.module.css";

const Vignette = () => {
    const playerDepth = useGlobalStore( state => state.playerDepth);
    
    return(
        <div className={
            (playerDepth>8)? 
                  `${styles.gameVignette} ${styles.underground}` 
                : `${styles.gameVignette} ${styles.aboveground}`}>
        </div>
    )
}


export default Vignette