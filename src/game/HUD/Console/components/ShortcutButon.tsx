import SquareButton from "components/SquareButton";
import gameEvents from "game/helpers/gameEvents";
import { ITEMWIDTH } from "helpers/vars";
import Client from "matchmaking/Client";
import { useEffect } from "react";
import { ExplosiveItem } from "types";
import dropExplosive from "../helpers/dropExplosive";
import styles from "../styles.module.css"

interface Props {
  item: ExplosiveItem | undefined, 
  amount: number, 
  index: number
}

const ShortcutButon: React.FC<Props>  = ({item, amount, index}) => {

  useEffect(()=>{ 
    const shortcutCallback = (shotcutID:number) => {
      if (shotcutID === index) dropExplosive( item?.id) 
    }
    Client.getInstance().phaserGame.events.on( gameEvents.console.SHORTCUT, shortcutCallback );
    
    return () => {
      Client.getInstance().phaserGame.events.off( gameEvents.console.SHORTCUT, shortcutCallback );
    }
  },[ item , index ])

  return (
    <SquareButton size={ITEMWIDTH}
      quantity={amount ? amount : -1}
      disabled={amount ? false : true}
      key={`squareButton${index}`}
      onClick={() => {Client.getInstance().phaserGame.events.emit( gameEvents.console.SHORTCUT, item?.id) }}>
      <div className={styles.inventoryConsumable}>
        <img src={amount ? item?.image : ''}  alt={amount ? item?.name : 'empty'} hidden={amount? false: true} />
      </div>
    </SquareButton>
  );
}

export default ShortcutButon