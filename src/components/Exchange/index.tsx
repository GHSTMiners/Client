import styles from "./styles.module.css";
import Client from "matchmaking/Client";
import React, { useEffect, useState } from "react";
import * as Chisel from "chisel-api-interface";
import * as Protocol from "gotchiminer-multiplayer-protocol"
import ggemsIcon from "assets/icons/ggems_icon.svg";
import { WalletEntry } from "matchmaking/Schemas";
import * as Schema from "../../matchmaking/Schemas"
import { IndexedArray } from "types";

interface Props {
  hidden: boolean;
}

const Exchange : React.FC<Props> = ({ hidden }) => {
  type CryptoObj = { cryptoID: number; name: string; image: string ; price:number};
  type IndexedCrypto =  {[key: string]: CryptoObj} ;

  const [displayExchange, setDisplayExchange] = useState<boolean>(!hidden);
  const [playerBalance, setPlayerBalance] = useState<number>(0);
  const [walletBalance, setWalletBalance] = useState<IndexedArray>({});
  const [cryptoRecord, setCryptoRecord] = useState<IndexedCrypto>({});
  const [inputValues , setInputValues] = useState<IndexedArray>({});

  // Setting world currency
  const schema: Schema.World = Client.getInstance().colyseusRoom.state;
  const world: Chisel.DetailedWorld | undefined =   Client.getInstance().chiselWorld;

  // inializing cargo & wallet ballances to 0 and fetching the list of crypto from Chisel
  useEffect(()=>{
    for (let i = 0; i < world.crypto.length; i++) {
      const cryptoPrice = schema.exchange.get(world.crypto[i].id.toString());
      const id = world.crypto[i].id;
      const newCrypto = {
        cryptoID: id,
        name: `${world.crypto[i].shortcode}`,
        image: `https://chisel.gotchiminer.rocks/storage/${world.crypto[i].wallet_image}`,
        price: (cryptoPrice? cryptoPrice.usd_value : 1)
      }
      updateWalletBalance(id,0);
      updateCryptoRecord(id,newCrypto);
    }
  },[])
  
  useEffect(() => {
    Client.getInstance().phaserGame.events.on("open_exchange", openExchange );
    Client.getInstance().phaserGame.events.on("close_dialogs", closeExchange);
    //Wait until the player was admitted to the server
    Client.getInstance().phaserGame.events.on("joined_game", () => {
      // WALLET
      Client.getInstance().ownPlayer.wallet.onAdd = (item: WalletEntry) => {
        updateWalletBalance(item.cryptoID,item.amount);
        Client.getInstance().phaserGame.events.emit("added crypto", item.cryptoID, item.amount);
        item.onChange = () => {
          updateWalletBalance(item.cryptoID,item.amount);
          Client.getInstance().phaserGame.events.emit("updated wallet", item.cryptoID, item.amount);
          if (world.world_crypto_id === item.cryptoID) {
            Client.getInstance().phaserGame.events.emit("updated balance",item.amount);
          }
        };
      };
      // Update balance
      Client.getInstance().phaserGame.events.on("updated balance", updatePlayerBalance )
    });
  }, []);

  const sellCrypto = (cryptoID : number, amount: number) => {
    let message : Protocol.ExchangeCrypto = new Protocol.ExchangeCrypto();
    message.sourceCryptoId = cryptoID;
    message.targetCryptoId = world.world_crypto_id;
    message.amount = amount;
    let serializedMessage : Protocol.Message = Protocol.MessageSerializer.serialize(message);
    Client.getInstance().colyseusRoom.send(serializedMessage.name, serializedMessage.data);
  };
  
  const openExchange = () => {
    setInputValues({...walletBalance})
    setDisplayExchange(true);
  }

  const closeExchange = () => {
    setDisplayExchange(false); 
  }
  
  function updateWalletBalance (id:number, value:number){
    walletBalance[id]= value;
    setWalletBalance({...walletBalance});
    setInputValues({...walletBalance});
  }

  function updateCryptoRecord (id:number, entry:CryptoObj){
    cryptoRecord[id]= entry;
    setCryptoRecord({...cryptoRecord});
  }
  const updatePlayerBalance = (quantity:number) =>{
    setPlayerBalance(Math.round(quantity*10)/10);
    setInputValues({...walletBalance});
  }

  const handleInputChange = ( event : React.ChangeEvent<HTMLInputElement>, id:number ) => {
    if (+event.target.value>=0 && +event.target.value<=walletBalance[id] ){
      inputValues[id] = +event.target.value;
      let newValues = {...inputValues};
      setInputValues(newValues);
    }
  } 

  const renderCoinEntry = ( id: number ) => {
    const quantity = walletBalance[id];
    const hasCoins = quantity>0;
    const inputTokens = inputValues[id];
    return(
      <div className={styles.coinContainer} key={`coinEntry${id}`}>
        <img src={cryptoRecord[id].image}  alt={cryptoRecord[id].name} className={`${styles.exchangeCoin} ${hasCoins? styles.itemEnabled : styles.itemDisabled}`} />
        <div className={`${styles.coinRowContainer} ${hasCoins? styles.hasCoins : styles.noCoins }`}>
          <div className={styles.exchangeRowText}>
            <div className={styles.tokenValue}>{quantity} x {cryptoRecord[id].name}</div>
            <div  className={styles.ggemsValue}>{Math.round(cryptoRecord[id].price*quantity*10)/10} GGEMS</div>
          </div>
          <input className={`${styles.inputQuantity} ${inputValues[id]>0? '': styles.emptyInput }`} 
                 type="number" 
                 value={inputTokens} 
                 onChange={(e)=>{handleInputChange(e,id)}
                 }/>
        </div>
        
        <button className={`${styles.sellButton} ${hasCoins? styles.enabledButton: styles.disabledButton}`}
                onClick={ () => sellCrypto(id,inputTokens) } > SELL </button> 
      </div>
    )
  }

  // List of coins to be displayed in the UI
  const cryptoIds = Object.keys(cryptoRecord)
  let cryptoList = cryptoIds.map(function (id) {
    return +id===world.world_crypto_id ? '' : renderCoinEntry( +id );
  });

  return (
    <>
      <div  id="exchange" 
            className={`${styles.exchangeContainer}
                       ${displayExchange? styles.displayOn:styles.displayOff }`}>
          <div>
            <div className={styles.exchangeDisplayContainer}>
              <div className={styles.exchangeHeader} key={'exchangeHeader'}>
                <h2>WALLET</h2>
                <div className={styles.playerBalance}>
                  <img src={ggemsIcon} className={styles.ggemsIcon} alt={'GGEMS'}/>
                  {playerBalance} x GGEMS
                </div>
                <button className={styles.closeButton} onClick={closeExchange}>X</button>
              </div>
              <div className={styles.coinList}> 
                {cryptoList} 
              </div>
            </div>
          </div>
      </div>
    </>
  );
};

export default Exchange;
