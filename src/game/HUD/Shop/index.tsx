import { useContext, useEffect, useState } from "react";
import styles from  "./styles.module.css";
import Tabs from "components/Tabs";
import Client from "matchmaking/Client";
import useVisible from "hooks/useVisible";
import gameEvents from "game/helpers/gameEvents";
import { HUDContext } from "..";
import tabs from "./tabs";


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
        <div className={styles.playerDoekoes}>$ {Math.round(hudContext.player.total*10)/10} </div>

        
        <button className={styles.closeButton} onClick={ shopVisibility.hide }>X</button>
        <div className={styles.shopTabs}>
          <Tabs selectedTab={selectedTab} onClick={setSelectedTab} tabs={tabs} />
        </div>
      </div>
    </div>
  );
}

export default Shop