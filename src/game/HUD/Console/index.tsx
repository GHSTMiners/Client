import styles from "./styles.module.css";
import SquareButton from "components/SquareButton";
import expandIcon from "assets/hud/expand_icon.svg";
import drillIcon from "assets/hud/drill.png";
import { ITEMWIDTH, ARTIFACTWIDTH } from "helpers/vars"
import Consumables from "./components/Consumables";
import Artifacts from "./components/Artifacts";
import Cargo from "./components/Cargo";
import ConsoleButtons from "./components/ConsoleButtons";
import useVisible from "hooks/useVisible";
import React from "react";

const Console = () => {
   
  const consoleVisbility = useVisible('console');

  return (
    <div
      className={`${styles.mainConsole} 
      ${consoleVisbility.state ? styles.mainConsoleUp : styles.mainConsoleDown}`}
    >
      <div className={styles.mainConsoleContainer}>
        <div className={styles.playerButtons}>
          <SquareButton size={ARTIFACTWIDTH} quantity={1}>
            <img src={drillIcon} className={styles.toolIcon} alt={'drill'}/>
          </SquareButton>
          <ConsoleButtons />
          <div
            className={styles.expandButton}
            onClick={ consoleVisbility.change }
            style={{ width: ITEMWIDTH, height: ITEMWIDTH }}
          >
            <img
              src={expandIcon}
              className={`${styles.expandIncon} 
                ${consoleVisbility.state ? styles.expandIconUp : styles.expandIconDown}`}
              onClick={ consoleVisbility.change }
              alt={'Show/Hide Full Console'}
            />
          </div>
        </div>
        <>
          <div className={styles.inventoryTitle}>INVENTORY</div>
          <Consumables />
          <Artifacts />
          <Cargo />
        </>
      </div>
    </div>
  );
};

export default React.memo(Console)