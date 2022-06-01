import styles from "./styles.module.css";
import Client from "matchmaking/Client";
import React, { useEffect, useState } from "react";
import * as Chisel from "chisel-api-interface";
import * as Protocol from "gotchiminer-multiplayer-protocol"
import walletIcon from "assets/hud/wallet_icon.png";
import ggemsIcon from "assets/icons/ggems_icon.svg";
import { WalletEntry } from "matchmaking/Schemas";
import * as Schema from "../../matchmaking/Schemas"

interface Props {
  hidden: boolean;
}

const Exchange : React.FC<Props> = ({ hidden }) => {
  type BalanceData = Record<number, number>; // ( cryptoID , quantity }

  const [displayExchange, setDisplayExchange] = useState<boolean>(!hidden);
  const [playerBalance, setPlayerBalance] = useState<number>(0);
  const [tokenQuantity, setTokenQuantity] = useState<number>(0);
  let tempWalletBalance: BalanceData = [];

  // Setting world currency
  const schema: Schema.World = Client.getInstance().colyseusRoom.state;
  const world: Chisel.DetailedWorld | undefined =   Client.getInstance().chiselWorld;
  
  type CryptoObj = { cryptoID: number; name: string; image: string ; price:number};

  let cryptoIdArray: number[] = [];
  let cryptoRecord : Record<number,CryptoObj> = [];
  const initialInputValues : Record<number,number> = [];
  
  // inializing cargo & wallet ballances to 0
  for (let i = 0; i < world.crypto.length; i++) {
    const cryptoPrice = schema.exchange.get(world.crypto[i].id.toString());
    const newCrypto = {
      cryptoID: world.crypto[i].id,
      name: `${world.crypto[i].shortcode}`,
      image: `https://chisel.gotchiminer.rocks/storage/${world.crypto[i].wallet_image}`,
      price: (cryptoPrice? cryptoPrice.usd_value : 1)
    }
    cryptoIdArray.push( world.crypto[i].id );
    tempWalletBalance[world.crypto[i].id] = 0;
    cryptoRecord[world.crypto[i].id] = newCrypto;
    initialInputValues[world.crypto[i].id] = 0;
  }
  
  const [inputValues , setInputValues] = useState({...initialInputValues});
  const [walletBalance, setWalletBalance] = useState(tempWalletBalance);

  useEffect(() => {
    //Wait until the player was admitted to the server
    Client.getInstance().phaserGame.events.on("joined_game", () => {
      // WALLET
      Client.getInstance().ownPlayer.wallet.onAdd = (item: WalletEntry) => {
        walletBalance[item.cryptoID] = item.amount;
        Client.getInstance().phaserGame.events.emit("added crypto", item.cryptoID, item.amount);
        item.onChange = () => {
          walletBalance[item.cryptoID] = item.amount;
          Client.getInstance().phaserGame.events.emit("updated wallet", item.cryptoID, item.amount);
          if (world.world_crypto_id === item.cryptoID) {
            Client.getInstance().phaserGame.events.emit("updated balance",item.amount);
          }
        };
      };
    });
  }, []);

  
  const sellCrypto = (cryptoID : number, amount: number) => {
    let message : Protocol.ExchangeCrypto = new Protocol.ExchangeCrypto();
    message.sourceCryptoId = cryptoID;
    message.targetCryptoId = world.world_crypto_id;
    message.amount = amount;
    let serializedMessage : Protocol.Message = Protocol.MessageSerializer.serialize(message)
    Client.getInstance().colyseusRoom.send(serializedMessage.name, serializedMessage.data)
  };
  

  const openExchange = () => {
    setDisplayExchange(true);
  }

  const closeExchange = () => {
    setInputValues(initialInputValues);
    setDisplayExchange(false); 
  }

  const updatePlayerBalance = (quantity:number) =>{
    setPlayerBalance(Math.round(quantity*10)/10);
  }

  const handleInputChange = ( event : React.ChangeEvent<HTMLInputElement>, id:number ) => {
    if (+event.target.value>=0){
      inputValues[id] = +event.target.value;
      let newValues = {...inputValues};
      setInputValues(newValues);
    }
 } 

  const renderCoinEntry = ( id: number ) => {
    const quantity = walletBalance[id];
    const hasCoins = quantity>0;
    return(
      <div className={styles.coinContainer} key={`coinEntry${id}`}>
        <img src={cryptoRecord[id].image}  className={`${styles.exchangeCoin} ${hasCoins? styles.itemEnabled : styles.itemDisabled}`} />
        <div className={`${styles.coinRowContainer} ${hasCoins? styles.hasCoins : styles.noCoins }`}>
          <div className={styles.exchangeRowText}>
            <div  className={styles.ggemsValue}>{cryptoRecord[id].price*quantity} GGEMS</div>
            <div className={styles.tokenValue}>{quantity} x {cryptoRecord[id].name}</div>
          </div>
          <input className={`${styles.inputQuantity} ${inputValues[id]>0? '': styles.emptyInput }`} 
                 type="number" 
                 value={inputValues[id]} 
                 onChange={(e)=>{handleInputChange(e,id)}
                 }/>
        </div>
        
        <button className={`${styles.sellButton} ${hasCoins? styles.enabledButton: styles.disabledButton}`}
                onClick={ () => sellCrypto(id,inputValues[id]) } > SELL </button> 
      </div>
    )
  }

  let cryptoList = cryptoIdArray.map(function (id) {
    return id===world.world_crypto_id ? '' : renderCoinEntry( id );
  });

  useEffect( () => {
    Client.getInstance().phaserGame.events.on("open_exchange", openExchange );
    Client.getInstance().phaserGame.events.on("close_dialogs", closeExchange);
    Client.getInstance().phaserGame.events.on("joined_game", () => {
      Client.getInstance().phaserGame.events.on("updated balance", updatePlayerBalance )
    });
  },[]);

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
                  <img src={ggemsIcon} className={styles.ggemsIcon} />
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
      <img src={walletIcon}
          className={`${styles.walletIcon} ${
            displayExchange ? styles.iconSelected : styles.iconDeselected
          }`}
          onClick={ () => setDisplayExchange(!displayExchange) }
        />
      <div className={styles.mainPlayerBalance}
            onClick={ () => setDisplayExchange(!displayExchange) }>
        <img src={ggemsIcon} className={styles.ggemsIcon} />
        {playerBalance}
      </div>
    </>
  );
};

export default Exchange;
