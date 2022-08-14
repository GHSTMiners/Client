import SquareButton from "components/SquareButton";
import gameEvents from "game/helpers/gameEvents";
import { ITEMWIDTH } from "helpers/vars";
import Client from "matchmaking/Client";
import { ConsumableItem } from "types";
import styles from "../styles.module.css"

function renderConsumable(playerConsumable: ConsumableItem, index: number) {
  return (
    <SquareButton size={ITEMWIDTH}
      quantity={playerConsumable ? playerConsumable.quantity : -1}
      disabled={playerConsumable ? false : true}
      key={`squareButton${index}`}
      onClick={() => Client.getInstance().phaserGame.events.emit( gameEvents.console.SHORTCUT, index)}>
      <div className={styles.inventoryConsumable}>
        <img src={playerConsumable ? playerConsumable.image : ''} alt={playerConsumable ? playerConsumable.name : 'empty'} />
      </div>
    </SquareButton>
  );
}

export default renderConsumable