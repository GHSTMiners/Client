import React, { useState } from "react";
import styles from  "./styles.module.css";
import Tabs from "components/Tabs";

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
  
  const [selectedTab, setSelectedTab] = useState<number>(tabs[0].index);
  const [displayShop, setDisplayShop] = useState<boolean>(true);

  return (
    <div className={`${styles.shopContainer} ${displayShop ? styles.displayOn : styles.displayOff}`} onClick={()=>{setDisplayShop(true)}}>
      <div className={styles.shopTabs}>
        <Tabs selectedTab={selectedTab} onClick={setSelectedTab} tabs={tabs} />
      </div>
    </div>
  );
}

export default MiningShop;