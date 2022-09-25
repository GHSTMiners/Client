import { ProgressBar } from 'react-bootstrap'
import styles from './styles.module.css'
import { useGlobalStore } from 'store';

const LobbyCountdown = () => {
    const lobbyCountdown= useGlobalStore( store => store.lobbyCountdown );

    const renderCountdown = (time:number)=>{
        const minutes = Math.floor(time/60);
        const seconds = time - (minutes*60);
        return(
          <>
            {minutes} : {(seconds<10)? `0${seconds}`: seconds}
          </>
        )
    }

    return(
        <div className={`${styles.countdownContainer} ${(lobbyCountdown<15 && lobbyCountdown>0)?styles.countdownLocked:''} `}>
              <div className={styles.progressBarContainer}>
                <ProgressBar className={styles.progressBar} variant="danger" animated now={lobbyCountdown/300*100}/>
                <div className={styles.progressBarLabel}>
                  {renderCountdown(lobbyCountdown)}
                </div>
              </div>
        </div>
    )
}

export default LobbyCountdown