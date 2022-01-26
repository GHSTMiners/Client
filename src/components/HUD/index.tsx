import styles from "./styles.module.css";
import fuelBar from "assets/hud/fuel_bar.svg";
import healthBar from "assets/hud/health_bar.svg";
import cargoBar from "assets/hud/cargo_bar.svg";
import Client from "matchmaking/Client";
import { useState, useEffect } from "react";

export const HUD = () => {
  // TO DO: hook depth with current Depth from the Schemas
  const currentDepth = -50;

  // TO DO: convert these numbers into percentage form
  const fuelWidth = "8rem";
  const healthWidth = "14rem";
  const cargothWidth = "9rem";

  // Useless code because the hook only gets executed once since since we are using the Client class-based instead of functional component-based
  const [gameLoaded, setgameLoaded] = useState(false);
  const [fuel, setFuel] = useState("12rem");
  const [cargo, setCargo] = useState("12rem");
  const [health, setHealth] = useState("12rem");

  useEffect(() => {
    // Only show when the main scene was loaded
    Client.getInstance().phaserGame.events.on("mainscene_ready", () => {
      setgameLoaded(true);
    });
    //Wait until the player was admitted to the server
    Client.getInstance().phaserGame.events.on("joined_game", () => {
      Client.getInstance().ownPlayer.vitals.forEach((vital) => {
        if (vital.name == "Fuel") {
          vital.onChange = () => {
            let remFuelValue: number =
              (vital.currentValue / vital.filledValue) * 14;
            setFuel(`${remFuelValue}rem`);
          };
        } else if (vital.name == "Health") {
          vital.onChange = () => {
            let remFuelValue: number =
              (vital.currentValue / vital.filledValue) * 14;
            setHealth(`${remFuelValue}rem`);
          };
        } else if (vital.name == "Cargo") {
          vital.onChange = () => {
            let remFuelValue: number =
              (1 - vital.currentValue / vital.filledValue) * 14;
            setCargo(`${remFuelValue}rem`);
          };
        }
      });
    });
    //Update the health, fuel and cargo bar
  }, []);

  return (
    <div className={styles.hudContainer}>
      <div className={styles.vitalsConsole} hidden={!gameLoaded}>
        <div className={styles.fuelBar} style={{ width: fuel }}>
          <img src={fuelBar} className={styles.vitalBar} />
        </div>
        <div className={styles.healthBar} style={{ width: health }}>
          <img src={healthBar} className={styles.vitalBar} />
        </div>
        <div className={styles.cargoBar} style={{ width: cargo }}>
          <img src={cargoBar} className={styles.vitalBar} />
        </div>
        <div className={styles.vitalsBarsCovers}></div>
        <div className={styles.depthTag}>Depth: {currentDepth}</div>
      </div>
    </div>
  );
};
