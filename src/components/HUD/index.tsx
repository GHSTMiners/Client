import styles from "./styles.module.css";
import Client from "matchmaking/Client";
import { useState, useEffect } from "react";
import VitalsConsole from "./VitalsConsole";
import MainConsole from "./MainConsole";
import MiningShop from "../MiningShop";

export const HUD = () => {
  const [gameLoaded, setgameLoaded] = useState(false);

  useEffect(() => {
    // Display HUD only when the main scene was loaded
    Client.getInstance().phaserGame.events.on("mainscene_ready", () => {
      setgameLoaded(true);
    });
  }, []);

  return (
    <div className={styles.hudContainer} hidden={!gameLoaded}>
      <VitalsConsole />
      <MainConsole />
      <MiningShop />
    </div>
  );
};
