import gameEvents from "game/helpers/gameEvents";
import Client from "matchmaking/Client";
import { useContext, useEffect, useState } from "react";
import { IndexedArray } from "types";
import { HUDContext } from "..";
import styles from "./refineCryptoFX.module.css"

const RefineCryptoFX = () => {
    const hudContext = useContext(HUDContext);
    const [ selectedCoin, setSelectedCoin ] = useState('');
    const [ hidden, setHidden ] = useState(true)
    const [ processedCargo, setProcessedCargo ] = useState<IndexedArray>({});

    useEffect(()=>{
      const checkCargo = () => {
        if ( Object.keys(hudContext.player.crystals).length > 0){
          setHidden(false)
          // find coin associated with the biggest cargo
          setProcessedCargo({...hudContext.player.crystals})
          const biggestCoinKey = Object.keys(hudContext.player.crystals).reduce(function(prev, current) {
            return ( hudContext.player.crystals[+prev] > hudContext.player.crystals[+current] ) ? prev : current
          }) 
          let coinImage = hudContext.world.crypto[+biggestCoinKey].image ;
          setSelectedCoin( coinImage )
        }
      }

      Client.getInstance().phaserGame.events.on( gameEvents.refinary.REFINE , checkCargo)

      return () =>{
        Client.getInstance().phaserGame.events.off( gameEvents.refinary.REFINE , checkCargo)
      }
    },[hudContext.player.crystals,hudContext.world.crypto, hidden])

    return(
      <>        
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

        <div className={styles.cargoInfoContainer} hidden = {hidden}>
            { Object.keys(processedCargo).map( key =>{
              return(
               <div className={styles.cargoCoinContainer}>
                <div className={styles.refinedCoinContainer}>
                  <img className={styles.coinPreview} src={hudContext.world.crypto[+key].image} alt={hudContext.world.crypto[+key].name}/>
                </div>
                  +{processedCargo[+key]}
               </div> 
              )
            }) }
        </div>

      </>

    )
}

export default RefineCryptoFX