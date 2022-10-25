import { TabsType } from "types";
import PlayerStats from "./PlayerStats";
import RoomStats from "./RoomStats";

const statisticsTabs: TabsType = [
    {
      label: "My Stats",
      index: 1,
      Component: PlayerStats
    },
    {
      label: "GigaChads",
      index: 2,
      Component: RoomStats
    }
  ];

  export default statisticsTabs
