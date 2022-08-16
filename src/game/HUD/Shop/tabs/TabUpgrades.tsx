import { FC, useEffect, useState } from "react";
import styles from "./styles.module.css";
import * as Chisel from "chisel-api-interface";
import Client from "matchmaking/Client";
import AavegotchiSVGFetcher from "game/Rendering/AavegotchiSVGFetcher";
import UpgradeBar from "game/HUD/Shop/components/UpgradeBar";
import { convertInlineSVGToBlobURL } from "helpers/aavegotchi";
import { Upgrade } from "matchmaking/Schemas";
import * as Protocol from "gotchiminer-multiplayer-protocol"
import gameEvents from "game/helpers/gameEvents";
import {  upgradeLevels, upgradePriceObject } from "types";
import useWorldUpgrades from "../hooks/useWorldUpgrades";

export type PricePair = { cryptoId:number, cost:number };
  
const TabUpgrades: FC<{}> = () => {
  const world: Chisel.DetailedWorld | undefined =   Client.getInstance().chiselWorld;
  const [gotchiSVG,setGotchiSVG]=useState('');

  // Retrieving upgrading list from Chisel
  const playerUpgradesIni: Upgrade[] = Client.getInstance().ownPlayer.upgrades;
  const [playerUpgrades ] = useState(playerUpgradesIni);
  const [hoverUpgrade , setHoverUpgrade] = useState({} as upgradePriceObject);
  const [selectedUpgrade ] = useState({} as upgradePriceObject);
  const upgradeLevelIni: upgradeLevels[] =[];

  const { upgradeObjectArray } = useWorldUpgrades();

  world.upgrades.forEach( upgrade => {
    // Defining default tier
    let upgradeTier: number = 5; 
    // Fetching tier info from Schemas (if found)
    playerUpgrades.forEach( upgradeEntry => { if( upgradeEntry.id === upgrade.id) upgradeTier=upgradeEntry.tier }) 
    // Storing data
    upgradeLevelIni.push({upgradeId: upgrade.id, tier: upgradeTier });
  } )

  const [currentTiers,setCurrentTiers]=useState(upgradeLevelIni);

  let aavegotchiSVGFetcher: AavegotchiSVGFetcher = new AavegotchiSVGFetcher( Client.getInstance().ownPlayer.gotchiID );

  const upgradePlayerTier = (upgradeId:number, tier:number) =>{
    let tiers = [...currentTiers];
    let upgradedTier = tiers.find( entry => entry.upgradeId === upgradeId);
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
        Client.getInstance().phaserGame.events.emit( gameEvents.shop.UPGRADED , upgrade.id, upgrade.tier);
      }
    })
    // eslint-disable-next-line react-hooks/exhaustive-deps
  },[]);

  const renderUpgradeElement = ( obj:upgradePriceObject , upgradeTierObj: upgradeLevels) => {
    let upgradeCost:PricePair[] = [];
    const isSelected = (obj.id === selectedUpgrade.id);
    const nextTier = upgradeTierObj.tier + 1;
    const nextTierTag = `tier_${nextTier}`;
    const upgradeTierInfo = obj.costPerTier.find(entry => entry.tierLabel === nextTierTag);
    if (upgradeTierInfo){ 
      upgradeCost = upgradeTierInfo.priceList;
    }
        
    return  (
      <div className={`${styles.upgradesContainer} ${isSelected? styles.selectedUpgrade : '' }`} 
            key={`${obj.name}_container`}
            onMouseEnter={()=>setHoverUpgrade(obj)}
            onMouseLeave={()=>setHoverUpgrade(obj)}>
              {/* onClick={()=>setSelectedUpgrade(obj)} */}
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
    let upgradeTierObj = currentTiers.find(upgradeObj => upgradeObj.upgradeId === entry.id);
    return( 
        upgradeTierObj? renderUpgradeElement(entry,upgradeTierObj) : ''
      )
  })

  const buyUpgrade = ( upgradeId:number , tier:number ) =>{
    let purchaseMessage : Protocol.PurchaseUpgrade = new Protocol.PurchaseUpgrade();
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
        {hoverUpgrade? hoverUpgrade.description: selectedUpgrade.description}
        <img src={gotchiSVG} className={styles.gotchiPreview} alt={'My Gotchi'}></img>
      </div>
    </div>
  );
};
export default TabUpgrades;