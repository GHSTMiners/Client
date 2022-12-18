import Client from "matchmaking/Client";
import styles from "./styles.module.css";
import CountdownTimer  from "./components/CountdownTimer";
import useLowFuel from "./hooks/useLowFuel";
import { useGlobalStore } from "store";

const Vitals = () => {
  const fuel = useGlobalStore( state => state.vitals.fuel );
  const health = useGlobalStore( state => state.vitals.health );
  const cargo = useGlobalStore( state => state.vitals.cargo );
  const depth = useGlobalStore( state => state.depth );
  const gameEndUTC = new Date(Client.getInstance().colyseusRoom.state.gameEndUTC )
  const { lowFuel } = useLowFuel(fuel);

  return (
    <>
      <div className={styles.vitalsConsole}>
        <div className={`${styles.fuelBarContainer} ${lowFuel? styles.lowFuelBar: ''}`} >
          <span className={styles.fuelBar} style={{ width: `${fuel}%` }} />
        </div>
        <div className={styles.healthBarContainer} >
          <span className={styles.healthBar} style={{ width: `${health}%` }} />
        </div>
        <div className={styles.cargoBarContainer} >
          <span className={styles.cargoBar} style={{ width: `${cargo}%` }} />
        </div>
        <div className={styles.vitalsBarsCovers}></div>
        { (lowFuel)? 
        <div className={styles.lowFuelIndicator} /> 
        : '' }
        
        <div className={styles.depthTag}>
          Depth:<br /> {depth}
        </div>

        <CountdownTimer targetDate={ gameEndUTC }/>
        
      </div>
    </>
  );
};

export default Vitals
