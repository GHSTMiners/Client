import styles from "./styles.module.css";
import Client from "matchmaking/Client";
import React, { useEffect, useState } from "react";
import * as Chisel from "chisel-api-interface";
import * as Protocol from "gotchiminer-multiplayer-protocol"
import walletIcon from "assets/hud/wallet_icon.png";
import ggemsIcon from "assets/icons/ggems_icon.svg";
import { WalletEntry } from "matchmaking/Schemas";
import MainScene from "game/Scenes/MainScene";
import * as Schema from "../../matchmaking/Schemas"

interface Props {
  hidden: boolean;
}

const Exchange : React.FC<Props> = ({ hidden }) => {
  type BalanceData = Record<number, number>; // ( cryptoID , quantity }

  const [displayExchange, setDisplayExchange] = useState<boolean>(!hidden);
  const [playerBalance, setPlayerBalance] = useState<number>(0);
  let tempWalletBalance: BalanceData = [];
  
  // Setting world currency
  const schema: Schema.World = Client.getInstance().colyseusRoom.state;
  const world: Chisel.DetailedWorld | undefined =   Client.getInstance().chiselWorld;
  const worldCurrency = world.crypto.find( i => i.shortcode == 'DAI');
  
  type CryptoObj = { cryptoID: number; name: string; image: string ; price:number};

  let cryptoIdArray: number[] = [];
  let cryptoRecord : Record<number,CryptoObj> = [];
  
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
  }
  
  const [walletBalance, setWalletBalance] = useState(tempWalletBalance);

  useEffect(() => {
    //Wait until the player was admitted to the server
    Client.getInstance().phaserGame.events.on("joined_game", () => {
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
    });
  }, []);

  
  const sellCrypto = (cryptoID : number, amount: number) => {
    console.log(`Selling ${amount} X cryptoID ${cryptoID}`)
    if (worldCurrency){
      let message : Protocol.ExchangeCrypto = new Protocol.ExchangeCrypto();
      message.sourceCryptoId = cryptoID;
      message.targetCryptoId = worldCurrency?.id;
      message.amount = amount;
      let serializedMessage : Protocol.Message = Protocol.MessageSerializer.serialize(message)
      Client.getInstance().colyseusRoom.send(serializedMessage.name, serializedMessage.data)
    }
  };
  

  const openExchange = () => {
    setDisplayExchange(true);
  }

  const closeExchange = () => {
    setDisplayExchange(false); 
    console.log("closing exchange via ESC")
  }

  const updatePlayerBalance = (quantity:number) =>{
    setPlayerBalance(quantity);
  }

  const renderCoinEntry = ( id: number ) => {
    const quantity = walletBalance[id];
    const hasCoins = quantity>0;
    return(
      <div className={styles.coinContainer}>
        <img src={cryptoRecord[id].image}  className={`${styles.exchangeCoin} ${hasCoins? styles.itemEnabled : styles.itemDisabled}`} />
        <div className={`${styles.exchangeRowText} ${hasCoins? styles.hasCoins : styles.noCoins }`}>
          <div  className={styles.ggemsValue}>{cryptoRecord[id].price*quantity} GGMS</div>
          <div className={styles.tokenValue}>{quantity} x {cryptoRecord[id].name}</div>
        </div>
        <button className={`${styles.sellButton} ${hasCoins? styles.enabledButton: styles.disabledButton}`}
                onClick={ () => sellCrypto(id,quantity) } > SELL </button> 
      </div>
    )
  }

  let cryptoList = cryptoIdArray.map(function (id) {
    return renderCoinEntry( id );
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
              <div className={styles.exchangeHeader}>
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
    </>
  );
};

export default Exchange;
