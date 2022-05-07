import styles from "./styles.module.css";
import { useState , createContext, useContext, useEffect, ReactFragment } from "react";
import SquareButton from "components/SquareButton";
import expandIcon from "assets/hud/expand_icon.svg";
import drillIcon from "assets/hud/drill.png";
import Inventory from "./Inventory";
import Client from "matchmaking/Client";
import { HUDContext, smallButton } from ".";

const MainConsole = () => {
  const bigButton = "5.8rem";
  const playerConsumables = useContext(HUDContext);
  const [consoleUp, setConsoleUp] = useState(false);

  useEffect(()=>{
    Client.getInstance().phaserGame.events.once("change_console_state", ()=> setConsoleUp(!consoleUp)  );
  },[consoleUp])

  useEffect(()=>{
    Client.getInstance().phaserGame.events.on("close_dialogs", ()=>{setConsoleUp(false)} );
  },[])

  // rendering function for each consumable  slot. TO DO: replace by drag-and-drop system to assign shortcuts
  const renderConsumable = (index:number) =>{
    const isFilled = (playerConsumables.length >= index);
    return (
    <SquareButton size={smallButton} 
                  quantity={ isFilled ? playerConsumables[index-1].quantity : -1 }
                  disabled={ isFilled ? false : true}
                  key={`squareButton${index}`}>
      <div className={styles.inventoryConsumable}>
        <img src={ isFilled ? playerConsumables[index-1].image : ''} />
      </div>
    </SquareButton>
    );
  }

  // rendering the initial shortcut slots
  let shortcutButtons = [];
  for (let i = 1; i < 5; i++) {
    shortcutButtons.push( renderConsumable(i) )
  }

  function updateButtons (){
    let updatedButtons = [];
    for (let i = 1; i < 5; i++) {
      updatedButtons.push( renderConsumable(i) )
    }
    setConsoleButtons( updatedButtons );
  }

  const [consoleButtons , setConsoleButtons] = useState(shortcutButtons);

  useEffect(()=>{  updateButtons()  },[playerConsumables])

  return (
    <div
      className={`${styles.mainConsole} 
    ${consoleUp ? styles.mainConsoleUp : styles.mainConsoleDown}`}
    >
      <div className={styles.mainConsoleContainer}>
        <div className={styles.playerButtons}>
          <SquareButton size={bigButton} quantity={1}>
            <img src={drillIcon} className={styles.toolIcon} />
          </SquareButton>
          {consoleButtons}
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
