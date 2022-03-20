import styles from "./styles.module.css";
import Client from "matchmaking/Client";
import React, { useEffect, useState } from "react";
import * as Chisel from "chisel-api-interface";
import * as Protocol from "gotchiminer-multiplayer-protocol"
import walletIcon from "assets/hud/wallet_icon.png";
import ggemsIcon from "assets/icons/ggems_icon.svg";
import { WalletEntry } from "matchmaking/Schemas";

interface Props {
  hidden: boolean;
}

const Exchange : React.FC<Props> = ({ hidden }) => {
  type BalanceData = Record<number, number>; // ( cryptoID , quantity }

  const [displayExchange, setDisplayExchange] = useState<boolean>(!hidden);
  const [playerDoekoes, setPlayerDoekoes] = useState<number>(0);
  let tempWalletBalance: BalanceData = [];
  
  // Setting world currency
  const world: Chisel.DetailedWorld | undefined =   Client.getInstance().chiselWorld;
  const worldCurrency = world.crypto.find( i => i.shortcode == 'GHST');
  
  type CryptoArray = { cryptoID: number; name: string; image: string };

  let cryptoArray: CryptoArray[] = [];
  
  // inializing cargo & wallet ballances to 0
  for (let i = 0; i < world.crypto.length; i++) {
    cryptoArray.push({
      cryptoID: world.crypto[i].id,
      name: `${world.crypto[i].shortcode}`,
      image: `https://chisel.gotchiminer.rocks/storage/${world.crypto[i].wallet_image}`,
    });
    tempWalletBalance[world.crypto[i].id] = 0;
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

  const openExchange = () => {
    setDisplayExchange(true);
  }

  const closeExchange = () => {
    setDisplayExchange(false); 
    console.log("closing exchange via ESC")
  }

  const updatePlayerBalance = (quantity:number) =>{
    setPlayerDoekoes(quantity);
  }

  const renderCoinEntry = ( name: string , quantity: number, image: string) => {
    const hasCoins = quantity>0;
    return(
      <div className={`${styles.coinContainer} ${hasCoins? styles.hasCoins : styles.noCoins }`}>
        <img src={image} className={`${styles.exchangeCoin} ${hasCoins? styles.itemEnabled : styles.itemDisabled}`} />
        {quantity} x {name} 
        <button className={`${styles.sellButton} ${hasCoins? styles.enabledButton: styles.disabledButton}`}>SELL</button> 
      </div>
    )
  }

  let cryptoList = cryptoArray.map(function (crypto) {
    return renderCoinEntry( crypto.name, walletBalance[crypto.cryptoID], crypto.image );
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
                <div className={styles.playerDoekoes}>
                  <img src={ggemsIcon} className={styles.ggemsIcon} />
                  {playerDoekoes} x GGEMS
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
