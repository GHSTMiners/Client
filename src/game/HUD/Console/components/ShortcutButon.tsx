import SquareButton from "components/SquareButton";
import gameEvents from "game/helpers/gameEvents";
import { ItemTypes, ITEMWIDTH } from "helpers/vars";
import useSoundFXManager from "hooks/useSoundFXManager";
import Client from "matchmaking/Client";
import { useEffect } from "react";
import { useDrop } from "react-dnd";
import { useGlobalStore } from "store";
import { Item } from "types";
import Explosive from "./Explosive";

interface Props {
  item: Item | undefined, 
  amount: number, 
  index: number
}

const ShortcutButon: React.FC<Props> = ({item, amount, index}) => {
  const setUserShortcut = useGlobalStore(state => state.setUserShortcut)
  const soundFXManager = useSoundFXManager();

  useEffect(()=>{ 
    const shortcutCallback = (shotcutID:number) => {
      if ( item && shotcutID === index && Object.keys(item).length >0 ) item.callback();
    }
    Client.getInstance().phaserGame.events.on( gameEvents.console.SHORTCUT, shortcutCallback );
    
    return () => {
      Client.getInstance().phaserGame.events.off( gameEvents.console.SHORTCUT, shortcutCallback );
    }
  },[ item , index ])

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
    <div ref={dropRef}>
      <SquareButton size={ITEMWIDTH}
        type={ItemTypes.Explosive}
        quantity={amount ? amount : -1}
        key={`squareButton${index}`}
        onClick={() => {Client.getInstance().phaserGame.events.emit( gameEvents.console.SHORTCUT, index) }}>
        {!isOver && renderItem() }
        {isOver && <div>{`SHORTCUT KEY ${index}`}</div>}
      </SquareButton>
    </div>
  );
}

export default ShortcutButon