import gameEvents from "game/helpers/gameEvents";
import Client from "matchmaking/Client";
import { useContext, useEffect, useState } from "react";
import { HUDContext } from "..";
import styles from "./refineCryptoFX.module.css"

const RefineCryptoFX = () => {
    const hudContext = useContext(HUDContext);
    const [ selectedCoin, setSelectedCoin ] = useState('');
    const [ hidden, setHidden ] = useState(true)

    useEffect(()=>{
      const checkCargo = () => {
        setHidden(false)
        // find coin associated with the biggest cargo
        const biggestCoinKey = Object.keys(hudContext.player.crystals).reduce(function(prev, current) {
          return ( hudContext.player.crystals[+prev] > hudContext.player.crystals[+current] ) ? prev : current
        }) 
        let coinImage = hudContext.world.crypto[+biggestCoinKey].image ;
        setSelectedCoin( coinImage )
      }

      Client.getInstance().phaserGame.events.on( gameEvents.refinary.REFINE , checkCargo)

      return () =>{
        Client.getInstance().phaserGame.events.off( gameEvents.refinary.REFINE , checkCargo)
      }
    },[hudContext.player.crystals,hudContext.world.crypto, hidden])

    return(
        <div className = {styles.coinFlip} 
            key = {selectedCoin} 
            hidden = {hidden} 
            onAnimationEnd = { () =>{
              setSelectedCoin('') ; 
              setHidden(true) } 
            }>
          <div className={styles.coinTails}>
            <img className={styles.coinImage} src={ selectedCoin } alt={'coinTail'} />
          </div>
          <div className={styles.coinHeads}>
            <img className={styles.coinImage} src={ selectedCoin } alt={'coinHeads'} />
          </div>
        </div>
    )
}

export default RefineCryptoFX