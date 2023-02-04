import SquareButton from "components/SquareButton";
import gameEvents from "game/helpers/gameEvents";
import { ItemTypes, ITEMWIDTH } from "helpers/vars";
import useSoundFXManager from "hooks/useSoundFXManager";
import Client from "matchmaking/Client";
import { useEffect, useState } from "react";
import { useDrop } from "react-dnd";
import { useGlobalStore } from "store";
import { Item } from "types";
import Explosive from "./Explosive";
import styles from "./styles.module.css"
import ButtonCooldown from "./ButtonCooldown";
import useCooldown from "hooks/useCooldown";

interface Props {
  item: Item | undefined, 
  amount: number, 
  index: number
}

const ShortcutButon: React.FC<Props> = ({item, amount, index}) => {
  const setUserShortcut = useGlobalStore(state => state.setUserShortcut)
  const soundFXManager = useSoundFXManager();
  const [nextTimeAvailable, setNextTimeAvailable] = useState<Date>(new Date(0))
  const [secondsLeft, cooldownProgress]=useCooldown(nextTimeAvailable,item? item?.cooldown: 0);
  const explosivesRecord = useGlobalStore( state => state.explosives )

  useEffect(()=>{ 
    const shortcutCallback = (shotcutID:number) => {
      const isItemReady = (new Date(nextTimeAvailable).getTime() - new Date().getTime() )<=0;
      if ( item && shotcutID === index && Object.keys(item).length >0 && item.quantity>0  &&  isItemReady) {
        console.log(`💣The explosive dropped has a cooldown of (s) ${item.cooldown}`)
        const currentTime = new Date();
        setNextTimeAvailable( state => { state = new Date( currentTime.getTime() + (item.cooldown * 1000) ); return state })
        item.callback()
      };
    }
    Client.getInstance().phaserGame.events.on( gameEvents.console.SHORTCUT, shortcutCallback );
    
    return () => {
      Client.getInstance().phaserGame.events.off( gameEvents.console.SHORTCUT, shortcutCallback );
    }
  },[ item , index , explosivesRecord,nextTimeAvailable])

  const renderItem = () => {
    switch(item?.type){
      case ItemTypes.Explosive:
        return( <>{!isOver && <Explosive item={item} amount={amount}/>}</>  )
      default:
        return( <div></div> )
    }
  }

  const [{ isOver }, dropRef] = useDrop({
    accept: ItemTypes.Explosive,
    hover: (item,monitor) =>{},
    drop: ( droppedItem:Item ) => {
      setUserShortcut(index, droppedItem)
      soundFXManager.play('locked')
      },
    collect: (monitor) => ({
        isOver: monitor.isOver()
    })
  })

  return (
    <div className={styles.shortcutContainer} ref={dropRef}>
      <ButtonCooldown secondsLeft={secondsLeft} cooldownProgress={cooldownProgress} />
      <SquareButton size={ITEMWIDTH}
        type={ItemTypes.Explosive}
        quantity={amount ? amount : -1}
        key={`squareButton${index}`}
        onClick={() => { Client.getInstance().phaserGame.events.emit( gameEvents.console.SHORTCUT, index)  }}>
        {!isOver && renderItem() }
        {isOver && <div>{`SHORTCUT KEY ${index}`}</div>}
      </SquareButton>
    </div>
  );
}

export default ShortcutButon