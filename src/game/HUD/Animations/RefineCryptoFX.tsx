import gameEvents from "game/helpers/gameEvents";
import Client from "matchmaking/Client";
import { useEffect, useState } from "react";
import { useGlobalStore } from "store";
import { IndexedArray } from "types";
import styles from "./refineCryptoFX.module.css"

const RefineCryptoFX = () => {
    const playerCargo = useGlobalStore( state => state.playerCargo );
    const worldCrypto = useGlobalStore( state => state.worldCrypto );
    const [ selectedCoin, setSelectedCoin ] = useState('');
    const [ hidden, setHidden ] = useState(true)
    const [ processedCargo, setProcessedCargo ] = useState<IndexedArray>({});

    useEffect(()=>{
      const checkCargo = () => {
        if ( Object.keys(playerCargo).length > 0){
          setHidden(false)
          // find coin associated with the biggest cargo
          setProcessedCargo({...playerCargo})
          const biggestCoinKey = Object.keys(playerCargo).reduce(function(prev, current) {
            return ( playerCargo[+prev] > playerCargo[+current] ) ? prev : current
          }) 
          let coinImage = worldCrypto[+biggestCoinKey].image ;
          setSelectedCoin( coinImage )
        }
      }

      Client.getInstance().phaserGame.events.on( gameEvents.refinary.REFINE , checkCargo)

      return () =>{
        Client.getInstance().phaserGame.events.off( gameEvents.refinary.REFINE , checkCargo)
      }
    },[playerCargo,worldCrypto, hidden])

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

        <div className={`${styles.cargoInfoContainer} ${ hidden? styles.hide: styles.show}`} >
            { Object.keys(processedCargo)
            .filter( key => processedCargo[+key] > 0 )
            .map( key =>{
              return(
               <div className={styles.cargoCoinContainer} key={`cargo_crystal_${key}`}>
                <div className={styles.refinedCoinContainer}>
                  <img className={styles.coinPreview} src={worldCrypto[+key].image} alt={worldCrypto[+key].name}/>
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