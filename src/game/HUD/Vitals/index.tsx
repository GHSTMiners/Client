import Client from "matchmaking/Client";
import styles from "./styles.module.css";
import CountdownTimer  from "./components/CountdownTimer";
import useLowFuel from "./hooks/useLowFuel";
import { useContext } from "react";
import { HUDContext } from "..";

const Vitals = () => {
  const hudContext = useContext(HUDContext);
  const { lowFuel } = useLowFuel(hudContext.player.vitals.fuel);

  return (
    <>
      <div className={styles.vitalsConsole}>
        <div className={`${styles.fuelBarContainer} ${lowFuel? styles.lowFuelBar: ''}`} >
          <span className={styles.fuelBar} style={{ width: `${hudContext.player.vitals.fuel}%` }} />
        </div>
        <div className={styles.healthBarContainer} >
          <span className={styles.healthBar} style={{ width: `${hudContext.player.vitals.health}%` }} />
        </div>
        <div className={styles.cargoBarContainer} >
          <span className={styles.cargoBar} style={{ width: `${hudContext.player.vitals.cargo}%` }} />
        </div>
        <div className={styles.vitalsBarsCovers}></div>
        { (lowFuel)? 
        <div className={styles.lowFuelIndicator} /> 
        : '' }
        
        <div className={styles.depthTag}>
          Depth:<br /> {hudContext.player.depth}
        </div>

        <CountdownTimer targetDate={ (new Date(Client.getInstance().colyseusRoom.state.gameEndUTC )) }/>
        
      </div>
    </>
  );
};

export default Vitals
