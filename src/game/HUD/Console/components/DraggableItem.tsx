import { useDrag } from 'react-dnd'
import { Item } from "types";
import styles from "./styles.module.css"
import { useEffect, useState } from 'react';
import useSoundFXManager from 'hooks/useSoundFXManager';
import { useGlobalStore } from 'store';

interface Props {
  item: Item , 
  amount: number
}

const DraggableItem: React.FC<Props> = ({ item , amount}) => {
  const [selectedItem , setSelectedItem] = useState(item);
  const setIsDraggingItem = useGlobalStore( state=> state.setIsDraggingItem);
  const soundFXManager = useSoundFXManager();
  
  useEffect(()=>{
    setSelectedItem( state => { state=item; state.quantity=amount ; return({...state})})
   },[item,amount])
  
  const [{ opacity , isDragging }, dragRef] = useDrag(
    () => ({
      type: item.type,
      item:  selectedItem,
      collect: (monitor) => ({
        opacity: monitor.isDragging() ? 0.5 : 1,
        isDragging: monitor.isDragging()
      })
    }),
    [selectedItem]
  )

  useEffect(()=>{
    setIsDraggingItem(isDragging)
    if(isDragging) soundFXManager.play('pop');
  },[soundFXManager,setIsDraggingItem,isDragging])

  return (
      <div ref={dragRef}>
        <div className={styles.inventoryConsumable}   style={{ opacity }}>
          <img src={selectedItem.image}  alt={selectedItem.name} />
        </div>
        <div className={styles.quantity}>
          {  `x  ${amount}` }
        </div>  
      </div>
  )
}

export default DraggableItem