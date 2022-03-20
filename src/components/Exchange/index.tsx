import styles from "./styles.module.css";
import Client from "matchmaking/Client";
import React, { useEffect, useState } from "react";
import * as Chisel from "chisel-api-interface";
import * as Protocol from "gotchiminer-multiplayer-protocol"

interface Props {
  hidden: boolean;
}

const Exchange : React.FC<Props> = ({ hidden }) => {
 
  const world: Chisel.DetailedWorld | undefined =   Client.getInstance().chiselWorld;
  const [displayExchange, setDisplayExchange] = useState<boolean>(!hidden);
  const [playerDoekoes, setPlayerDoekoes] = useState<number>(0);
  
  type CryptoArray = { cryptoID: number; name: string; image: string };

  let cryptoArray: CryptoArray[] = [];
  
  // inializing cargo & wallet ballances to 0
  for (let i = 0; i < world.crypto.length; i++) {
    cryptoArray.push({
      cryptoID: world.crypto[i].id,
      name: `${world.crypto[i].shortcode}`,
      image: `https://chisel.gotchiminer.rocks/storage/${world.crypto[i].wallet_image}`,
    });
  }

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

  const renderCoinEntry = ( name: string , image: string) => {
    return(
      <div className={styles.coinContainer}>
        <img src={image} className={styles.exchangeCoin} />
        {name}
        <button className={`${styles.sellButton} ${styles.enabledButton}`}>SELL</button> 
      </div>
    )
  }

  let cryptoList = cryptoArray.map(function (crypto) {
    return renderCoinEntry( crypto.name, crypto.image );
  });

  useEffect( () => {
    Client.getInstance().phaserGame.events.on("open_exchange", openExchange );
    Client.getInstance().phaserGame.events.on("close_dialogs", closeExchange);
    Client.getInstance().phaserGame.events.on("joined_game", () => {
      Client.getInstance().phaserGame.events.on("updated balance", updatePlayerBalance )
    });
  },[]);

  return (
    <div  id="exchange" 
          className={`${styles.exchangeContainer}
                     ${displayExchange? styles.displayOn:styles.displayOff }`}>
        <div>
          <div className={styles.exchangeDisplayContainer}>
            <div className={styles.exchangeHeader}>
              <h2>EXCHANGE</h2>
              <div className={styles.playerDoekoes}>{playerDoekoes} GGEMS</div>
              <button className={styles.closeButton} onClick={closeExchange}>X</button>
            </div>
            <div className={styles.coinList}> 
              {cryptoList} 
            </div>
          </div>
        </div>
     
    </div>
  );
};

export default Exchange;
