import styles from "./styles.module.css";
import * as Chisel from "chisel-api-interface";
import Client from "matchmaking/Client";
import SquareButton from "components/SquareButton";
import cargoIcon from "assets/hud/cargo_icon.svg";

const Inventory= () => {
    const smallButton = "3.3rem";
    const world: Chisel.DetailedWorld | undefined =
    Client.getInstance().chiselWorld;

  const itemList = [];
  for (let i = 1; i < 9; i++) {
    itemList.push(<SquareButton size={smallButton}>ITEM {i}</SquareButton>);
  }

  const artifactList = [];
  for (let i = 1; i < 5; i++) {
    artifactList.push(<SquareButton size={smallButton}>ITEM {i}</SquareButton>);
  }

  let crystalsArray: { cryptoID: number; name: string; image: string }[] = [];
  for (let i = 0; i < world.crypto.length; i++) {
    crystalsArray.push({
      cryptoID: world.crypto[i].id,
      name: `${world.crypto[i].name}`,
      image: `https://chisel.gotchiminer.rocks/storage/${world.crypto[i].soil_image}`,
    });
  }

  const inventoryCrystal = (tag: string, quantity: number, image: string) => (
    <div className={styles.crystalContainer}>
      <img src={image} className={styles.crystalIcon} />
      <div className={styles.crystalTag}>
        {tag} x {quantity}
      </div>
    </div>
  );

  const cryptoInventoryList = crystalsArray.map(function (crypto) {
    //const quantity =  Client.getInstance().ownPlayer.cargo.get(crypto.name)?.amount;
    return inventoryCrystal(crypto.name, 0, crypto.image);
  });

    return(
        <>
        <div className={styles.inventoryTitle}>INVENTORY</div>
        <div className={styles.consumablesContainer}>
          <div className={styles.sectionTitle}>CONSUMABLES</div>
          <div className={styles.consumableItems}>{itemList}</div>
        </div>
        <div className={styles.artifactsContainer}>
          <div className={styles.sectionTitle}>ARTIFACTS</div>
          <div className={styles.artifactItems}>{artifactList}</div>
        </div>
        <div className={styles.cryptoContainer}>
          <div className={styles.sectionTitle}>CRYPTO</div>
          <img src={cargoIcon} className={styles.cargoIcon} />
          <div className={styles.cryptoGallery}>{cryptoInventoryList}</div>
        </div>
        </>
    )
}

export default Inventory