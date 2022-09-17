import styles from "./styles.module.css";
import SquareButton from "components/SquareButton";
import { ITEMWIDTH } from "helpers/vars"
import { useGlobalStore } from "store";

const Consumables = () => {

  const worldExplosives = useGlobalStore( state => state.worldExplosives )
  const explosives = useGlobalStore( state => state.explosives )

  const renderConsumable = (index:number) =>{
    const isFilled = (explosives.length >= index);
    return (
    <SquareButton size={ITEMWIDTH} 
                  quantity={ isFilled ? explosives[index-1] : -1 }
                  disabled={ isFilled ? false : true}
                  key={`inventoryConsumable${index}`}>
      <div className={styles.inventoryConsumable}>
        <img src={ isFilled ? worldExplosives[index-1].image : ''}  alt={ isFilled ? worldExplosives[index-1].name : 'empty'}/>
      </div>
    </SquareButton>
    );
  }
  
  // rendering the initial consumables slots
  let itemList = [];
  for (let i = 1; i < 9; i++) {
    itemList.push( renderConsumable(i) )
  }

  return (
    <div className={styles.consumablesContainer}>
      <div className={styles.sectionTitle}>CONSUMABLES</div>
      <div className={styles.consumableItems}>{itemList}</div>
    </div>
  );
};

export default Consumables;
