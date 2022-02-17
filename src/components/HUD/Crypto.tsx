import * as Chisel from "chisel-api-interface";
import Client from "matchmaking/Client";
import styles from "./styles.module.css";
import cargoIcon from "assets/hud/cargo_icon.svg";

const Crypto = () => {
  //prettier-ignore
  const world: Chisel.DetailedWorld | undefined =   Client.getInstance().chiselWorld;
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

  return (
    <div className={styles.cryptoContainer}>
      <div className={styles.sectionTitle}>CRYPTO</div>
      <img src={cargoIcon} className={styles.cargoIcon} />
      <div className={styles.cryptoGallery}>{cryptoInventoryList}</div>
    </div>
  );
};

export default Crypto;
