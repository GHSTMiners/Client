import styles from "./styles.module.css";
import fuelBar from "assets/hud/fuel_bar.svg";
import healthBar from "assets/hud/health_bar.svg";
import cargoBar from "assets/hud/cargo_bar.svg";

export const HUD = () => {
  // TO DO: hook depth with current Depth from the Schemas
  const currentDepth = -50;

  // TO DO: convert these numbers into percentage form
  const fuelWidth = "12rem";
  const healthWidth = "7rem";
  const cargothWidth = "9rem";

  return (
    <div className={styles.hudContainer}>
      <div className={styles.vitalsConsole}>
        <div className={styles.fuelBar} style={{ width: fuelWidth }}>
          <img src={fuelBar} className={styles.vitalBar} />
        </div>
        <div className={styles.healthBar} style={{ width: healthWidth }}>
          <img src={healthBar} className={styles.vitalBar} />
        </div>
        <div className={styles.cargoBar} style={{ width: cargothWidth }}>
          <img src={cargoBar} className={styles.vitalBar} />
        </div>
        <div className={styles.vitalsBarsCovers}></div>
        <div className={styles.depthTag}>Depth: {currentDepth}</div>
      </div>
    </div>
  );
};
