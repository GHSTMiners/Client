import { useEffect, useRef, useState } from "react";
import styles from  "./styles.module.css";
import Tabs from "components/Tabs";
import Client from "matchmaking/Client";
import useVisible from "hooks/useVisible";
import gameEvents from "game/helpers/gameEvents";
import tabs from "./tabs";
import sellCrypto from "./helpers/sellCrypto";
import { useGlobalStore } from "store";
import ReactTooltip from 'react-tooltip';
import { formatNumber } from "helpers/functions";

const Shop = () => {
  const [selectedTab, setSelectedTab] = useState<number>(tabs[0].index);
  const shopVisibility = useVisible('shop'); 
  const wallet = useGlobalStore( state => state.wallet);
  const worldCrypto = useGlobalStore( state => state.worldCrypto);
  const hideTooltip = useRef(false);

  const closeShopDialog = (currentBuilding:string) => {
    if (currentBuilding==='Bazaar')   Client.getInstance().phaserGame.events.emit( gameEvents.shop.HIDE ) 
  }

  useEffect( () => {
    Client.getInstance().phaserGame.events.on( gameEvents.buildings.EXIT, closeShopDialog );
    
    return () => {
      Client.getInstance().phaserGame.events.off( gameEvents.buildings.EXIT, closeShopDialog );
    }
  },[]);

  return (
    <div className={`${styles.shopContainer} ${shopVisibility.state ? styles.displayOn : styles.displayOff}`} onClick={()=>{}}>
      <div className={styles.screenContainer}>
        <div className={styles.shopHeader}>
          <div className={styles.walletContainer} data-tip="Left-Click to Sell 1 Coin to GHST; Right-Click to Sell all to GHST">
              <ReactTooltip  effect="solid" disable={hideTooltip.current}/>
              {Object.keys(worldCrypto).map( key =>{
                return(
                  <div className={`${styles.walletWrapper}
                    ${ (wallet[key]>0) ? styles.coinAvailable: styles.coinUnavailable}`}
                    onClick={ ()=> {sellCrypto(+key,1); hideTooltip.current=true}}
                    onContextMenu={ (e)=> {e.preventDefault(); sellCrypto(+key,wallet[key]); hideTooltip.current=true} }
                    key={key}>
                    <img src={worldCrypto[key].image} 
                    className={styles.currencyThumbnail} 
                    alt={worldCrypto[key].name}
                    loading='lazy'/>
                    x 
                    {wallet[key]? formatNumber(Math.floor(wallet[key])) : 0}
                  </div>
                )
              })
              }
          </div>
          <button className={styles.closeButton} onClick={ ()=> closeShopDialog('Bazaar') }>X</button>
        </div>
        <div className={styles.shopTabs}>
          <Tabs selectedTab={selectedTab} onClick={setSelectedTab} tabs={tabs} />
        </div>
      </div>
    </div>
  );
}

export default Shop