import * as Chisel from "chisel-api-interface";
import Client from "matchmaking/Client";
import styles from "./styles.module.css";
import cargoIcon from "assets/hud/cargo_icon.svg";
import { useEffect, useState } from "react";
import { CargoEntry } from "matchmaking/Schemas";

const Crypto = () => {
  //prettier-ignore
  const world: Chisel.DetailedWorld | undefined =   Client.getInstance().chiselWorld;

  let crystalsArray: {
    cryptoID: number;
    name: string;
    quantity: number;
    image: string;
  }[] = [];

  for (let i = 0; i < world.crypto.length; i++) {
    crystalsArray.push({
      cryptoID: world.crypto[i].id,
      name: `${world.crypto[i].name}`,
      quantity: 0,
      image: `https://chisel.gotchiminer.rocks/storage/${world.crypto[i].soil_image}`,
    });
  }

  const initialCrystalArray = crystalsArray;

  const [playerCargo, setPlayerCargo] = useState(initialCrystalArray);

  const updateCrystalArray = [];

  useEffect(() => {
    //Wait until the player was admitted to the server
    Client.getInstance().phaserGame.events.on("joined_game", () => {
      //Attach an event handler to refresh the cargo
      Client.getInstance().ownPlayer.cargo.onAdd = (item: CargoEntry) => {
        crystalsArray.map((el) => {
          if (el.cryptoID == item.cryptoID) {
            el.quantity = item.amount;
          }
        });
        //crystalsArray[item.cryptoID].quantity = item.amount;
        setPlayerCargo(crystalsArray);
        console.log(item.cryptoID);
        item.onChange = () => {
          crystalsArray.map((el) => {
            if (el.cryptoID == item.cryptoID) {
              el.quantity = item.amount;
            }
          });
          setPlayerCargo(crystalsArray);
        };
        item.onRemove = () => {
          crystalsArray.map((el) => {
            if (el.cryptoID == item.cryptoID) {
              el.quantity = 0;
            }
          });
          setPlayerCargo(initialCrystalArray);
          console.log("item remove callback");
        };
      };
      Client.getInstance().ownPlayer.cargo.onRemove = () => {
        setPlayerCargo(initialCrystalArray);
        console.log("cargo remove callback");
      };
      // TO DO: Reset cargo after player dies
    });
  }, []);

  const inventoryCrystal = (tag: string, quantity: number, image: string) => (
    <div className={styles.crystalContainer}>
      <img src={image} className={styles.crystalIcon} />
      <div className={styles.crystalTag}>
        {tag} x {quantity}
      </div>
    </div>
  );

  let cryptoInventoryList = playerCargo.map(function (crypto) {
    return inventoryCrystal(crypto.name, crypto.quantity, crypto.image);
  });

  // Updating crypto list when player cargo changes
  useEffect(() => {
    cryptoInventoryList = playerCargo.map(function (crypto) {
      return inventoryCrystal(crypto.name, crypto.quantity, crypto.image);
    });
  }, playerCargo);

  return (
    <div className={styles.cryptoContainer}>
      <div className={styles.sectionTitle}>CRYPTO</div>
      <img src={cargoIcon} className={styles.cargoIcon} />
      <div className={styles.cryptoGallery}>{cryptoInventoryList}</div>
    </div>
  );
};

export default Crypto;
