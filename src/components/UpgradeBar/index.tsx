import { PricePair } from "components/MiningShop/TabUpgrades";
import React, { useContext, useEffect, useState } from "react";
import styles from "./styles.module.css";
import * as Chisel from "chisel-api-interface";
import Client from "matchmaking/Client";
import { ShopContext } from "components/MiningShop";

interface Props {
  upgradeId:number;
  upgradeLabel?: string;
  currentTier:number;
  upgradeCost?:PricePair[];
  purchaseCallback?: () => void;
}

const UpgradeBar: React.FC<Props> = ({
  upgradeId,
  upgradeLabel,
  currentTier ,
  upgradeCost= [] as PricePair[],
  purchaseCallback,
}) => {

  type upgradeObj = { name: string; color: string };

  // Defining the tags and colors of all possible upgrade levels
  const [ upgradeLevel, setUpgradeLevel ]=useState(currentTier);
  const world: Chisel.DetailedWorld | undefined =   Client.getInstance().chiselWorld;

  let upgradeLevelArray: upgradeObj[] = [];
  const contextObj = useContext(ShopContext);
  const playerCrypto = contextObj.walletCrypto;
  upgradeLevelArray.push({name:'common', color:'#7f63ff'});
  upgradeLevelArray.push({name:'uncommon', color:'#33bacc'});
  upgradeLevelArray.push({name:'rare', color:'#59bcff'});
  upgradeLevelArray.push({name:'legendary', color:'#ffc36b'});
  upgradeLevelArray.push({name:'mythical', color:'#ff96ff'});
  upgradeLevelArray.push({name:'godlike', color:'#51ffa8'});

  // creatng definition of each of the upgradable levels
  const renderUpgradeLevel = (name: string, color: string, disabled: boolean, index:number) => (
    <div className={ disabled? styles.disabledElement: styles.enabledElement} 
         style={{backgroundColor:color}} 
         key={`upgradeTier${index}`}>
    </div>
  );

  // rendering the array of level elements and storing into one variable
  const upgradeLevels = upgradeLevelArray.map( (upgradeElement , index) => {
    return(  
      ( index<=upgradeLevel ? 
          renderUpgradeLevel( upgradeElement.name, upgradeLevelArray[upgradeLevel].color, false , index) 
          : renderUpgradeLevel( upgradeElement.name, 'transparent', true , index) )  
      );
  });

  // checking if the player has funds available for the upgrade
  let upgradeAvailable = false;
  const coinsRequired = upgradeCost.length;
  let coinsAvailable = 0;
  // Making sure that the player has all the coins required
  upgradeCost.forEach( costEntry => {
    let walletCoin = playerCrypto.find( walletEntry => walletEntry.id == costEntry.cryptoId);
    if (walletCoin){
      if (walletCoin.quantity>= costEntry.cost) coinsAvailable = coinsAvailable + 1;
    }        
  });
  if (coinsAvailable==coinsRequired) upgradeAvailable=true;

  // Purchased function executed 
  const purchaseUpgrade = ()=>{
    if (upgradeLevel<upgradeLevelArray.length-1) {
      if (purchaseCallback){
        if (upgradeAvailable) purchaseCallback(); // executes external routine
      }
    }
  }


  // rendering function of the total upgrading cost
 const renderedCostArray= upgradeCost.map( entry => {
  const entryImage = world.crypto.find( coin => coin.id == entry.cryptoId);
  let canBuy = false;
  playerCrypto.forEach( walletEntry => {
    if (walletEntry.id == entry.cryptoId) {
      if (walletEntry.quantity>=entry.cost) canBuy = true; 
    }
  }) 
  return(
    <div key={`costUpgrade${entry.cryptoId}`}>
       {entry.cost} x
       <img src={`https://chisel.gotchiminer.rocks/storage/${entryImage?.wallet_image}`} 
       className={`${styles.exchangeCoin}
                   ${canBuy? styles.upgradeAvailable: styles.upgradeUnavailable}`} />   
    </div>
  )
 })

 // Making sure that the UI update when a new upgrade is purchased
 const updateUpgradeTier = (id:number, tier:number)=>{
    if (id === upgradeId){
      setUpgradeLevel(tier);
    }
 }
 useEffect(()=>{
  Client.getInstance().phaserGame.events.on("upgraded tier", updateUpgradeTier )
 },[])


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
