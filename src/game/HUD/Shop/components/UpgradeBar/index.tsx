import { PricePair } from "types"
import React, { useEffect, useState } from "react";
import styles from "./styles.module.css";
import { UpgradeTags } from "helpers/vars"
import { useGlobalStore } from "store";
import useSoundFXManager from "hooks/useSoundFXManager";

interface Props {
  upgradeId:number;
  upgradeLabel?: string;
  currentTier:number;
  upgradeCost?:PricePair[];
  purchaseCallback: () => void;
}

const UpgradeBar: React.FC<Props> = ({
  upgradeId,
  upgradeLabel,
  currentTier ,
  upgradeCost= [] as PricePair[],
  purchaseCallback,
}) => {
  const [ upgradeLevel, setUpgradeLevel ]= useState(currentTier);
  const [ upgradeAvailable, setUpgradeAvailable] = useState(false);
  const wallet = useGlobalStore( state => state.wallet);
  const worldCrypto = useGlobalStore( state => state.worldCrypto )
  const soundFXManager = useSoundFXManager();

  // Checking if the player has all the coins required & refreshing after upgraded
  useEffect(()=>{
    let coinsAvailable = 0; 
    upgradeCost.forEach( costEntry => {
      if (wallet[costEntry.cryptoId] && wallet[costEntry.cryptoId]>= costEntry.cost ){
         coinsAvailable = coinsAvailable + 1;
      }        
    });
    setUpgradeLevel(currentTier)
    setUpgradeAvailable( coinsAvailable === upgradeCost.length && upgradeLevel<UpgradeTags.length-1  ) 
  },[ upgradeCost, wallet, upgradeLevel, currentTier])

  return (
    <div className={styles.upgradeRowContainer} key={`${upgradeLabel}_bar_ID${upgradeId}`} >
      
      <div className={styles.upgradeBarTitle}>
        {upgradeLabel}
      </div>

      <div className={styles.costContainer}>
        {upgradeCost.map( entry => {
          return(
          <div key={`costUpgrade${entry.cryptoId}`}>
             {entry.cost} x
             <img src={worldCrypto[entry.cryptoId]?.image} 
                  alt={worldCrypto[entry.cryptoId]?.name}
                  className={`${styles.exchangeCoin}
                         ${ (wallet[entry.cryptoId]>=entry.cost) ? 
                          styles.upgradeAvailable: styles.upgradeUnavailable}`}
             />   
          </div>)
        })}
      </div>
    
      <div className={styles.upgradeBarContainer}>
        <button className={`${styles.upgradeButton}
                          ${upgradeAvailable? '' : styles.buttonUnavailable}`}
                onClick={() => { 
                  if (upgradeLevel<UpgradeTags.length-1 && upgradeAvailable) {
                    purchaseCallback()
                    soundFXManager.play('upgraded');
                    }  
                  } 
                  } >
          <div className={styles.upgradeButtonText}>UPGRADE</div>        
        </button>  

        <div className={styles.levelContainer}>
          { UpgradeTags.map( (upgradeElement , index) => {
              const isAvailable = index<=upgradeLevel
              const upgradeColor = isAvailable? UpgradeTags[upgradeLevel].color : 'transparent'
              return(  
                 <div className={ isAvailable? styles.enabledElement: styles.disabledElement } 
                      style={{backgroundColor:upgradeColor}} 
                      key={`upgradeTier${index}`}>
                  </div>
                );
            }) }
        </div>
      </div>
     
    </div>
  );
};

export default UpgradeBar;
