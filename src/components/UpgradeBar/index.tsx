import { PricePair } from "components/MiningShop/TabUpgrades";
import React, { useState } from "react";
import styles from "./styles.module.css";
import * as Chisel from "chisel-api-interface";
import Client from "matchmaking/Client";

interface Props {
  upgradeLabel?: string;
  initialLevel?:number;
  upgradeCost?:PricePair[];
  purchaseCallback?: () => void;
}

const UpgradeBar: React.FC<Props> = ({
  upgradeLabel,
  initialLevel = 0,
  upgradeCost= [] as PricePair[],
  purchaseCallback,
}) => {

  type upgradeObj = { name: string; color: string };

  // Defining the tags and colors of all possible upgrade levels
  const [ upgradeLevel, setUpgradeLevel ]=useState(initialLevel);
  const world: Chisel.DetailedWorld | undefined =   Client.getInstance().chiselWorld;

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
      if (purchaseCallback){
        purchaseCallback(); // executes external routine
      }
    }
  }

  // creatng definition of each of the upgradable levels
  const renderUpgradeLevel = (name: string, color: string, disabled: boolean, index:number) => (
    <div className={styles.levelElement} style={{backgroundColor:color}} key={`upgradeTier${index}`}>
    </div>
  );

  // rendering the array of level elements and storing into one variable
  const upgradeLevels = upgradeLevelArray.map( (upgradeElement , index) => {
    return(  
      ( index<=upgradeLevel ? renderUpgradeLevel( upgradeElement.name, upgradeLevelArray[upgradeLevel].color, false , index) : '')  
      );
  });

  // rendering function of the total upgrading cost
 const renderedCostArray= upgradeCost.map( entry => {

  const entryImage = world.crypto.find( coin => coin.id == entry.cryptoId);

  return(
    <div key={`costUpgrade${entry.cryptoId}`}>
       {entry.cost} x
       <img src={`https://chisel.gotchiminer.rocks/storage/${entryImage?.wallet_image}`} className={styles.exchangeCoin} />   
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
