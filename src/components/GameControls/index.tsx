import numericInfoKey from "assets/svgs/infoKeys/1234.svg"
import eKey from "assets/svgs/infoKeys/e.svg"
import spaceKey from "assets/svgs/infoKeys/space.svg"
import wasdKeys from "assets/svgs/infoKeys/wasd.svg"
import azertyKeys from "assets/svgs/infoKeys/azerty.svg"
import tKey from "assets/svgs/infoKeys/t.svg"
import esc from "assets/svgs/infoKeys/esc.svg"
import tabKey from "assets/svgs/infoKeys/tab.svg"
import styles from "./styles.module.css"
import { useGlobalStore } from "store"
import { KeyboardLayouts } from "helpers/vars"

const GameControls: React.FC  = () => {
    const sizeUnit = 2;
    const keyboardLayout = useGlobalStore( state => state.keyboardLayout);
    const renderControlItem = ( keyIcon: string , description: string, iconHeight : number ) =>{
        return(
          <div className={styles.controlKeyContainer}>
            <img src={keyIcon} style={{height:`${iconHeight}rem`}} alt={keyIcon}/>
            <div className={styles.controlDescription}>
              {description}
            </div>
          </div>
        )
    }

    const renderMovementKeys = () =>{
      switch( keyboardLayout ){
        case KeyboardLayouts.QWERTY:
          return renderControlItem(wasdKeys,'Movement Keys', 2*sizeUnit)
        case KeyboardLayouts.AZERTY:
          return renderControlItem(azertyKeys,'Movement Keys', 2*sizeUnit)
        default:
          return
      }
    }

    return(
        <>
            {renderMovementKeys()}
            {renderControlItem(numericInfoKey,'Use Explosives', sizeUnit)}
            {renderControlItem(spaceKey,'Open/Close Console', sizeUnit)}
            {renderControlItem(tabKey,'Leaderboard',sizeUnit)}
            {renderControlItem(esc,'Close all windows', sizeUnit)}
            {renderControlItem(eKey,'Interact with Buildings',sizeUnit)}
            {renderControlItem(tKey,'Open Chat',sizeUnit)}
        </>
    )
}

export default GameControls


