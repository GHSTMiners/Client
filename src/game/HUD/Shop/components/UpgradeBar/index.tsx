import { PricePair } from "types"
import React, { useEffect, useState } from "react";
import styles from "./styles.module.css";
import { UpgradeTags } from "helpers/vars"
import upgradeSound from "assets/sounds/upgrade.mp3"
import { useGlobalStore } from "store";

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
  const playerCrypto = useGlobalStore( state => state.playerCrypto);
  const worldCrypto = useGlobalStore( state => state.worldCrypto )

  const playAudioEffect = () => {
    new Audio(upgradeSound).play();
  }

  // Checking if the player has all the coins required & refreshing after upgraded
  useEffect(()=>{
    let coinsAvailable = 0; 
    upgradeCost.forEach( costEntry => {
      if (playerCrypto[costEntry.cryptoId] && playerCrypto[costEntry.cryptoId]>= costEntry.cost ){
         coinsAvailable = coinsAvailable + 1;
      }        
    });
    setUpgradeLevel(currentTier)
    setUpgradeAvailable( coinsAvailable === upgradeCost.length && upgradeLevel<UpgradeTags.length-1  ) 
  },[ upgradeCost, playerCrypto, upgradeLevel, currentTier])

  // creatng definition of each of the upgradable levels
  const renderUpgradeLevel = (name: string, color: string, disabled: boolean, index:number) => (
    <div className={ disabled? styles.disabledElement: styles.enabledElement} 
         style={{backgroundColor:color}} 
         key={`upgradeTier${index}`}>
    </div>
  );

  // rendering the array of level elements and storing into one variable
  const upgradeLevels = UpgradeTags.map( (upgradeElement , index) => {
    return(  
      ( index<=upgradeLevel ? 
          renderUpgradeLevel( upgradeElement.name, UpgradeTags[upgradeLevel].color, false , index) 
          : renderUpgradeLevel( upgradeElement.name, 'transparent', true , index) )  
      );
  });

  // rendering function of the total upgrading cost
 const renderedCostArray= upgradeCost.map( entry => {
  return(
    <div key={`costUpgrade${entry.cryptoId}`}>
       {entry.cost} x
       <img src={worldCrypto[entry.cryptoId]?.image} 
            alt={worldCrypto[entry.cryptoId]?.name}
            className={`${styles.exchangeCoin}
                   ${ (playerCrypto[entry.cryptoId]>=entry.cost) ? 
                    styles.upgradeAvailable: styles.upgradeUnavailable}`}
       />   
    </div>
  )
 })

  return (
    <div className={styles.upgradeRowContainer} key={`${upgradeLabel}_bar`} >
      
      <div className={styles.upgradeBarTitle}>
        {upgradeLabel}
      </div>

      <div className={styles.costContainer}>
        {renderedCostArray}
      </div>
    
      <div className={styles.upgradeBarContainer}>
        <button className={`${styles.upgradeButton}
                          ${upgradeAvailable? '' : styles.buttonUnavailable}`}
                onClick={() => { 
                  if (upgradeLevel<UpgradeTags.length-1 && upgradeAvailable) {
                    purchaseCallback()
                    playAudioEffect()
                    }  
                  } 
                  } >
          <div className={styles.upgradeButtonText}>UPGRADE</div>        
        </button>  

        <div className={styles.levelContainer}>
          {upgradeLevels}
        </div>
      </div>
     
    </div>
  );
};

export default UpgradeBar;
