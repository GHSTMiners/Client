import * as Chisel from "chisel-api-interface";
import Client from "matchmaking/Client";
import styles from "./styles.module.css";
import cargoIcon from "assets/hud/cargo_icon.svg";
import { useContext, useEffect, useState } from "react";
import { CargoEntry, ExplosiveEntry, WalletEntry } from "matchmaking/Schemas";
import VitalsConsole from "./VitalsConsole";
import Explosive from "game/World/Explosive";

const Crypto = () => {
  const world: Chisel.DetailedWorld | undefined =   Client.getInstance().chiselWorld;

  type CryptoArray = { cryptoID: number; name: string; image: string };
  type BalanceData = Record<number, number>; // ( cryptoID , quantity }

  let crystalsArray: CryptoArray[] = [];
  let tempCargoBalance: BalanceData = [];

  // inializing cargo & wallet ballances to 0
  for (let i = 0; i < world.crypto.length; i++) {
    crystalsArray.push({
      cryptoID: world.crypto[i].id,
      name: `${world.crypto[i].shortcode}`,
      image: `https://chisel.gotchiminer.rocks/storage/${world.crypto[i].soil_image}`,
    });
    tempCargoBalance[world.crypto[i].id] = 0;
  }

  const [cargoBalance, setCargoBalance] = useState(tempCargoBalance);

  useEffect(() => {
    //Wait until the player was admitted to the server
    Client.getInstance().phaserGame.events.on("joined_game", () => {
      // CARGO
      Client.getInstance().ownPlayer.cargo.onAdd = (item: CargoEntry) => {
        cargoBalance[item.cryptoID] = item.amount;
        item.onChange = () => {
          cargoBalance[item.cryptoID] = item.amount;
        };
      };
      Client.getInstance().ownPlayer.cargo.onRemove = (item: CargoEntry) => {
        cargoBalance[item.cryptoID] = 0;
      }
    });
  }, []);


  const inventoryCrystal = (tag: string, quantity: number, image: string) => (
    <div className={styles.crystalContainer} key={`inventory${tag}`}>
      <img src={image} className={`${styles.crystalIcon} 
                                   ${ quantity>0 ? styles.itemEnabled : styles.itemDisabled}`} />
      <div className={`${styles.crystalTag}
                       ${ quantity>0 ? styles.itemEnabled : styles.itemDisabled}`}>
        {quantity} x {tag}
      </div>
    </div>
  );

  let cryptoInventoryList = crystalsArray.map(function (crypto) {
    return inventoryCrystal(
      crypto.name,
      cargoBalance[crypto.cryptoID],
      crypto.image
    );
  });

  return (
    <div className={styles.cryptoContainer}>
      <div className={styles.sectionTitle}>CARGO</div>
      <img
        src={cargoIcon}
        className={`${styles.cargoIcon} ${styles.iconSelected}`}
      />
      <div className={styles.cryptoGallery}>{cryptoInventoryList}</div>
    </div>
  );
};

export default Crypto;
