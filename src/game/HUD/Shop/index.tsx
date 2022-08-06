import React, { createContext, useEffect, useState } from "react";
import styles from  "./styles.module.css";
import Tabs from "components/Tabs";
import Client from "matchmaking/Client";
import { CryptoEntry } from "types";

// Tabs Components
import TabUpgrades from "./tabs/TabUpgrades";
import TabConsumables from "./tabs/TabConsumables";
import useVisible from "hooks/useVisible";

type TabsType = {
  label: string;
  index: number;
  Component: React.FC<{}>;
}[];

// Tabs Array
const tabs: TabsType = [
  {
    label: "Consumables",
    index: 1,
    Component: TabConsumables
  },
  {
    label: "Upgrades",
    index: 2,
    Component: TabUpgrades
  }
];


export const ShopContext = createContext({currencyBalance:0 ,walletCrypto:[] as CryptoEntry[]});

const Shop = () => {
  
  const [selectedTab, setSelectedTab] = useState<number>(tabs[0].index);
  const shopVisibility = useVisible('shop'); 
  const [playerDoekoes, setPlayerDoekoes] = useState<number>(0);
  const [playerCrypto ] = useState<CryptoEntry[]>([]);

  useEffect( () => {
    const updatePlayerBalance = (quantity:number) =>{
      setPlayerDoekoes(Math.round(quantity*10)/10);
    }
    const addCryptoToWallet = (cryptoId:number, amount:number) => {
      let cryptoEntry = {id:cryptoId,quantity:amount};
      playerCrypto.push(cryptoEntry);
    }
    const updateWalletBalance = (id:number, quantity:number) => {
      if (playerCrypto){
        let cryptoEntry = playerCrypto.find( entry => entry.id === id);
        if (cryptoEntry){
          cryptoEntry.quantity = quantity;
        } else {
          addCryptoToWallet(id,quantity);
        }
      } else {
        addCryptoToWallet(id,quantity);
      }
    }

    Client.getInstance().phaserGame.events.on("exit_building", shopVisibility.hide );
    Client.getInstance().phaserGame.events.on("updated balance", updatePlayerBalance )
    Client.getInstance().phaserGame.events.on("added crypto", addCryptoToWallet )
    Client.getInstance().phaserGame.events.on("updated wallet", updateWalletBalance )
    
    return () => {
      Client.getInstance().phaserGame.events.off("exit_building", shopVisibility.hide );
      Client.getInstance().phaserGame.events.off("updated balance", updatePlayerBalance )
      Client.getInstance().phaserGame.events.off("added crypto", addCryptoToWallet )
      Client.getInstance().phaserGame.events.off("updated wallet", updateWalletBalance )
    }

  },[playerCrypto,shopVisibility.hide]);


  return (
    <div className={`${styles.shopContainer} ${shopVisibility.state ? styles.displayOn : styles.displayOff}`} onClick={()=>{}}>
      <div className={styles.screenContainer}>
        <ShopContext.Provider value={{ currencyBalance: playerDoekoes , walletCrypto: playerCrypto }}>
          <div className={styles.playerDoekoes}>{playerDoekoes} GGEMS</div>
          <button className={styles.closeButton} onClick={ shopVisibility.hide }>X</button>
            <div className={styles.shopTabs}>
              <Tabs selectedTab={selectedTab} onClick={setSelectedTab} tabs={tabs} />
            </div>
        </ShopContext.Provider>
      </div>
    </div>
  );
}

export default Shop