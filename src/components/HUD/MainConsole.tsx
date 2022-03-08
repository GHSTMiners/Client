import styles from "./styles.module.css";
import { useState , createContext, useContext, useEffect } from "react";
import SquareButton from "components/SquareButton";
import expandIcon from "assets/hud/expand_icon.svg";
import drillIcon from "assets/hud/drill.png";
import Inventory from "./Inventory";
import Client from "matchmaking/Client";

const MainConsole = () => {
  const smallButton = "3.3rem";
  const bigButton = "5.8rem";
  const [consoleUp, setConsoleUp] = useState(false);

  useEffect(()=>{
    Client.getInstance().phaserGame.events.on("close_dialogs", ()=>{setConsoleUp(false)} );
  },[])

  return (
    <div
      className={`${styles.mainConsole} 
    ${consoleUp ? styles.mainConsoleUp : styles.mainConsoleDown}`}
    >
      <div className={styles.mainConsoleContainer}>
        <div className={styles.playerButtons}>
          <SquareButton size={bigButton} quantitiy={1}>
            <img src={drillIcon} className={styles.toolIcon} />
          </SquareButton>
          <SquareButton size={smallButton} quantitiy={2}>
            ITEM 1
          </SquareButton>
          <SquareButton size={smallButton}>ITEM 2</SquareButton>
          <SquareButton size={smallButton}>ITEM 3</SquareButton>
          <SquareButton size={smallButton}>ITEM 4</SquareButton>
          <div
            className={styles.expandButton}
            onClick={() => {
              setConsoleUp(!consoleUp);
            }}
            style={{ width: smallButton, height: smallButton }}
          >
            <img
              src={expandIcon}
              className={`${styles.expandIncon} 
                ${consoleUp ? styles.expandIconUp : styles.expandIconDown}`}
              onClick={() => {
                setConsoleUp(!consoleUp);
              }}
            />
          </div>
        </div>
        <Inventory />
      </div>
    </div>
  );
};

export default MainConsole;
