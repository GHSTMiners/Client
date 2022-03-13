import styles from "./styles.module.css";
import SquareButton from "components/SquareButton";
import { useEffect, useState } from "react";
import Client from "matchmaking/Client";
import { ExplosiveEntry } from "matchmaking/Schemas";
import * as Chisel from "chisel-api-interface";

const Consumables = () => {
  
  interface consumableItem {
    name: string, 
    id:number, 
    image:string, 
    type: string,
    quantity: number
  }

  //type consumableItem = { name: string; id:number; image:string; type: string }
  type inventoryExplosives = Record< number, consumableItem>; // ( explosiveID , quantity }
  type playerRecord = Record<number, number>; // ( ID , quantity }
  
  const smallButton = "3.3rem";
  
  const world: Chisel.DetailedWorld | undefined =   Client.getInstance().chiselWorld;
  
  let worldExplosives: inventoryExplosives = {};
  let explosivesRecord: playerRecord = [];
  let playerConsumables : consumableItem[] = [];
  let emptyArray : any[] = [];

  // extracting info from Chisel about all possible explosives
  world.explosives.forEach((explosive)=>{
    let newItem : consumableItem = { 
      name: explosive.name,
      id: explosive.id,
      image: `https://chisel.gotchiminer.rocks/storage/${explosive.drop_image}`,
      type: 'explosive',
      quantity: 0    
    };
    worldExplosives[explosive.id] = newItem;
    explosivesRecord[explosive.id] = 0;
  })

  const [playerExplosives, setPlayerExplosives] = useState(explosivesRecord);
  
  const [myPlayerConsumables, setMyPlayerConsumables] = useState(playerConsumables);

  let itemList = [];
  //const [itemList , setItemList] = useState(emptyArray);

  // TO DO: loop through all other consumables, potions, etc.

  useEffect(() => {
    //Wait until the player was admitted to the server
    Client.getInstance().phaserGame.events.on("joined_game", () => {
      // INVENTORY EXPLOSIVES
      Client.getInstance().ownPlayer.explosives.onAdd = (item: ExplosiveEntry ) =>{
        let newConsumableItem : consumableItem = {
          name: worldExplosives[item.explosiveID].name,
          id: item.explosiveID,
          image: worldExplosives[item.explosiveID].image,
          type: 'explosive',
          quantity: item.amount
        }
        myPlayerConsumables.push(newConsumableItem);

        console.log('Player purchased a new explosive!')
        item.onChange = () => {
          myPlayerConsumables.forEach( consumable => {
            if (consumable.id ==item.explosiveID){
              consumable.quantity = item.amount;
            }
          })
        };
      }
      Client.getInstance().ownPlayer.explosives.onRemove = (item: ExplosiveEntry) =>{
        myPlayerConsumables.filter( consumable => consumable.id !== item.explosiveID );
      }
    });
  }, []);

  // rendering function for each consumable  slot 
  const renderConsumable = (index:number) =>{
    const isFilled = (myPlayerConsumables.length >= index);
    return (
    <SquareButton size={smallButton} 
                  quantitiy={ isFilled ? myPlayerConsumables[index-1].quantity : 0 }
                  disabled={ isFilled ? false : true}>
      <div className={styles.inventoryConsumable}>
        <img src={ isFilled ? myPlayerConsumables[index-1].image : ''} />
      </div>
    </SquareButton>
    );
  }
  
  // rendering the initial consumables slots
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
