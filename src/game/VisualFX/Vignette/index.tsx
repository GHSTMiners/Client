import { useGlobalStore } from "store";
import styles from "./styles.module.css";

const Vignette = () => {
    const depth = useGlobalStore( state => state.depth);
    
    return(
        <div className={
            (depth>8)? 
                  `${styles.gameVignette} ${styles.underground}` 
                : `${styles.gameVignette} ${styles.aboveground}`}>
        </div>
    )
}


export default Vignette