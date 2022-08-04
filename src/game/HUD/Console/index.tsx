import styles from "./styles.module.css";
import SquareButton from "components/SquareButton";
import expandIcon from "assets/hud/expand_icon.svg";
import drillIcon from "assets/hud/drill.png";
import { ITEMWIDTH, ARTIFACTWIDTH } from "helpers/vars"
import Consumables from "./components/Consumables";
import Artifacts from "./components/Artifacts";
import Crypto from "./components/Crypto";
import useConsolePosition from "./hooks/useConsolePosition"
import useConsoleButtons from "./hooks/useConsoleButtons";

const Console = () => {

  const consolePosition = useConsolePosition();
  const consoleButtons = useConsoleButtons();
 
  return (
    <div
      className={`${styles.mainConsole} 
    ${consolePosition.state ? styles.mainConsoleUp : styles.mainConsoleDown}`}
    >
      <div className={styles.mainConsoleContainer}>
        <div className={styles.playerButtons}>
          <SquareButton size={ARTIFACTWIDTH} quantity={1}>
            <img src={drillIcon} className={styles.toolIcon} alt={'drill'}/>
          </SquareButton>
          {consoleButtons.renderedButtons}
          <div
            className={styles.expandButton}
            onClick={ consolePosition.change }
            style={{ width: ITEMWIDTH, height: ITEMWIDTH }}
          >
            <img
              src={expandIcon}
              className={`${styles.expandIncon} 
                ${consolePosition.state ? styles.expandIconUp : styles.expandIconDown}`}
              onClick={ consolePosition.change }
              alt={'Show/Hide Full Console'}
            />
          </div>
        </div>
        <>
          <div className={styles.inventoryTitle}>INVENTORY</div>
          <Consumables />
          <Artifacts />
          <Crypto />
        </>
      </div>
    </div>
  );
};

export default Console