import SquareButton from "components/SquareButton";
import { ITEMWIDTH } from "helpers/vars";
import Client from "matchmaking/Client";
import { consumableItem } from "types";
import styles from "../styles.module.css"

const renderConsumable = ( playerConsumable: consumableItem, index:number) =>{
  return (
  <SquareButton size={ITEMWIDTH} 
                quantity={ playerConsumable ? playerConsumable.quantity : -1 }
                disabled={ playerConsumable ? false : true}
                key={`squareButton${index}`}
                onClick={()=> Client.getInstance().phaserGame.events.emit("shortcut",index)}>
    <div className={styles.inventoryConsumable}>
      <img src={ playerConsumable ? playerConsumable.image : ''}  alt={playerConsumable ? playerConsumable.name : 'empty'}/>
    </div>
  </SquareButton>
  );
}

export default renderConsumable