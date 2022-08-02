import styles from "./styles.module.css";
import { useState , useContext, useEffect } from "react";
import SquareButton from "components/SquareButton";
import expandIcon from "assets/hud/expand_icon.svg";
import drillIcon from "assets/hud/drill.png";
import Inventory from "./components/Inventory";
import Client from "matchmaking/Client";
import { BUTTONWIDTH } from "helpers/vars"
import { HUDContext} from "..";

export const MainConsole = () => {
  const bigButton = "5.8rem";
  const playerConsumables = useContext(HUDContext);
  const [consoleUp, setConsoleUp] = useState(false);

  useEffect(()=>{
    Client.getInstance().phaserGame.events.once("change_console_state", ()=> setConsoleUp(!consoleUp)  );
  },[consoleUp])

  useEffect(()=>{
    const lowerConsole = ()=> setConsoleUp(false) ;
    Client.getInstance().phaserGame.events.on("close_dialogs", lowerConsole );

    return () => {
      Client.getInstance().phaserGame.events.off("close_dialogs", lowerConsole )
    }
  },[])

  // rendering function for each consumable  slot. TO DO: replace by drag-and-drop system to assign shortcuts
  const renderConsumable = (index:number) =>{
    const isFilled = (playerConsumables.length >= index);
    return (
    <SquareButton size={BUTTONWIDTH} 
                  quantity={ isFilled ? playerConsumables[index-1].quantity : -1 }
                  disabled={ isFilled ? false : true}
                  key={`squareButton${index}`}
                  onClick={()=> Client.getInstance().phaserGame.events.emit("shortcut",index)}>
      <div className={styles.inventoryConsumable}>
        <img src={ isFilled ? playerConsumables[index-1].image : ''}  alt={isFilled ? playerConsumables[index-1].name : 'empty'}/>
      </div>
    </SquareButton>
    );
  }

  // rendering the initial shortcut slots
  let shortcutButtons = [];
  for (let i = 1; i < 5; i++) {
    shortcutButtons.push( renderConsumable(i) )
  }

  const [consoleButtons , setConsoleButtons] = useState(shortcutButtons);

  useEffect(()=>{  
    function updateButtons (){
      let updatedButtons = [];
      for (let i = 1; i < 5; i++) {
        updatedButtons.push( renderConsumable(i) )
      }
      setConsoleButtons( updatedButtons );
    }

    updateButtons()  
    // eslint-disable-next-line react-hooks/exhaustive-deps
  },[playerConsumables])

  return (
    <div
      className={`${styles.mainConsole} 
    ${consoleUp ? styles.mainConsoleUp : styles.mainConsoleDown}`}
    >
      <div className={styles.mainConsoleContainer}>
        <div className={styles.playerButtons}>
          <SquareButton size={bigButton} quantity={1}>
            <img src={drillIcon} className={styles.toolIcon} alt={'drill'}/>
          </SquareButton>
          {consoleButtons}
          <div
            className={styles.expandButton}
            onClick={() => {
              setConsoleUp(!consoleUp);
            }}
            style={{ width: BUTTONWIDTH, height: BUTTONWIDTH }}
          >
            <img
              src={expandIcon}
              className={`${styles.expandIncon} 
                ${consoleUp ? styles.expandIconUp : styles.expandIconDown}`}
              onClick={() => {
                setConsoleUp(!consoleUp);
              }}
              alt={'Show/Hide Full Console'}
            />
          </div>
        </div>
        <Inventory />
      </div>
    </div>
  );
};
