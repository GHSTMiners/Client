import React, { FC, Fragment, useState } from "react";
import styles from "./styles.module.css";
import * as Chisel from "chisel-api-interface";
import Client from "matchmaking/Client";
import drillIcon from "assets/hud/drill.png";
import AavegotchiSVGFetcher from "game/Rendering/AavegotchiSVGFetcher";
import PlayerRenderer from "game/Rendering/PlayerRenderer";

const TabUpgrades: FC<{}> = () => {
  const world: Chisel.DetailedWorld | undefined =   Client.getInstance().chiselWorld;
  const playerSprite = `gotchi_${Client.getInstance().ownPlayer.gotchiID}`;

  let aavegotchiSVGFetcher: AavegotchiSVGFetcher = new AavegotchiSVGFetcher( Client.getInstance().ownPlayer.gotchiID );

  aavegotchiSVGFetcher.frontWithoutBackground().then((svg) => {
    //Convert string from svg
    const blob = new Blob([svg], { type: "image/svg+xml" });
    const gotchiURL = URL.createObjectURL(blob);
  });
  
  //  const gotchiURL = URL.createObjectURL(blob);

  return (
    <div className={styles.contentContainer}>
      <div className={styles.galleryPanel}>
        Fancy pictures and upgrade components
        <img src={drillIcon} className={styles.drillIcon}></img>
      </div>
      <div className={styles.detailsPanel}>
        Selected item details
      </div>
    </div>
  );
};
export default TabUpgrades;