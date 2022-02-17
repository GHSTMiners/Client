import styles from "./styles.module.css";
import Consumables from "./Consumables";
import Artifacts from "./Artifacts";
import Crypto from "./Crypto";

const Inventory = () => {
  return (
    <>
      <div className={styles.inventoryTitle}>INVENTORY</div>
      <Consumables />
      <Artifacts />
      <Crypto />
    </>
  );
};

export default Inventory;
