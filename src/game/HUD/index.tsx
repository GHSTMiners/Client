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
import { ConsumableItem, InventoryExplosives, PlayerContext } from "types";
import styles from "./styles.module.css";
import gameEvents from "game/helpers/gameEvents";
import usePlayerCrypto from "hooks/usePlayerCrypto";
import useWorldCrypto from "hooks/useWorldCrypto";


// Initializing the contextHook with an empty array of consumable items

export const HUDContext = createContext<PlayerContext>({consumables: [], wallet: {}});

export const HUD = () => {  

  // extracting info from Chisel about all possible explosives
  const world: Chisel.DetailedWorld | undefined =   Client.getInstance().chiselWorld;
  let worldExplosives: InventoryExplosives = {};
  world.explosives.forEach((explosive)=>{
    let newItem : ConsumableItem = { 
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
  let [playerConsumables, setPlayerConsumables] = useState<ConsumableItem[]>([]);
  const [chatMode, setChatMode] = useState<boolean>(false)
  
  const [cryptoRecord] = useWorldCrypto();
  const {walletBalance, setWalletBalance} = usePlayerCrypto();
  useEffect(()=>{
    (Object.keys(cryptoRecord)).forEach((id)=> setWalletBalance( s => {s[+id]=0; return s}) )
    // eslint-disable-next-line react-hooks/exhaustive-deps
  },[cryptoRecord])

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

  function addExplosive (item: ConsumableItem){
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
        const newConsumableItem : ConsumableItem = {
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

    Client.getInstance().phaserGame.events.on( gameEvents.console.SHORTCUT, useShortcut );
    Client.getInstance().phaserGame.events.on( gameEvents.phaser.LOADING, handleLoadingBar );
    Client.getInstance().phaserGame.events.on( gameEvents.phaser.MAINSCENE, setGameReady);
    Client.getInstance().phaserGame.events.on( gameEvents.chat.SHOW,openChat);
    Client.getInstance().phaserGame.events.on( gameEvents.chat.HIDE,disableChatMode);

    return () => {
      Client.getInstance().phaserGame.events.off(gameEvents.console.SHORTCUT, useShortcut );
      Client.getInstance().phaserGame.events.off(gameEvents.phaser.LOADING, handleLoadingBar );
      Client.getInstance().phaserGame.events.off(gameEvents.phaser.MAINSCENE, setGameReady);
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
        <HUDContext.Provider value={{consumables:playerConsumables,wallet:walletBalance}}>
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
