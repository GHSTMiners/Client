import styles from "./styles.module.css";
import fuelBar from "assets/hud/fuel_bar.svg";
import healthBar from "assets/hud/health_bar.svg";
import cargoBar from "assets/hud/cargo_bar.svg";
import mainConsole from "assets/hud/main_hud.svg";
import Client from "matchmaking/Client";
import { useState, useEffect } from "react";
import Config from "config";
import { DataChange } from "@colyseus/schema";

export const HUD = () => {
  // TO DO: convert these numbers into percentage form
  const fuelWidth = "8rem";
  const healthWidth = "14rem";
  const cargothWidth = "9rem";

  // Useless code because the hook only gets executed once since since we are using the Client class-based instead of functional component-based
  const [gameLoaded, setgameLoaded] = useState(false);
  const [fuel, setFuel] = useState("12rem");
  const [cargo, setCargo] = useState("12rem");
  const [health, setHealth] = useState("12rem");
  const [consoleUp, setConsoleUp] = useState(false);
  const [depth, setDepth] = useState(0);

  useEffect(() => {
    // Display HUD only when the main scene was loaded
    Client.getInstance().phaserGame.events.on("mainscene_ready", () => {
      setgameLoaded(true);
    });

    //Wait until the player was admitted to the server
    Client.getInstance().phaserGame.events.on("joined_game", () => {
      //Update the health, fuel and cargo bar
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
      // Updating depth
      Client.getInstance().ownPlayer.playerState.onChange = (
        change: DataChange<any>[]
      ) => {
        change.forEach((value) => {
          if (value.field == "y")
            setDepth(Math.ceil(value.value / Config.blockHeight));
        });
      };
    });
  }, []);

  return (
    <div className={styles.hudContainer} hidden={!gameLoaded}>
      <div className={styles.vitalsConsole}>
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
        <div className={styles.depthTag}>
          Depth:~{"\n"} {depth}
        </div>
      </div>
      <div
        className={`${styles.mainConsole} 
        ${consoleUp ? styles.mainConsoleUp : styles.mainConsoleDown}`}
        onClick={() => {
          setConsoleUp(!consoleUp);
        }}
      >
        {/*<img src={mainConsole} className={styles.mainConsoleImg} />*/}
        <div className={styles.mainConsoleContainer}>
          <div className={styles.playerButtons}>BUTTONS GO HERE</div>
          <div className={styles.inventoryTitle}>INVENTORY</div>
          <div className={styles.consumablesContainer}>
            <div className={styles.sectionTitle}>CONSUMABLES</div>
            consumable items go here
          </div>
          <div className={styles.artifactsContainer}>
            <div className={styles.sectionTitle}>ARTIFACTS</div>
            artifact items go here
          </div>
          <div className={styles.cryptoContainer}>
            <div className={styles.sectionTitle}>CRYPTO</div>
            crypto items go here
          </div>
        </div>
        {/*<img src={mainConsole} className={styles.mainConsoleImg} />*/}
      </div>
    </div>
  );
};
