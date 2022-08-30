import { TabsType } from "types";
import TabUpgrades from "./TabUpgrades";
import TabConsumables from "./TabConsumables";

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

  export default tabs
