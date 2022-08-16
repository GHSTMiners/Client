import { useEffect, useState } from "react";
import * as Chisel from "chisel-api-interface";
import Client from "matchmaking/Client";
import { PricePair, TierCost, upgradePriceObject } from "types";


const useWorldUpgrades = () => {

  const world: Chisel.DetailedWorld | undefined =   Client.getInstance().chiselWorld;  
  const [upgradeObjectArray , setUpgradeObjectArray] = useState<upgradePriceObject[]>([]);
  
  // Fetching the list of crypto from Chisel
  useEffect(()=>{
    const upgradeTiers = ['tier_1','tier_2','tier_3','tier_4','tier_5'];
  
    world.upgrades.forEach( upgrade => {
     // Looking for the prices of each tier
      let multiTierCost: TierCost[] = [];
      upgradeTiers.forEach( tier => {
        let tierPriceList: PricePair[]  = [];
        let coinsPerTier: TierCost = { tierLabel:tier , priceList: tierPriceList };
        upgrade.prices.forEach( ( priceEntry: Chisel.UpgradePrice ) => {
          let price = 0;
          switch(tier){
            case 'tier_1': price = priceEntry.tier_1; break;
            case 'tier_2': price = priceEntry.tier_2; break;
            case 'tier_3': price = priceEntry.tier_3; break;
            case 'tier_4': price = priceEntry.tier_4; break;
            case 'tier_5': price = priceEntry.tier_5; break;
          }
          if (price>0){
            const coinEntry:PricePair = { cryptoId: priceEntry.crypto_id , cost: price } ;
            tierPriceList.push(coinEntry);
          }
        })
        multiTierCost.push(coinsPerTier);
      })
      let newObject = { id:upgrade.id, 
                        name:upgrade.name, 
                        costPerTier: multiTierCost,
                        description: upgrade.description };
      setUpgradeObjectArray(state => {state.push(newObject) ; return([...state])});
     
    } )

  },[world.upgrades])

  return { upgradeObjectArray }

}

export default useWorldUpgrades