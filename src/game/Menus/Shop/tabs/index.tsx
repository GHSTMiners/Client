import { TabsType } from "types";
import TabUpgrades from "./TabUpgrades";
import TabConsumables from "./TabConsumables";
import TabExplosives from "./TabExplosives";

const tabs: TabsType = [
    {
      label: "Explosives",
      index: 1,
      Component: TabExplosives
    },
    {
      label: "Consumables",
      index: 2,
      Component: TabConsumables
    },
    {
      label: "Upgrades",
      index: 3,
      Component: TabUpgrades
    }
  ];

  export default tabs
