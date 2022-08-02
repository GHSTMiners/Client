import { useEffect, useState } from "react";
import Client from "matchmaking/Client";
import { DataChange } from "@colyseus/schema";
import Config from "config";
import styles from "./styles.module.css";
import fuelBar from "assets/hud/fuel_bar.svg";
import healthBar from "assets/hud/health_bar.svg";
import cargoBar from "assets/hud/cargo_bar.svg";

const Vitals = () => {
  const [fuel, setFuel] = useState("14rem");
  const [cargo, setCargo] = useState("0rem");
  const [health, setHealth] = useState("14rem");
  const [depth, setDepth] = useState(0);
  const [lowFuel , setLowFuel] = useState(false);
  
  useEffect(() => {
    // Declaring local state variable, since useState does not update when called from inside an event listener
    let lowFuelHookState = false;
    //Wait until the player was admitted to the server
    Client.getInstance().phaserGame.events.on("joined_game", () => {
      //Update the health, fuel and cargo bar
      Client.getInstance().ownPlayer.vitals.forEach((vital) => {
        if (vital.name === "Fuel") {
          vital.onChange = () => {
            let remFuelValue: number =
              (vital.currentValue / vital.filledValue) * 14;
            if (remFuelValue<2 && lowFuelHookState === false){ 
              Client.getInstance().phaserGame.events.emit('LowFuelWarning')
              lowFuelHookState = true;
              setLowFuel(true);
            } else{
              if (remFuelValue>2 && lowFuelHookState === true){ 
                lowFuelHookState = false;
                setLowFuel(false);
              }
            }  
            setFuel(`${remFuelValue}rem`);
          };
        } else if (vital.name === "Health") {
          vital.onChange = () => {
            let remFuelValue: number =
              (vital.currentValue / vital.filledValue) * 14;
            setHealth(`${remFuelValue}rem`);
          };
        } else if (vital.name === "Cargo") {
          vital.onChange = () => {
            let remFuelValue: number =
              (1 - vital.currentValue / vital.filledValue) * 14;
            setCargo(`${remFuelValue}rem`);
          };
          vital.onRemove = ()=>{
            setCargo('0rem');
          };
        }
      });
      // Updating depth
      Client.getInstance().ownPlayer.playerState.onChange = (
        change: DataChange<any>[]
      ) => {
        change.forEach((value) => {
          if (value.field === "y")
            setDepth(Math.ceil(value.value / Config.blockHeight));
        });
      };
    });
  }, []);

  return (
    <>
      <div className={(depth>8)? `${styles.gameVignette} ${styles.underground}` : `${styles.gameVignette} ${styles.aboveground}`}></div>
      <div className={styles.vitalsConsole}>
        <div className={`${styles.fuelBar} ${lowFuel? styles.lowFuelBar: ''}`} style={{ width: fuel }}>
          <img src={fuelBar} className={styles.vitalBar} alt={'Fuel'}/> 
        </div>
        { (lowFuel)? <div className={styles.lowFuelIndicator} /> : '' }
        <div className={styles.healthBar} style={{ width: health }}>
          <img src={healthBar} className={styles.vitalBar} alt={'Health'}/>
        </div>
        <div className={styles.cargoBar} style={{ width: cargo }}>
          <img src={cargoBar} className={styles.vitalBar} alt={'Cargo'}/>
        </div>
        <div className={styles.vitalsBarsCovers}></div>
        <div className={styles.depthTag}>
          Depth:<br /> {depth}
        </div>
      </div>
    </>
  );
};

export default Vitals
