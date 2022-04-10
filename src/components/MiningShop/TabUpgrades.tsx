import React, { FC, Fragment, useEffect, useState } from "react";
import styles from "./styles.module.css";
import * as Chisel from "chisel-api-interface";
import Client from "matchmaking/Client";
import drillIcon from "assets/hud/drill.png";
import AavegotchiSVGFetcher from "game/Rendering/AavegotchiSVGFetcher";
import UpgradeBar from "components/UpgradeBar";
import PlayerRenderer from "game/Rendering/PlayerRenderer";
import { convertInlineSVGToBlobURL } from "helpers/aavegotchi";

const TabUpgrades: FC<{}> = () => {
  const world: Chisel.DetailedWorld | undefined =   Client.getInstance().chiselWorld;
  //const playerSprite = `gotchi_${Client.getInstance().ownPlayer.gotchiID}`;
  //let gotchiURL : string = '';
  const [gotchiSVG,setGotchiSVG]=useState('');


  type upgradeLabel = "Movement" | "Health" | "Inventory" | "Fuell" | "Drill";
  type upgradesRecord = Record<upgradeLabel, number>; // ( upgrade label , level }

  // TO DO: retrieve this list from Chisel
  let upgradeLabels: String[] = [];
  upgradeLabels.push('Movement')
  upgradeLabels.push('Health')
  upgradeLabels.push('Inventory')
  upgradeLabels.push('Fuell')
  upgradeLabels.push('Drill')

  let aavegotchiSVGFetcher: AavegotchiSVGFetcher = new AavegotchiSVGFetcher( Client.getInstance().ownPlayer.gotchiID );

  useEffect(()=>{
    aavegotchiSVGFetcher.frontWithoutBackground().then((svg) => {
      setGotchiSVG(convertInlineSVGToBlobURL(svg)); 
    });
  },[]);

  
  //  const gotchiURL = URL.createObjectURL(blob);

  return (
    <div className={styles.contentContainer}>
      <div className={styles.galleryPanel}>
        <UpgradeBar text='Movement Speed'  topPosition={80} leftPosition={4} />
        <UpgradeBar text='Health'  topPosition={0} leftPosition={4} />
        <UpgradeBar text='Inventory'  topPosition={40} leftPosition={20} />
        <UpgradeBar text='Fuel'  topPosition={20} leftPosition={70} />
        <UpgradeBar text='Drill Speed'  topPosition={80} leftPosition={65} />
        <img src={drillIcon} className={styles.drillIcon}></img>
        <img src={gotchiSVG} className={styles.gotchiPreview}></img>
      </div>
      <div className={styles.detailsPanel}>
        Selected item details
      </div>
    </div>
  );
};
export default TabUpgrades;