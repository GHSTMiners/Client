import { useEffect } from "react";
import { InfoPanel, NewsPanel, StatsPanel, DailyWinners } from "./components";
import { updateAavegotchis, useWeb3 } from "web3/context";
import ActiveFrensIcon from "assets/icons/active_frens.svg"
import BlocksMinedIcon from "assets/icons/blocks_mined.svg"
import GamesPlayedIcon from "assets/icons/games_played.svg"
import CrystalsCollectedIcon from "assets/icons/crystals_collected.svg"
import demoVideo from "assets/videos/demo.mp4"
import ReactPlayer from 'react-player/lazy'
import styles from "./styles.module.css";
import useGlobalStatistics from "hooks/useGlobalStatistics";
import { TimeRange } from "helpers/vars";

const Home = (): JSX.Element => {

  // Initializing web3 hook
  const { state: { address },dispatch } = useWeb3();
  useEffect(() => {
    if (address)  updateAavegotchis(dispatch, address);
  }, [address,dispatch]);
  const globalStats = useGlobalStatistics();

  return (
    <>
     <div className={styles.basicGrid}>
        
      <div className={`${styles.gridTile} ${styles.video}`} style={{backgroundColor : '#000000'}}> 
        <ReactPlayer url={demoVideo} controls playing={true} muted={true} width={'100%'} height={'100%'}/>
      </div>

      <div className={`${styles.gridTile} ${styles.activeFrens}`}>
        <InfoPanel 
          title="Deaths" 
          loading={globalStats.isLoading}
          quantity={globalStats.deaths(TimeRange.total)} 
          icon={ActiveFrensIcon} />
      </div> 

      <div className={`${styles.gridTile} ${styles.blocksMined}`} >
        <InfoPanel 
          title="Blocks Mined"
          loading={globalStats.isLoading} 
          quantity={globalStats.blocksMined(TimeRange.total)} 
          icon={BlocksMinedIcon} />
      </div>

      <div className={`${styles.gridTile} ${styles.gamesPlayed}`} >
        <InfoPanel 
          title="Games Played"
          loading={globalStats.isLoading} 
          quantity={globalStats.totalGames()} 
          icon={GamesPlayedIcon} />
      </div>

      <div className={`${styles.gridTile} ${styles.crystalsCollected}`} >
        <InfoPanel 
          title="Crypto Collected"
          loading={globalStats.isLoading} 
          quantity={`$${globalStats.cryptoCollected(TimeRange.total)}`} 
          icon={CrystalsCollectedIcon} />
      </div>

      <div className={`${styles.gridTile} ${styles.topPlayers}`} >
        <DailyWinners />
      </div>

      <div className={`${styles.gridTile} ${styles.alphaNews}`} >
        <NewsPanel />
      </div>

      <div className={`${styles.gridTile} ${styles.myStaats}`} >
        <StatsPanel />
      </div>

      </div>        
    </>
  );
};
export default Home;
