import * as Chisel from "chisel-api-interface";
import Client from "matchmaking/Client";
import styles from "./styles.module.css";
import cargoIcon from "assets/hud/cargo_icon.svg";
import { useEffect, useState } from "react";
import { CargoEntry } from "matchmaking/Schemas";
import { IndexedArray } from "types";
import gameEvents from "game/helpers/gameEvents";

const Crypto = () => {  
  type CryptoArray = { cryptoID: number; name: string; image: string };
  
  
  let crystalsArray: CryptoArray[] = [];
  const world: Chisel.DetailedWorld | undefined =   Client.getInstance().chiselWorld;
  const [cargoBalance, setCargoBalance] = useState<IndexedArray>({});
  const [cryptoCrystals, setCrytoCrystals] = useState<CryptoArray[]>([]);

  function updateCargoBalance ( id:number , value:number ) {
    // updating/adding array
    cargoBalance[id]=value;
    // refreshing the UI
    setCargoBalance({...cargoBalance});
  }  

  // inializing cargo & wallet ballances to 0 and fetching images from Chisel
  useEffect(()=>{
    for (let i = 0; i < world.crypto.length; i++) {
      if (world.crypto[i].shortcode!=='GGEMS'){
        crystalsArray.push({
          cryptoID: world.crypto[i].id,
          name: `${world.crypto[i].shortcode}`,
          image: `https://chisel.gotchiminer.rocks/storage/${world.crypto[i].soil_image}`,
        });
        updateCargoBalance(world.crypto[i].id,0);
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  },[])



  useEffect(() => {
    const addCargoListeners = () =>{
      //Define cargo after fetching from Chisel on mount
      setCrytoCrystals(crystalsArray)
      // CARGO
      Client.getInstance().ownPlayer.cargo.onAdd = (item: CargoEntry) => {
        updateCargoBalance(item.cryptoID,item.amount);
        item.onChange = () => {
          updateCargoBalance(item.cryptoID,item.amount);
        };
      };
      Client.getInstance().ownPlayer.cargo.onRemove = (item: CargoEntry) => {
        updateCargoBalance(item.cryptoID,0);
      }
    }

    //Wait until the player was admitted to the server
    Client.getInstance().phaserGame.events.on( gameEvents.room.JOINED , addCargoListeners )

    return () =>{
      Client.getInstance().phaserGame.events.off( gameEvents.room.JOINED, addCargoListeners)
    }

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const inventoryCrystal = (tag: string, quantity: number, image: string) => (
    <div className={styles.crystalContainer} key={`inventory${tag}`}>
      <img src={image} className={`${styles.crystalIcon} 
                                   ${ quantity>0 ? styles.itemEnabled : styles.itemDisabled}`} 
            alt={tag}/>
      <div className={`${styles.crystalTag}
                       ${ quantity>0 ? styles.itemEnabled : styles.itemDisabled}`}>
        {quantity} x {tag}
      </div>
    </div>
  );

  return (
    <div className={styles.cryptoContainer}>
      <div className={styles.sectionTitle}>CARGO</div>
      <img
        src={cargoIcon}
        className={`${styles.cargoIcon} ${styles.iconSelected}`}
        alt={'Cargo'}
      />
      <div className={styles.cryptoGallery}>
        {cryptoCrystals.map(function (crypto) {
          return inventoryCrystal(
            crypto.name,
            cargoBalance[crypto.cryptoID],
            crypto.image)
          })}
      </div>
    </div>
  );
};

export default Crypto;
