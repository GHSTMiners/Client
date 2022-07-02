import { useEffect, useState } from "react";
import Client from "matchmaking/Client";
import styles from "./styles.module.css";
import walletIcon from "assets/hud/wallet_icon.png";
import ggemsIcon from "assets/icons/ggems_icon.svg";


const GameMenu = () => {
  
  const [displayExchange, setDisplayExchange] = useState<boolean>(false);
  const [playerGGEMS, setPlayerGGEMS] = useState<number>(0);
  const [showMenu, setShowMenu] = useState(false);
  

  const updatePlayerBalance = (quantity:number) =>{
    setPlayerGGEMS(Math.round(quantity*10)/10);
  }

  useEffect( () => {
    Client.getInstance().phaserGame.events.on("joined_game", () => {
      Client.getInstance().phaserGame.events.on("updated balance", updatePlayerBalance )
    });
  },[]);

  return (
    <>
      <div className={styles.playerMenuBarContainer}>
        <div className={styles.playerMenuBar}>
          <div className={styles.mainPlayerBalance}
                onClick={ () => setDisplayExchange(!displayExchange) }>
            <img src={ggemsIcon} className={styles.ggemsIcon} />
            {playerGGEMS}
          </div>
          <div className={styles.walletIconContainer} onClick={ () => Client.getInstance().phaserGame.events.emit("open_exchange") }>
            <img src={walletIcon} className={styles.walletIcon}  />
          </div>
          <div className={styles.menuButton} onClick={()=> setShowMenu(true)}>MENU</div>
        </div>
      </div>
      <div className={styles.fullScreenMenu} onClick={()=> setShowMenu(false)} hidden={!showMenu}>
        <div className={styles.menuDialogContainer}>
          <div>X</div>
          <div>Sound FX</div>
          <div>Music</div>
          <div>LEAVE GAME</div>
        </div>
      </div>
    </>
  );
};

export default GameMenu;
