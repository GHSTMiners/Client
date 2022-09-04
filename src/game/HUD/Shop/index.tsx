import { useContext, useEffect, useState } from "react";
import styles from  "./styles.module.css";
import Tabs from "components/Tabs";
import Client from "matchmaking/Client";
import useVisible from "hooks/useVisible";
import gameEvents from "game/helpers/gameEvents";
import { HUDContext } from "..";
import tabs from "./tabs";
import sellCrypto from "./helpers/sellCrypto";


const Shop = () => {

  const [selectedTab, setSelectedTab] = useState<number>(tabs[0].index);
  const shopVisibility = useVisible('shop'); 
  const hudContext = useContext(HUDContext);

  useEffect( () => {
    Client.getInstance().phaserGame.events.on( gameEvents.buildings.EXIT, shopVisibility.hide );
    
    return () => {
      Client.getInstance().phaserGame.events.off( gameEvents.buildings.EXIT, shopVisibility.hide );
    }
  },[shopVisibility.hide]);


  return (
    <div className={`${styles.shopContainer} ${shopVisibility.state ? styles.displayOn : styles.displayOff}`} onClick={()=>{}}>
      <div className={styles.screenContainer}>
        <div className={styles.shopHeader}>
          <div className={styles.playerCryptoContainer}>
              {Object.keys(hudContext.player.crypto).map( key =>{
                return(
                  <div className={`${styles.playerCryptoWrapper}
                    ${ (hudContext.player.crypto[key]>0) ? styles.coinAvailable: styles.coinUnavailable}`}
                    onClick={()=>sellCrypto(+key,1)}
                    key={key}>
                    <img src={hudContext.world.crypto[key].image} 
                    className={styles.currencyThumbnail} 
                    alt={hudContext.world.crypto[key].name}
                    loading='lazy'/>
                    x 
                    {Math.round(hudContext.player.crypto[key]*10)/10}
                  </div>
                )
              })
              }
          </div>
          <button className={styles.closeButton} onClick={ shopVisibility.hide }>X</button>
        </div>
        <div className={styles.shopTabs}>
          <Tabs selectedTab={selectedTab} onClick={setSelectedTab} tabs={tabs} />
        </div>
      </div>
    </div>
  );
}

export default Shop