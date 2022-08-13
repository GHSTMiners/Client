import { useEffect, useState } from "react";
import Client from "matchmaking/Client";
import { DataChange } from "@colyseus/schema";
import Config from "config";
import styles from "./styles.module.css";
import gameEvents from "game/helpers/gameEvents";

const Vitals = () => {
  const [fuel, setFuel] = useState(100);
  const [cargo, setCargo] = useState(0);
  const [health, setHealth] = useState(100);
  const [depth, setDepth] = useState(0);
  const [lowFuel , setLowFuel] = useState(false);
  
  useEffect(() => {
    // Declaring local state variable, since useState does not update when called from inside an event listener
    let lowFuelHookState = false;
    //Wait until the player was admitted to the server
    Client.getInstance().phaserGame.events.on( gameEvents.room.JOINED, () => {
      //Update the health, fuel and cargo bar
      Client.getInstance().ownPlayer.vitals.forEach((vital) => {
        if (vital.name === "Fuel") {
          vital.onChange = () => {
            let remFuelValue: number =
              (vital.currentValue / vital.filledValue) * 100;
            if (remFuelValue<2 && lowFuelHookState === false){ 
              Client.getInstance().phaserGame.events.emit( gameEvents.vitals.LOWFUEL )
              lowFuelHookState = true;
              setLowFuel(true);
            } else{
              if (remFuelValue>2 && lowFuelHookState === true){ 
                lowFuelHookState = false;
                setLowFuel(false);
              }
            }  
            setFuel(remFuelValue);
          };
        } else if (vital.name === "Health") {
          vital.onChange = () => {
            let remFuelValue: number =
              (vital.currentValue / vital.filledValue) * 100;
            setHealth(remFuelValue);
          };
        } else if (vital.name === "Cargo") {
          vital.onChange = () => {
            let remFuelValue: number =
              (1 - vital.currentValue / vital.filledValue) * 100;
            setCargo(remFuelValue);
          };
          vital.onRemove = ()=>{
            setCargo(0);
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
        <div className={`${styles.fuelBarContainer} ${lowFuel? styles.lowFuelBar: ''}`} >
        <span className={styles.fuelBar} style={{ width: `${fuel}%` }}></span>
        </div>
        { (lowFuel)? <div className={styles.lowFuelIndicator} /> : '' }
        <div className={styles.healthBarContainer} >
          <span className={styles.healthBar} style={{ width: `${health}%` }} ></span>
        </div>
        <div className={styles.cargoBarContainer} >
        <span className={styles.cargoBar} style={{ width: `${cargo}%` }} ></span>
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
