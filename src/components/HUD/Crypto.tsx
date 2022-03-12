import * as Chisel from "chisel-api-interface";
import Client from "matchmaking/Client";
import styles from "./styles.module.css";
import cargoIcon from "assets/hud/cargo_icon.svg";
import walletIcon from "assets/hud/wallet_icon.png";
import { useContext, useEffect, useState } from "react";
import { CargoEntry, ExplosiveEntry, WalletEntry } from "matchmaking/Schemas";
import VitalsConsole from "./VitalsConsole";
import Explosive from "game/World/Explosive";

const Crypto = () => {
  //prettier-ignore
  const world: Chisel.DetailedWorld | undefined =   Client.getInstance().chiselWorld;
  const [walletOn, setWalletOn] = useState(false);
  const [aboveGround, setAboveGround] = useState(false); // TODO: implement automatic switch
  const [playerY,setPlayerY] = useState(0);

  type CryptoArray = { cryptoID: number; name: string; image: string };
  type BalanceData = Record<number, number>; // ( cryptoID , quantity }

  let crystalsArray: CryptoArray[] = [];
  let tempCargoBalance: BalanceData = [];
  let tempWalletBalance: BalanceData = [];

  // inializing cargo & wallet ballances to 0
  for (let i = 0; i < world.crypto.length; i++) {
    crystalsArray.push({
      cryptoID: world.crypto[i].id,
      name: `${world.crypto[i].shortcode}`,
      image: `https://chisel.gotchiminer.rocks/storage/${world.crypto[i].soil_image}`,
    });
    tempCargoBalance[world.crypto[i].id] = 0;
    tempWalletBalance[world.crypto[i].id] = 0;
  }

  // Setting world currency
  const worldCurrency = world.crypto.find( i => i.shortcode == 'GHST');

  const [cargoBalance, setCargoBalance] = useState(tempCargoBalance);
  const [walletBalance, setWalletBalance] = useState(tempWalletBalance);

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
      // WALLET
      Client.getInstance().ownPlayer.wallet.onAdd = (item: WalletEntry) => {
        walletBalance[item.cryptoID] = item.amount;
        item.onChange = () => {
          walletBalance[item.cryptoID] = item.amount;
          if (worldCurrency?.id == item.cryptoID) {
            Client.getInstance().phaserGame.events.emit("updated balance",item.amount);
          }
        };
      };

    // Updating pre-defined choice for displaying either wallet or cargo (TO DO)
    //setPlayerY(Client.getInstance().ownPlayer.playerState.y);  
    aboveGround ? setWalletOn(true) : setWalletOn(false);
    });
  }, []);


  const inventoryCrystal = (tag: string, quantity: number, image: string) => (
    <div className={styles.crystalContainer}>
      <img src={image} className={`${styles.crystalIcon} 
                                   ${ quantity>0 ? styles.crystalEnabled : styles.crystalDisabled}`} />
      <div className={`${styles.crystalTag}
                       ${ quantity>0 ? styles.crystalEnabled : styles.crystalDisabled}`}>
        {quantity} x {tag}
      </div>
    </div>
  );

  let cryptoInventoryList = crystalsArray.map(function (crypto) {
    return inventoryCrystal(
      crypto.name,
      walletOn ? walletBalance[crypto.cryptoID] : cargoBalance[crypto.cryptoID],
      crypto.image
    );
  });

  return (
    <div className={styles.cryptoContainer}>
      <div className={styles.sectionTitle}>CRYPTO</div>
      <img
        src={cargoIcon}
        className={`${styles.cargoIcon} ${
          walletOn ? styles.iconDeselected : styles.iconSelected
        }`}
        onClick={() => {
          setWalletOn(false);
        }}
      />
      <img
        src={walletIcon}
        className={`${styles.walletIcon} ${
          walletOn ? styles.iconSelected : styles.iconDeselected
        }`}
        onClick={() => {
          setWalletOn(true);
        }}
      />
      <div className={styles.cryptoGallery}>{cryptoInventoryList}</div>
    </div>
  );
};

export default Crypto;
