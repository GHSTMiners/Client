import styles from "./styles.module.css";
import SquareButton from "components/SquareButton";

const Consumables = () => {
  const smallButton = "3.3rem";
  const itemList = [];

  for (let i = 1; i < 9; i++) {
    itemList.push(<SquareButton size={smallButton}>ITEM {i}</SquareButton>);
  }

  return (
    <div className={styles.consumablesContainer}>
      <div className={styles.sectionTitle}>CONSUMABLES</div>
      <div className={styles.consumableItems}>{itemList}</div>
    </div>
  );
};

export default Consumables;
