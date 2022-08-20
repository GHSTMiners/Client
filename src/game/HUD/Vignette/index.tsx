import { useContext } from "react";
import { HUDContext } from "..";
import styles from "./styles.module.css";

const Vignette = () => {
    const hudContext = useContext(HUDContext);
    
    return(
        <div className={
            (hudContext.player.depth>8)? 
                  `${styles.gameVignette} ${styles.underground}` 
                : `${styles.gameVignette} ${styles.aboveground}`}>
        </div>
    )
}


export default Vignette