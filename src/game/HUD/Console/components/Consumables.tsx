import styles from "./styles.module.css";
import SquareButton from "components/SquareButton";
import { ItemTypes, ITEMWIDTH } from "helpers/vars"
import { useGlobalStore } from "store";
import Explosive from "./Explosive";

const Consumables = () => {

  const worldExplosives = useGlobalStore( state => state.worldExplosives )
  const explosives = useGlobalStore( state => state.explosives )
  
  return (
    <div className={styles.consumablesContainer}>
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
                            key={`inventoryConsumable${id}`}>
                <Explosive item={item} amount={quantity} />
              </SquareButton>
            )
          }) 
        }
      </div>
    </div>
  );
};



export default Consumables;
