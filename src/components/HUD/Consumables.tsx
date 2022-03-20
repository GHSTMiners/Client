import styles from "./styles.module.css";
import SquareButton from "components/SquareButton";
import { useContext } from "react";
import { HUDContext } from ".";
import { smallButton } from ".";

const Consumables = () => {

  const playerConsumables = useContext(HUDContext);

  // rendering function for each consumable  slot 
  const renderConsumable = (index:number) =>{
    const isFilled = (playerConsumables.length >= index);
    return (
    <SquareButton size={smallButton} 
                  quantitiy={ isFilled ? playerConsumables[index-1].quantity : -1 }
                  disabled={ isFilled ? false : true}>
      <div className={styles.inventoryConsumable}>
        <img src={ isFilled ? playerConsumables[index-1].image : ''} />
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
