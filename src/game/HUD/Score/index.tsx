import Client from "matchmaking/Client";
import styles from "./styles.module.css";
import gearIcon from "assets/icons/gear.svg";
import 'rc-slider/assets/index.css';
import Marquee from "react-easy-marquee";
import gameEvents from "game/helpers/gameEvents";
import leaderboardIcon from "assets/icons/top_players_blue.svg"
import useMusicManager from "hooks/useMusicManager";
import { useGlobalStore } from "store";
import { formatCurrency } from "helpers/functions";

const Score = () => {
  
  const musicManager = useMusicManager();
  const playerTotalCrypto = useGlobalStore( state => state.totalValue);
  const wallet = useGlobalStore( state => state.wallet );
  const worldCrypto = useGlobalStore( state => state.worldCrypto );

  return (
    <>
      <div className={styles.playerMenuBarContainer}>

        <div className={styles.playerMenuBar}>
          
          <div className={styles.mainPlayerBalance} key={'Tota_Worth_Value'}>
            {formatCurrency(playerTotalCrypto)}
          </div>

          <div className={styles.coinThumbnailContainer} key={'Thumbnail_cointainer'}>
            { Object.keys(wallet)
                .filter( key => wallet[key]>0 )
                .map( cryptoKey => 
                  <img src={worldCrypto[cryptoKey].image} 
                    className={styles.coinThumbnail}
                    alt={`${worldCrypto[cryptoKey].name}_thumbnail`}  
                    key={`coin_thumbnail_${cryptoKey}`}/>
              )
            }
          </div>
          
          <div className={styles.leaderboardShortcut} onClick={()=> Client.getInstance().phaserGame.events.emit( gameEvents.leaderboard.CHANGE ) }>
            <img src={leaderboardIcon} className={styles.leaderboardIcon} alt={'Open/Close Room Leaderboard'}/> 
          </div>

          <div className={styles.menuButton} onClick={ () => Client.getInstance().phaserGame.events.emit( gameEvents.menu.SHOW) }>
            <img src={gearIcon} className={styles.gearIcon} alt={'Settings'}/> 
          </div>
        </div>

        <div className={styles.soundtrack} onClick={musicManager.next}>
          <div className={styles.soundtrackText}>
            <Marquee duration={30000}>
                 Playing {musicManager.currentSong}
            </Marquee>
          </div>   
        </div>
        
      </div>
    </>
  );
};

export default Score