import { useState, useEffect, createContext } from "react";
import { Chat } from "components/Chat";
import GameLeaderboard from "./Leaderboard";
import Vitals from "./Vitals";
import Diagnostics from "./Diagnostics";
import Console from "./Console";
import Exchange from "./Exchange";
import Menu from "./Menu";
import Shop from "./Shop";
import * as Protocol from "gotchiminer-multiplayer-protocol"
import * as Chisel from "chisel-api-interface";
import Client from "matchmaking/Client";
import { ExplosiveEntry } from "matchmaking/Schemas";
import { consumableItem } from "types";
import styles from "./styles.module.css";
import gameEvents from "game/helpers/gameEvents";


// Initializing the contextHook with an empty array of consumable items
let consumablesArray : consumableItem[] = [];

export const HUDContext = createContext(consumablesArray);

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
  let [playerConsumables, setPlayerConsumables] = useState(consumablesArray);
  const [chatMode, setChatMode] = useState<boolean>(false)
  //const [hideChat, setHideChat] = useState<boolean>(largeChat);



  const loadingBar = (value:number) =>{
    return(
        <div className={styles.progressBar} hidden={gameLoaded}>
          <div className={styles.progressValue} style={{width: `${value}%`}}></div>
       </div>
    )
  }



  function handleClick (event:any ) {
    // if the user clicks on the background, all open dialogs are closed
    const divID = event.target.getAttribute('id');
    if (divID === 'game-background'){
      Client.getInstance().phaserGame.events.emit( gameEvents.chat.HIDE);
      Client.getInstance().phaserGame.events.emit( gameEvents.dialogs.HIDE);
    }
  }

  function addExplosive (item: consumableItem){
    playerConsumables.push(item);
    setPlayerConsumables(playerConsumables);
  }

  function updateExplosives (item:ExplosiveEntry) {
    let currentExplosives = [...playerConsumables]; ;
    currentExplosives.forEach( consumable => {
      if (consumable.id === item.explosiveID){
        consumable.quantity = item.amount;
      }
    });
    setPlayerConsumables(currentExplosives);
  }

    // TO DO: loop through all other consumables, potions, etc.
  useEffect(() => {
    const playerExplosiveListeners = () => {
      // INVENTORY EXPLOSIVES
      Client.getInstance().ownPlayer.explosives.onAdd = (item: ExplosiveEntry ) =>{
        const newConsumableItem : consumableItem = {
          name: worldExplosives[item.explosiveID].name,
          id: item.explosiveID,
          image: worldExplosives[item.explosiveID].image,
          type: 'explosive',
          quantity: item.amount
        }
        addExplosive(newConsumableItem);

        item.onChange = () => {
          updateExplosives(item);
        };
      }
      Client.getInstance().ownPlayer.explosives.onRemove = (item: ExplosiveEntry) =>{
        playerConsumables.filter( consumable => consumable.id !== item.explosiveID );
      }
    }
    //Wait until the player was admitted to the server
    Client.getInstance().phaserGame.events.on( gameEvents.room.JOINED, playerExplosiveListeners);

    return () => {
      Client.getInstance().phaserGame.events.off( gameEvents.room.JOINED , playerExplosiveListeners);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Declaring event listeners
  useEffect(() => {
    const openChat = ()=>setChatMode(true);
    const setGameReady = () => {setgameLoaded(true)};
    const disableChatMode = ()=>setChatMode(false);
    const handleLoadingBar = (percentage:number) => setLoadingPercentage(percentage);
    const useShortcut = (index:number) =>{
      if (playerConsumables.length >= index){
        let requestDropExplosive : Protocol.RequestDropExplosive = new Protocol.RequestDropExplosive()
        requestDropExplosive.explosiveID = playerConsumables[index-1].id;
        let serializedMessage : Protocol.Message = Protocol.MessageSerializer.serialize(requestDropExplosive)
        Client.getInstance().colyseusRoom.send(serializedMessage.name, serializedMessage.data)
      }
    }

    Client.getInstance().phaserGame.events.on("shortcut", useShortcut );
    Client.getInstance().phaserGame.events.on("loading", handleLoadingBar );
    Client.getInstance().phaserGame.events.on("mainscene_ready", setGameReady);
    Client.getInstance().phaserGame.events.on( gameEvents.chat.SHOW,openChat);
    Client.getInstance().phaserGame.events.on( gameEvents.chat.HIDE,disableChatMode);

    return () => {
      Client.getInstance().phaserGame.events.off("shortcut", useShortcut );
      Client.getInstance().phaserGame.events.off("loading", handleLoadingBar );
      Client.getInstance().phaserGame.events.off("mainscene_ready", setGameReady);
      Client.getInstance().phaserGame.events.off(gameEvents.chat.SHOW,openChat);
      Client.getInstance().phaserGame.events.off(gameEvents.chat.HIDE,disableChatMode);
    }

  }, [playerConsumables]);


  return (
    <>
      <div className={`${styles.loadingScene} ${gameLoaded? styles.hidden : styles.reveal }`} >
        {loadingBar(loadingPercentage)}
      </div>
      <div className={`${styles.hudContainer} ${!gameLoaded? styles.hidden : styles.reveal }`} 
           onClick={e => handleClick(e)}
           id="game-background"
           hidden={!gameLoaded}>
        <HUDContext.Provider value={playerConsumables}>
          <Vitals />
          <Console />
          <Chat disabled={!chatMode} gameMode={true} />
          <Shop />
          <Exchange hidden={true} />
          <Menu />
          <GameLeaderboard hidden={true} />
          <Diagnostics hidden={true} />
        </HUDContext.Provider>
      </div> 
    </>
  );
};
