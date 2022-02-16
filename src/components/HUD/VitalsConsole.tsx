import { useEffect, useState } from "react";
import Client from "matchmaking/Client";
import { DataChange } from "@colyseus/schema";
import Config from "config";
import styles from "./styles.module.css";
import fuelBar from "assets/hud/fuel_bar.svg";
import healthBar from "assets/hud/health_bar.svg";
import cargoBar from "assets/hud/cargo_bar.svg";

const VitalsConsole = () => {
  const [fuel, setFuel] = useState("14rem");
  const [cargo, setCargo] = useState("14rem");
  const [health, setHealth] = useState("14rem");
  const [depth, setDepth] = useState(0);

  useEffect(() => {
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
  );
};

export default VitalsConsole;
