import { useDrag } from 'react-dnd'
import { ItemTypes }  from 'helpers/vars'
import { Item } from "types";
import styles from "./styles.module.css"
import { useEffect, useState } from 'react';

interface Props {
  item: Item , 
  amount: number
}

const Explosive: React.FC<Props> = ({ item , amount}) => {
  const [selectedItem , setSelectedItem] = useState(item);
  
  useEffect(()=>{
    setSelectedItem( state => { state=item; state.quantity=amount ; return({...state})})
  },[item,amount])
  
  const [{ opacity }, dragRef] = useDrag(
    () => ({
      type: ItemTypes.Explosive,
      item:  selectedItem,
      collect: (monitor) => ({
        opacity: monitor.isDragging() ? 0.5 : 1
      })
    }),
    [selectedItem]
  )

  return (
      <div ref={dragRef}>
        <div className={styles.inventoryConsumable}   style={{ opacity }}>
          <img src={selectedItem.image}  alt={selectedItem.name} />
        </div>
        <div className={styles.quantity}>
          { (selectedItem.quantity)? `x  ${selectedItem.quantity}` : 'x 0'}
        </div>  
      </div>
  )
}

export default Explosive