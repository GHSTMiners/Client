import Client from "matchmaking/Client";
import styles from "./styles.module.css";
import CountdownTimer  from "./components/CountdownTimer";
import usePlayerVitals from "hooks/usePlayerVitals";
import usePlayerDepth from "hooks/usePlayerDepth";
import useLowFuel from "./hooks/useLowFuel";

const Vitals = () => {

  const playerVitals = usePlayerVitals();
  const { depth } = usePlayerDepth();
  const { lowFuel } = useLowFuel(playerVitals.fuel);

  return (
    <>
      <div className={(depth>8)? `${styles.gameVignette} ${styles.underground}` : `${styles.gameVignette} ${styles.aboveground}`}></div>
      <div className={styles.vitalsConsole}>
        <div className={`${styles.fuelBarContainer} ${lowFuel? styles.lowFuelBar: ''}`} >
          <span className={styles.fuelBar} style={{ width: `${playerVitals.fuel}%` }} />
        </div>
        <div className={styles.healthBarContainer} >
          <span className={styles.healthBar} style={{ width: `${playerVitals.health}%` }} />
        </div>
        <div className={styles.cargoBarContainer} >
          <span className={styles.cargoBar} style={{ width: `${playerVitals.cargo}%` }} />
        </div>
        <div className={styles.vitalsBarsCovers}></div>
        { (lowFuel)? 
        <div className={styles.lowFuelIndicator} /> 
        : '' }
        
        <div className={styles.depthTag}>
          Depth:<br /> {depth}
        </div>

        <CountdownTimer targetDate={ (new Date(Client.getInstance().colyseusRoom.state.gameEndUTC )) }/>
        
      </div>
    </>
  );
};

export default Vitals
