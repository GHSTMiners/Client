import { InfoPanel, NewsPanel, StatsPanel } from "components";
import demoVideo from "assets/videos/demo.mp4"
import styles from "./styles.module.css";
import { DailyWinners } from "components/DailyWinners";
import ActiveFrensIcon from "assets/icons/active_frens.svg"
import BlocksMinedIcon from "assets/icons/blocks_mined.svg"
import GamesPlayedIcon from "assets/icons/games_played.svg"
import CrystalsCollectedIcon from "assets/icons/crystals_collected.svg"
import { updateAavegotchis, useWeb3 } from "web3/context";
import { useEffect } from "react";

const Home = (): JSX.Element => {

  // Initializing web3 hook
  const { state: { usersAavegotchis, address },dispatch } = useWeb3();
  useEffect(() => {
    if (address)  updateAavegotchis(dispatch, address);
  }, [address]);

  return (
    <>
     <div className={styles.basicGrid}>
        
      <div className={`${styles.gridTile} ${styles.video}`}> 
        <video autoPlay loop muted width={800} >
          <source src={demoVideo} type={"video/mp4"}/>
        </video>
      </div>

      <div className={`${styles.gridTile} ${styles.activeFrens}`}>
        <InfoPanel title="Active Frens" quantity='9000' icon={ActiveFrensIcon} />
      </div> 

      <div className={`${styles.gridTile} ${styles.blocksMined}`} >
        <InfoPanel title="Blocks Mined" quantity='164K' icon={BlocksMinedIcon} />
      </div>

      <div className={`${styles.gridTile} ${styles.gamesPlayed}`} >
        <InfoPanel title="Games Played" quantity='589' icon={GamesPlayedIcon} />
      </div>

      <div className={`${styles.gridTile} ${styles.crystalsCollected}`} >
        <InfoPanel title="Crystals Collected" quantity='436K' icon={CrystalsCollectedIcon} />
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
