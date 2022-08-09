import styles from "./styles.module.css";
import SquareButton from "components/SquareButton";
import { useContext } from "react";
import { HUDContext } from "../..";
import { ITEMWIDTH } from "helpers/vars"

const Consumables = () => {

  const playerBalance = useContext(HUDContext);

  // rendering function for each consumable  slot 
  const renderConsumable = (index:number) =>{
    const isFilled = (playerBalance.consumables.length >= index);
    return (
    <SquareButton size={ITEMWIDTH} 
                  quantity={ isFilled ? playerBalance.consumables[index-1].quantity : -1 }
                  disabled={ isFilled ? false : true}
                  key={`inventoryConsumable${index}`}>
      <div className={styles.inventoryConsumable}>
        <img src={ isFilled ? playerBalance.consumables[index-1].image : ''}  alt={ isFilled ? playerBalance.consumables[index-1].name : 'empty'}/>
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
