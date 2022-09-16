import gameEvents from "game/helpers/gameEvents";
import Client from "matchmaking/Client";
import { useEffect, useState } from "react";
import { useGlobalStore } from "store";
import styles from "./minedCryptoFX.module.css"

const MinedCryptoFX = () => {
    
    const worldCrypto = useGlobalStore( state => state.worldCrypto );
    const playerCargo = useGlobalStore( state => state.playerCargo );
    const [ selectedCoin, setSelectedCoin ] = useState('');
    const [ hidden, setHidden ] = useState(true)

    useEffect(()=>{
      const updateDialog = (id:string) => {
        setHidden(false)
        setSelectedCoin(id)
      }
      Client.getInstance().phaserGame.events.on( gameEvents.game.MINEDCRYSTAL , updateDialog)

      return () =>{
        Client.getInstance().phaserGame.events.off( gameEvents.game.MINEDCRYSTAL , updateDialog)
      }
    },[playerCargo, hidden])

    return(
      <div className={`${styles.dialogContainer} 
                        ${(hidden || playerCargo[+selectedCoin] === 0)? styles.hide: styles.show} `} 
            key = {`${selectedCoin}_${playerCargo[+selectedCoin]}`} 
            onAnimationEnd = { () => setHidden(true) }>
        <div className={styles.minedCryptoContainer}>
          <div className={styles.crystalContainer}>
            <img className={styles.crystalPreview} 
                src={worldCrypto[+selectedCoin]?.crystal} 
                key = {`${selectedCoin}_${playerCargo[+selectedCoin]}_image`} 
                alt={worldCrypto[+selectedCoin]?.name}/>
          </div>
          +<span className={styles.rollingCounterContainer}>
            <div className={styles.rollingWrapper}>
              <div className={styles.rollingNumber}>  
                {playerCargo[+selectedCoin]? playerCargo[+selectedCoin]-1 : 0}
              </div>
              <div className={styles.rollingNumber}> 
                {playerCargo[+selectedCoin]? playerCargo[+selectedCoin] : 0} 
              </div>
            </div>
          </span>
        </div>      
      </div>
    )
}

export default MinedCryptoFX