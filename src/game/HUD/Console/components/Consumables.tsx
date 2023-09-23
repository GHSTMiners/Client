import styles from "./styles.module.css";
import SquareButton from "components/SquareButton";
import { ItemTypes, ITEMWIDTH } from "helpers/vars"
import { useGlobalStore } from "store";
import DraggableItem from "./DraggableItem";

const Consumables = () => {
  const worldConsumables = useGlobalStore( state => state.worldConsumables )
  const consumables = useGlobalStore( state => state.consumables )
  
  return (
    <div className={styles.consumablesContainer}>
      <div className={styles.sectionTitle}>CONSUMABLES</div>
      <div className={styles.consumableItems}>
        { 
          Object.keys(worldConsumables).map( (id) =>{
            const quantity =  consumables[+id] ? consumables[+id].amount : 0;
            const item = worldConsumables[+id];
            item.quantity = quantity;
            return(
              <SquareButton size={ITEMWIDTH} 
                            type={ItemTypes.Consumable}
                            quantity={ quantity }
                            disabled={ false }
                            key={`inventoryConsumable${id}`}>
                <DraggableItem item={item} amount={quantity} />
              </SquareButton>
            )
          }) 
        }
      </div>
    </div>
  );
};

export default Consumables;
