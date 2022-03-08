import React, { useEffect, useState } from "react";
import styles from  "./styles.module.css";
import Tabs from "components/Tabs";
import * as Chisel from "chisel-api-interface";
import Client from "matchmaking/Client";

// Tabs Components
import TabUpgrades from "./TabUpgrades";
import TabConsumables from "./TabConsumables";

type TabsType = {
  label: string;
  index: number;
  Component: React.FC<{}>;
}[];

// Tabs Array
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

const MiningShop = () => {
  
  const world: Chisel.DetailedWorld | undefined =   Client.getInstance().chiselWorld;
  const [selectedTab, setSelectedTab] = useState<number>(tabs[0].index);
  const [displayShop, setDisplayShop] = useState<boolean>(false);

  const openShop = () => {
    setDisplayShop(true);
  }

  const closeShop = (buildingName:string) => {
    if (buildingName == 'Bazaar'){
      setDisplayShop(false);
    } 
  }

  useEffect( () => {
    Client.getInstance().phaserGame.events.on("exit_building", closeShop );
    Client.getInstance().phaserGame.events.on("show_shop", openShop );
    Client.getInstance().phaserGame.events.on("close_dialogs", ()=>{closeShop('Bazaar')} );
  },[]);


  return (
    <div className={`${styles.shopContainer} ${displayShop ? styles.displayOn : styles.displayOff}`} onClick={()=>{}}>
      <div className={styles.screenContainer}>
        <button className={styles.closeButton} onClick={()=>closeShop('Bazaar')}>X</button>
        <div className={styles.shopTabs}>
          <Tabs selectedTab={selectedTab} onClick={setSelectedTab} tabs={tabs} />
        </div>
      </div>
    </div>
  );
}

export default MiningShop;