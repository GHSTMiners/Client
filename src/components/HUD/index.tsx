import styles from "./styles.module.css";
import fuelBar from "assets/hud/fuel_bar.svg";
import healthBar from "assets/hud/health_bar.svg";
import cargoBar from "assets/hud/cargo_bar.svg";
import mainConsole from "assets/hud/main_hud.svg";
import Client from "matchmaking/Client";
import { useState, useEffect } from "react";
import Config from "config";
import { DataChange } from "@colyseus/schema";
import SquareButton from "components/SquareButton";
import cargoIcon from "assets/hud/cargo_icon.svg";
import expandIcon from "assets/hud/expand_icon.svg";

export const HUD = () => {
  const smallButton = "3.3rem";
  const bigButton = "5.8rem";
  const [gameLoaded, setgameLoaded] = useState(false);
  const [fuel, setFuel] = useState("14rem");
  const [cargo, setCargo] = useState("14rem");
  const [health, setHealth] = useState("14rem");
  const [consoleUp, setConsoleUp] = useState(false);
  const [depth, setDepth] = useState(0);

  const inventoryCargoBar = (percentage: string) => (
    <div className={styles.modifierRow}>
      <div className={styles.modifierMeter}>
        <div className={styles.labelStyles}>
          <span
            className={styles.progress}
            style={{ width: percentage }}
          ></span>
        </div>
      </div>
      <div className={styles.barTagContainer}>
        <div>EMPTY</div>
        <div>FULL</div>
      </div>
    </div>
  );

  const itemList = [];
  for (let i = 1; i < 9; i++) {
    itemList.push(<SquareButton size={smallButton}>ITEM {i}</SquareButton>);
  }

  const artifactList = [];
  for (let i = 1; i < 5; i++) {
    artifactList.push(<SquareButton size={smallButton}>ITEM {i}</SquareButton>);
  }

  const inventoryCrystal = (tag: string, quantity: number) => (
    <div className={styles.crystalContainer}>
      <div className={styles.crystalIcon} />
      <div className={styles.crystalTag}>
        {tag} x {quantity}
      </div>
    </div>
  );

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
      >
        <div className={styles.mainConsoleContainer}>
          <div className={styles.playerButtons}>
            <SquareButton size={bigButton}>TOOL</SquareButton>
            <SquareButton size={smallButton}>ITEM 1</SquareButton>
            <SquareButton size={smallButton}>ITEM 2</SquareButton>
            <SquareButton size={smallButton}>ITEM 3</SquareButton>
            <SquareButton size={smallButton}>ITEM 4</SquareButton>
            <div
              className={styles.expandButton}
              onClick={() => {
                setConsoleUp(!consoleUp);
              }}
              style={{ width: smallButton, height: smallButton }}
            >
              <img
                src={expandIcon}
                className={`${styles.expandIncon} 
                ${consoleUp ? styles.expandIconUp : styles.expandIconDown}`}
                onClick={() => {
                  setConsoleUp(!consoleUp);
                }}
              />
            </div>
          </div>
          <div className={styles.inventoryTitle}>INVENTORY</div>
          <div className={styles.consumablesContainer}>
            <div className={styles.sectionTitle}>CONSUMABLES</div>
            <div className={styles.consumableItems}>{itemList}</div>
          </div>
          <div className={styles.artifactsContainer}>
            <div className={styles.sectionTitle}>ARTIFACTS</div>
            <div className={styles.artifactItems}>{artifactList}</div>
          </div>
          <div className={styles.cryptoContainer}>
            <div className={styles.sectionTitle}>CRYPTO</div>
            <img src={cargoIcon} className={styles.cargoIcon} />
            Total Inventory Weight
            {inventoryCargoBar("50%")}
            <div className={styles.cryptoGallery}>
              {inventoryCrystal("GHST", 10)}
              {inventoryCrystal("BTC", 0)}
              {inventoryCrystal("MATIC", 25)}
              {inventoryCrystal("QUICK", 2)}
              {inventoryCrystal("DAI", 3)}
              {inventoryCrystal("YFI", 6)}
              {inventoryCrystal("LINK", 7)}
              {inventoryCrystal("ETH", 1)}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
