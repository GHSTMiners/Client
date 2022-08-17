import React, { useContext, useEffect, useState } from "react";
import styles from  "./styles.module.css";
import Tabs from "components/Tabs";
import Client from "matchmaking/Client";
import { TabsType } from "types";
import * as Chisel from "chisel-api-interface";
import TabUpgrades from "./tabs/TabUpgrades";
import TabConsumables from "./tabs/TabConsumables";
import useVisible from "hooks/useVisible";
import gameEvents from "game/helpers/gameEvents";
import { HUDContext } from "..";

const tabs: TabsType = [
  {
    label: "Consumables",
    index: 1,
    Component: TabConsumables
  },
  {
    label: "Upgrades",
    index: 2,
    Component: TabUpgrades
  }
];

const Shop = () => {

  const [selectedTab, setSelectedTab] = useState<number>(tabs[0].index);
  const shopVisibility = useVisible('shop'); 
  const hudContext = useContext(HUDContext);
  
  const world: Chisel.DetailedWorld | undefined =   Client.getInstance().chiselWorld;
  const playerGGEMS = Math.round(hudContext.player.crypto[world.world_crypto_id]*10)/10;

  useEffect( () => {

    Client.getInstance().phaserGame.events.on( gameEvents.buildings.EXIT, shopVisibility.hide );
    
    return () => {
      Client.getInstance().phaserGame.events.off( gameEvents.buildings.EXIT, shopVisibility.hide );
    }

  },[shopVisibility.hide]);


  return (
    <div className={`${styles.shopContainer} ${shopVisibility.state ? styles.displayOn : styles.displayOff}`} onClick={()=>{}}>
      <div className={styles.screenContainer}>
        <div className={styles.playerDoekoes}>{playerGGEMS} GGEMS</div>
        <button className={styles.closeButton} onClick={ shopVisibility.hide }>X</button>
        <div className={styles.shopTabs}>
          <Tabs selectedTab={selectedTab} onClick={setSelectedTab} tabs={tabs} />
        </div>
      </div>
    </div>
  );
}

export default Shop