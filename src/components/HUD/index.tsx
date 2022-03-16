import styles from "./styles.module.css";
import Client from "matchmaking/Client";
import { useState, useEffect, createContext } from "react";
import VitalsConsole from "./VitalsConsole";
import MainConsole from "./MainConsole";
import MiningShop from "../MiningShop";
import * as Chisel from "chisel-api-interface";
import { ExplosiveEntry } from "matchmaking/Schemas";
import * as Protocol from "gotchiminer-multiplayer-protocol"
import Chat from "components/Chat";

// Initializing the contextHook with an empty array of consumable items
type consumableItem = { name: string, id:number, image:string, type: string, quantity: number}
let consumablesArray : consumableItem[] = [];
export const HUDContext = createContext(consumablesArray);
export const smallButton = "3.3rem";

export const HUD = () => {  

  type inventoryExplosives = Record< number, consumableItem>; // ( explosiveID , quantity }

  // extracting info from Chisel about all possible explosives
  const world: Chisel.DetailedWorld | undefined =   Client.getInstance().chiselWorld;
  let worldExplosives: inventoryExplosives = {};
  world.explosives.forEach((explosive)=>{
    let newItem : consumableItem = { 
      name: explosive.name,
      id: explosive.id,
      image: `https://chisel.gotchiminer.rocks/storage/${explosive.drop_image}`,
      type: 'explosive',
      quantity: 0    
    };
    worldExplosives[explosive.id] = newItem;
  })
  
  const [gameLoaded, setgameLoaded] = useState(false);
  const [loadingPercentage, setLoadingPercentage] = useState<number>(0);
  const [playerConsumables, setPlayerConsumables] = useState(consumablesArray);
  //const [hideChat, setHideChat] = useState<boolean>(largeChat);

  const handleLoadingBar = (percentage:number) => {
    setLoadingPercentage(percentage)
  }

  const loadingBar = (value:number) =>{
    return(
        <div className={styles.progressBar} hidden={gameLoaded}>
          <div className={styles.progressValue} style={{width: `${value}%`}}></div>
       </div>
    )
  }

  const useShortcut = (index:number) =>{
    console.log(playerConsumables)
    if (playerConsumables.length >= index){
      let requestDropExplosive : Protocol.RequestDropExplosive = new Protocol.RequestDropExplosive()
      requestDropExplosive.explosiveID = playerConsumables[index-1].id;
      let serializedMessage : Protocol.Message = Protocol.MessageSerializer.serialize(requestDropExplosive)
      Client.getInstance().colyseusRoom.send(serializedMessage.name, serializedMessage.data) 
    }
  }

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
        
        // the React Hook doesn't update the array size, therefore push is required TO DO: fix it properly
        setPlayerConsumables( playerConsumables.concat(newConsumableItem) );
        playerConsumables.push(newConsumableItem);

        item.onChange = () => {
          playerConsumables.forEach( consumable => {
            if (consumable.id ==item.explosiveID){
              consumable.quantity = item.amount;
            }
          })
        };
      }
      Client.getInstance().ownPlayer.explosives.onRemove = (item: ExplosiveEntry) =>{
        playerConsumables.filter( consumable => consumable.id !== item.explosiveID );
      }
    });

    Client.getInstance().phaserGame.events.on("shortcut", useShortcut );
    Client.getInstance().phaserGame.events.on("loading", handleLoadingBar );
    Client.getInstance().phaserGame.events.on("mainscene_ready", () => {setgameLoaded(true)});
  }, []);


  return (
    <>
      <div className={`${styles.loadingScene} ${gameLoaded? styles.hidden : styles.reveal }`} >
        {loadingBar(loadingPercentage)}
      </div>
      <div className={`${styles.hudContainer} ${!gameLoaded? styles.hidden : styles.reveal }`} hidden={!gameLoaded}>
      <HUDContext.Provider value={playerConsumables}>
        <VitalsConsole />
        <MainConsole />
        <Chat disabled={true} />
        <MiningShop />
        </HUDContext.Provider>
      </div> 
    </>
  );
};
