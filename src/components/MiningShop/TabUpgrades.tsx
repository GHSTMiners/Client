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


  type upgradeLabel = "Movement" | "Health" | "Inventory" | "Fuell" | "Drill";
  type upgradesRecord = Record<upgradeLabel, number>; // ( upgrade label , level }
  type upgradePrice = {cryptoID:number, }

  // Retrieving upgrading list from Chisel
  let upgradeLabels: string[] = [];
  
  world.upgrades.forEach( upgrade => {
    upgradeLabels.push(upgrade.name);
    /*
    upgrade.prices.forEach( priceEntry => {
      priceEntry.id;
      priceEntry.tier_1
    })*/
  } )

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