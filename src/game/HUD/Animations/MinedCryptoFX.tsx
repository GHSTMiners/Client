import gameEvents from "game/helpers/gameEvents";
import Client from "matchmaking/Client";
import { useContext, useEffect, useState } from "react";
import { HUDContext } from "..";
import styles from "./minedCryptoFX.module.css"

const MinedCryptoFX = () => {
    const hudContext = useContext(HUDContext);
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
    },[hudContext.player.crystals,hudContext.world.crypto, hidden])

    return(
      <div className={`${styles.dialogContainer} 
                        ${(hidden || hudContext.player.crystals[+selectedCoin] === 0)? styles.hide: styles.show} `} 
            key = {`${selectedCoin}_${hudContext.player.crystals[+selectedCoin]}`} 
            onAnimationEnd = { () => setHidden(true) }>
        <div className={styles.minedCryptoContainer}>
          <div className={styles.crystalContainer}>
            <img className={styles.crystalPreview} 
                src={hudContext.world.crypto[+selectedCoin]?.crystal} 
                key = {`${selectedCoin}_${hudContext.player.crystals[+selectedCoin]}_image`} 
                alt={hudContext.world.crypto[+selectedCoin]?.name}/>
          </div>
          +<span className={styles.rollingCounterContainer}>
            <div className={styles.rollingWrapper}>
              <div className={styles.rollingNumber}>  
                {hudContext.player.crystals[+selectedCoin]? hudContext.player.crystals[+selectedCoin]-1 : 0}
              </div>
              <div className={styles.rollingNumber}> 
                {hudContext.player.crystals[+selectedCoin]? hudContext.player.crystals[+selectedCoin] : 0} 
              </div>
            </div>
          </span>
        </div>      
      </div>
    )
}

export default MinedCryptoFX