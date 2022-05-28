import { FC, useContext, useEffect, useState } from "react";
import styles from "./styles.module.css";
import * as Chisel from "chisel-api-interface";
import Client from "matchmaking/Client";
import AavegotchiSVGFetcher from "game/Rendering/AavegotchiSVGFetcher";
import UpgradeBar from "components/UpgradeBar";
import { convertInlineSVGToBlobURL } from "helpers/aavegotchi";
import { Upgrade } from "matchmaking/Schemas";
import * as Protocol from "gotchiminer-multiplayer-protocol"

export type PricePair = { cryptoId:number, cost:number };
  
const TabUpgrades: FC<{}> = () => {
  const world: Chisel.DetailedWorld | undefined =   Client.getInstance().chiselWorld;
  const [gotchiSVG,setGotchiSVG]=useState('');

  // Defining all the data types required to store all the price per tier info
  type TierCost = { tierLabel:string, priceList:PricePair[] };
  type upgradePriceObject = { id:number, name:string, costPerTier:TierCost[] };
  type upgradeLevels = {upgradeId:number, tier:number};

  // Retrieving upgrading list from Chisel
  const playerUpgradesIni: Upgrade[] = Client.getInstance().ownPlayer.upgrades;
  const [playerUpgrades, setPlayerUpgrades] = useState(playerUpgradesIni);
  let upgradeLabels: string[] = [];
  const upgradeTiers = ['tier_1','tier_2','tier_3','tier_4','tier_5'];
  const upgradeObjectArray : upgradePriceObject[] = [];
  const upgradeLevelIni: upgradeLevels[] =[];

  world.upgrades.forEach( upgrade => {
    upgradeLabels.push(upgrade.name);
    // Looking for the prices of each tier
    let multiTierCost: TierCost[] = [];
    upgradeTiers.forEach( tier => {
      let tierPriceList: PricePair[]  = [];
      let coinsPerTier: TierCost = { tierLabel:tier , priceList: tierPriceList };
      upgrade.prices.forEach( ( priceEntry: Chisel.UpgradePrice ) => {
        let id = priceEntry.crypto_id
        let price = 0;
        switch(tier){
          case 'tier_1':
            price = priceEntry.tier_1;
            break;
          case 'tier_2':
            price = priceEntry.tier_2;
            break;
          case 'tier_3':
            price = priceEntry.tier_3;
            break;
          case 'tier_4':
            price = priceEntry.tier_4;
            break;
          case 'tier_5':
            price = priceEntry.tier_5;
            break;
        }
        if (price>0){
          const coinEntry:PricePair = { cryptoId: priceEntry.crypto_id , cost: price } ;
          tierPriceList.push(coinEntry);
        }
      })
      multiTierCost.push(coinsPerTier);
    })
    let newObject = {id:upgrade.id, name:upgrade.name, costPerTier: multiTierCost};
    upgradeObjectArray.push(newObject);
    // Defining default tier
    let upgradeTier: number = 5; 
    // Fetching tier info from Schemas (if found)
    playerUpgrades.forEach( upgradeEntry => { if( upgradeEntry.id==upgrade.id) upgradeTier=upgradeEntry.tier }) 
    // Storing data
    upgradeLevelIni.push({upgradeId: upgrade.id, tier: upgradeTier });
  } )
  const [currentTiers,setCurrentTiers]=useState(upgradeLevelIni);

  let aavegotchiSVGFetcher: AavegotchiSVGFetcher = new AavegotchiSVGFetcher( Client.getInstance().ownPlayer.gotchiID );

  const upgradePlayerTier = (upgradeId:number, tier:number) =>{
    let tiers = [...currentTiers];
    let upgradedTier = tiers.find( entry => entry.upgradeId == upgradeId);
    if (upgradedTier){
      upgradedTier.tier = tier;
    }
    setCurrentTiers(tiers);
  }

  useEffect(()=>{
    // Fetching Aavegotchi preview to display in console as background
    aavegotchiSVGFetcher.frontWithoutBackground().then((svg) => {
      setGotchiSVG(convertInlineSVGToBlobURL(svg)); 
    });

    // Hooking listeners to player tier schemas
    Client.getInstance().ownPlayer.upgrades.forEach( upgrade => {
      upgrade.onChange = () =>{
        upgradePlayerTier(upgrade.id,upgrade.tier);
        Client.getInstance().phaserGame.events.emit("upgraded tier", upgrade.id, upgrade.tier);
      }
    })
  },[]);

  const renderUpgradeElement = ( obj:upgradePriceObject , upgradeTierObj: upgradeLevels) => {
    let upgradeCost:PricePair[] = [];
    const nextTier = upgradeTierObj.tier + 1;
    const nextTierTag = `tier_${nextTier}`;
    const upgradeTierInfo = obj.costPerTier.find(entry => entry.tierLabel==nextTierTag);
    if (upgradeTierInfo){ 
      upgradeCost = upgradeTierInfo.priceList;
    }
        
    return  (
      <div className={styles.upgradesContainer} key={`${obj.name}_container`}>
        <UpgradeBar upgradeId={obj.id}
                    upgradeLabel={obj.name} 
                    upgradeCost={upgradeCost} 
                    currentTier={nextTier-1}
                    purchaseCallback={ ()=>{ buyUpgrade(obj.id,nextTier); console.log(`>>>>>>>>>>> Purchase Upgrade [${obj.name}] Message sent to server to buy tier ${nextTier}! `) } }/>
      </div>
    )
  }

  const upgradesArray = upgradeObjectArray.map( function(entry) {
    // Finding the current player tier
    let upgradeTierObj = currentTiers.find(upgradeObj => upgradeObj.upgradeId==entry.id);
    return( 
        upgradeTierObj? renderUpgradeElement(entry,upgradeTierObj) : ''
      )
  })

  const buyUpgrade = ( upgradeId:number , tier:number ) =>{
    let purchaseMessage : Protocol.PurchaseUpgrade = new Protocol.PurchaseUpgrade;
    purchaseMessage.id = upgradeId;
    purchaseMessage.tier = tier;
    const serializedMessage = Protocol.MessageSerializer.serialize(purchaseMessage);
    Client.getInstance().colyseusRoom.send(serializedMessage.name,serializedMessage.data);
   }

  return (
    <div className={styles.contentContainer}>
      <div className={styles.upgradePanel}>
        <div className={styles.upgradesList}>
          {upgradesArray}
        </div>
        
      </div>
      <div className={styles.detailsPanel}>
        Selected item details
        <img src={gotchiSVG} className={styles.gotchiPreview}></img>
      </div>
    </div>
  );
};
export default TabUpgrades;