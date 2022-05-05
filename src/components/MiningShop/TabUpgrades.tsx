import { FC, useEffect, useState } from "react";
import styles from "./styles.module.css";
import * as Chisel from "chisel-api-interface";
import Client from "matchmaking/Client";
import AavegotchiSVGFetcher from "game/Rendering/AavegotchiSVGFetcher";
import UpgradeBar from "components/UpgradeBar";
import { convertInlineSVGToBlobURL } from "helpers/aavegotchi";

const TabUpgrades: FC<{}> = () => {
  const world: Chisel.DetailedWorld | undefined =   Client.getInstance().chiselWorld;
  //const playerSprite = `gotchi_${Client.getInstance().ownPlayer.gotchiID}`;
  //let gotchiURL : string = '';
  const [gotchiSVG,setGotchiSVG]=useState('');

  // Defining all the data types required to store all the price per tier info
  type PricePair = { crypto_id:number, cost:number };
  type TierCost = { tier:string, priceList:PricePair[] };
  type upgradePriceObject = { id:number, name:string, costPerTier:TierCost[] }
  type upgradesRecord = Record< number, upgradePriceObject >;

  // Retrieving upgrading list from Chisel
  let upgradeLabels: string[] = [];
  const upgradeTiers = ['tier_1','tier_2','tier_3','tier_4','tier_5'];
  const upgradeObjectArray : upgradePriceObject[] = [];

  world.upgrades.forEach( upgrade => {
   
    upgradeLabels.push(upgrade.name);

    // Looking for the prices of each tier
    let multiTierCost: TierCost[] = [];
    upgradeTiers.forEach( tier => {
      let tierPriceList: PricePair[]  = [];
      let coinsPerTier: TierCost = { tier:tier , priceList: tierPriceList };

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
          const coinEntry:PricePair = { crypto_id: priceEntry.crypto_id , cost: price } ;
          tierPriceList.push(coinEntry);
        }
      })
      multiTierCost.push(coinsPerTier);
    })
    let newObject = {id:upgrade.id, name:upgrade.name, costPerTier: multiTierCost};
    upgradeObjectArray.push(newObject);
  } )
  console.log(upgradeObjectArray)



  let aavegotchiSVGFetcher: AavegotchiSVGFetcher = new AavegotchiSVGFetcher( Client.getInstance().ownPlayer.gotchiID );

  useEffect(()=>{
    // Fetching Aavegotchi preview to display in console as background
    aavegotchiSVGFetcher.frontWithoutBackground().then((svg) => {
      setGotchiSVG(convertInlineSVGToBlobURL(svg)); 
    });
  },[]);

  const renderUpgradeElement = ( name:string) => {
    return  <UpgradeBar text={name}   />
  }

  const upgradesArray = upgradeLabels.map( function(entry) {
    return( renderUpgradeElement(entry) )
  })

  return (
    <div className={styles.contentContainer}>
      <div className={styles.galleryPanel}>
        <div className={styles.upgradesList}>
          {upgradesArray}
        </div>
        <img src={gotchiSVG} className={styles.gotchiPreview}></img>
      </div>
      <div className={styles.detailsPanel}>
        Selected item details
        {/*<img src={drillIcon} className={styles.drillIcon}></img>*/}
      </div>
    </div>
  );
};
export default TabUpgrades;