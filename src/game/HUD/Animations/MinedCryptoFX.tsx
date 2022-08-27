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
          <div className={styles.refinedCoinContainer}>
            <img className={styles.crystalPreview} src={hudContext.world.crypto[+selectedCoin]?.crystal} alt={hudContext.world.crypto[+selectedCoin]?.name}/>
          </div>
          +{hudContext.player.crystals[+selectedCoin]}
        </div>      
      </div>
    )
}

export default MinedCryptoFX