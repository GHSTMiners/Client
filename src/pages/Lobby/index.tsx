import styles from "./styles.module.css";
import { Header } from "components";


const Lobby = (): JSX.Element => {
  return (
    <>
      <div className={styles.basicGrid}>
        <div className={`${styles.gotchiSelection} ${styles.gridTile}`}> Gotchi Selection</div>
        <div className={`${styles.mapSelection} ${styles.gridTile}`}> Map Selection</div>
        <div className={`${styles.availablePlayers} ${styles.gridTile}`}> Player Available</div>
        <div className={`${styles.chat} ${styles.gridTile}`}> Chat</div>
      </div>
    </>
  );
};

export default Lobby;

