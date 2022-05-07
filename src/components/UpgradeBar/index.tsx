import { PricePair } from "components/MiningShop/TabUpgrades";
import { hexConcat } from "ethers/lib/utils";
import React, { useState } from "react";
import styles from "./styles.module.css";

interface Props {
  text?: string;
  initialLevel?:number;
  upgradeCost?:PricePair[];
  onUpgrade?: () => void;
}

const UpgradeBar: React.FC<Props> = ({
  text,
  initialLevel = 0,
  upgradeCost= [] as PricePair[],
  onUpgrade
}) => {

  type upgradeObj = { name: string; color: string };

  // Defining the tags and colors of all possible upgrade levels
  const [ upgradeLevel, setUpgradeLevel ]=useState(initialLevel);

  let upgradeLevelArray: upgradeObj[] = [];
  upgradeLevelArray.push({name:'common', color:'#7f63ff'});
  upgradeLevelArray.push({name:'uncommon', color:'#33bacc'});
  upgradeLevelArray.push({name:'rare', color:'#59bcff'});
  upgradeLevelArray.push({name:'legendary', color:'#ffc36b'});
  upgradeLevelArray.push({name:'mythical', color:'#ff96ff'});
  upgradeLevelArray.push({name:'godlike', color:'#51ffa8'});
  
  //
  const purchaseUpgrade = ()=>{
    if (upgradeLevel<upgradeLevelArray.length-1) {
      setUpgradeLevel(upgradeLevel+1); // TO DO: replace this with an upgrade message to the server if funds are available
    }
  }

  // creatng definition of each of the upgradable levels
  const renderUpgradeLevel = (name: string, color: string, disabled: boolean) => (
    <div className={styles.levelElement} style={{backgroundColor:color}} >
    </div>
  );

  // rendering the array of level elements and storing into one variable
  const upgradeLevels = upgradeLevelArray.map( (upgradeElement , index) => {
    return(  
      ( index<=upgradeLevel ? renderUpgradeLevel( upgradeElement.name, upgradeLevelArray[upgradeLevel].color, false ) : '')  
      );
  });

  // rendering function of the total upgrading cost
 const renderedCostArray= upgradeCost.map( entry => {
   return(
     <>
        {entry.cost} x ID:{entry.cryptoId} ;   
     </>
   )
 })

  return (
    <div className={styles.upgradeRowContainer} id={text} >
      
      <div className={styles.upgradeBarTitle}>
        {text}
      </div>

      <div className={styles.costContainer}>
        {renderedCostArray}
      </div>
    
      <div className={styles.upgradeBarContainer}>
        <button className={styles.upgradeButton}
                onClick={purchaseUpgrade} >
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
