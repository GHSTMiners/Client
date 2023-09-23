import styles from "./styles.module.css";
import Explosives from "./components/Explosives";
import Consumables from "./components/Consumables";
import Cargo from "./components/Cargo";
import ConsoleButtons from "./components/ConsoleButtons";
import useVisible from "hooks/useVisible";
import { useEffect } from "react";
import { DndProvider } from 'react-dnd'
import { HTML5Backend } from 'react-dnd-html5-backend'
import RetroToggle from "components/RetroToggle";
import { useGlobalStore } from "store";

const Console = () => {
   
  const consoleVisbility = useVisible('console');
  const consoleState = useGlobalStore(state => state.consoleState);
  const setConsoleState = useGlobalStore(state => state.setConsoleState);

  useEffect(()=>{
    setConsoleState(consoleVisbility.state)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  },[consoleVisbility.state])

  useEffect(()=>{
    consoleVisbility.setState(consoleState)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  },[consoleState])

  return (
    <div className={`${styles.mainConsole} ${consoleVisbility.state ? styles.mainConsoleUp : styles.mainConsoleDown}`}>
      <div className={styles.mainConsoleContainer}>
        <DndProvider backend={HTML5Backend}>
          <div className={styles.playerButtons}>
            <ConsoleButtons />
            <RetroToggle />
          </div>
            <div className={styles.inventoryTitle}>
              INVENTORY
            </div>
            <Explosives />
            <Consumables />
            <Cargo />
        </DndProvider>
      </div>
    </div>
  );
};

export default Console