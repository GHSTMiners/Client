import styles from "./styles.module.css";
import SquareButton from "components/SquareButton";
import { ItemTypes, ITEMWIDTH } from "helpers/vars"
import { useGlobalStore } from "store";
import DraggableItem from "./DraggableItem";

const Explosives = () => {
  const worldExplosives = useGlobalStore( state => state.worldExplosives )
  const explosives = useGlobalStore( state => state.explosives )
  
  return (
    <div className={styles.explosivesContainer}>
      <div className={styles.sectionTitle}>EXPLOSIVES</div>
      <div className={styles.consumableItems}>
        { 
          Object.keys(worldExplosives).map( (id) =>{
            const quantity =  explosives[+id] ? explosives[+id].amount : 0;
            const item = worldExplosives[+id];
            item.quantity = quantity;
            return(
              <SquareButton size={ITEMWIDTH} 
                            type={ItemTypes.Explosive}
                            quantity={ quantity }
                            disabled={ false }
                            key={`inventoryExplosive${id}`}>
                <DraggableItem item={item} amount={quantity} />
              </SquareButton>
            )
          }) 
        }
      </div>
    </div>
  );
};

export default Explosives;
