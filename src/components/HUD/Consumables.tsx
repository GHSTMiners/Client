import styles from "./styles.module.css";
import SquareButton from "components/SquareButton";
import { useEffect } from "react";
import Client from "matchmaking/Client";
import { ExplosiveEntry } from "matchmaking/Schemas";
import * as Chisel from "chisel-api-interface";

const Consumables = () => {
  type inventoryExplosives = Record<number, number>; // ( explosiveID , quantity }
  type consumableItem = { name: string; id:number; quantity: number; image:string; type: string }
  
  const smallButton = "3.3rem";
  const itemList = [];
  const world: Chisel.DetailedWorld | undefined =   Client.getInstance().chiselWorld;
  
  let worldExplosives: consumableItem[] = [];
  let playerExplosives: inventoryExplosives = [];
  let playerConsumables : consumableItem[] = [];
  

  // extracting info from Chisel about all possible explosives
  world.explosives.forEach((explosive)=>{
   worldExplosives.push({ 
     name: explosive.name,
     id: explosive.id,
     quantity: 0, 
     image: `https://chisel.gotchiminer.rocks/storage/${explosive.drop_image}`,
     type: 'explosive'        
   })
  })

  useEffect(() => {
    //Wait until the player was admitted to the server
    Client.getInstance().phaserGame.events.on("joined_game", () => {
      // INVENTORY EXPLOSIVES
      Client.getInstance().ownPlayer.explosives.onAdd = (item: ExplosiveEntry ) =>{
        playerExplosives[item.explosiveID] = item.amount;
        // item onCHANGE
        item.onChange = () => {
          playerExplosives[item.explosiveID] = item.amount;
        };
      }
    });
  }, []);


  const inventoryExplosive= (tag: string, quantity: number, image: string) => (
    <div className={styles.crystalContainer}>
      <img src={image} className={`${styles.crystalIcon} 
                                   ${ quantity>0 ? styles.crystalEnabled : styles.crystalDisabled}`} />
      <div className={`${styles.crystalTag}
                       ${ quantity>0 ? styles.crystalEnabled : styles.crystalDisabled}`}>
        {quantity} x {tag}
      </div>
    </div>
  );

  /*
  const renderConsumable = (item: consumable) =>{
    <div className={styles.inventoryConsumable}>
      
    </div>
  }*/

  for (let i = 1; i < 9; i++) {
    itemList.push(<SquareButton size={smallButton}>ITEM {i}</SquareButton>);
    //playerConsumables.push({ name: '', quantity: 0 , type: [] });
  }



  return (
    <div className={styles.consumablesContainer}>
      <div className={styles.sectionTitle}>CONSUMABLES</div>
      <div className={styles.consumableItems}>{itemList}</div>
    </div>
  );
};

export default Consumables;
