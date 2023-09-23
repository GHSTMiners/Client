import arrowIcon from "assets/hud/arrow.svg"
import useSoundFXManager from "hooks/useSoundFXManager";
import { useGlobalStore } from "store";
import styles from "./styles.module.css"

const RetroToggle: React.FC = ()=> {
    const consoleState = useGlobalStore( state => state.consoleState);
    const setConsoleState = useGlobalStore( state => state.setConsoleState);
    const soundFXManager = useSoundFXManager();

    return(
        <div className={styles.buttonContainer} onClick={ () => setConsoleState(!consoleState) }>
            <div className={styles.buttonWrapper}>
                <div className={styles.expandButton}>
                      <img src={arrowIcon}
                        className={`${styles.expandIcon} 
                        ${ consoleState ? styles.expandIconUp : styles.expandIconDown}`}
                        onClick={ () => { 
                            setConsoleState(!consoleState) ; 
                            soundFXManager.play('switch')}}
                        alt={'Show/Hide Full Console'}/>
                </div>
                <div className={styles.buttonBase} />
            </div>
        </div>
    )
}

export default RetroToggle

