import { InfoPanel, NewsPanel, StatsPanel } from "components";
import demoVideo from "assets/videos/demo.mp4"
import styles from "./styles.module.css";
import { DailyWinners } from "components/DailyWinners";

const Home = (): JSX.Element => {

  return (
    <>
     <div className={styles.basicGrid}>
       
      <div className={`${styles.gridTile} ${styles.video}`}> 
        <iframe
          width="853"
          height="480"
          src={demoVideo}
          className={styles.iframe}
          frameBorder="0"
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
          allowFullScreen
          title="demo video"
        />
      </div>

      <div className={`${styles.gridTile} ${styles.activeFrens}`}>
        <InfoPanel title="Active Frens" quantity='9000' icon={"iconURL"} />
      </div> 

      <div className={`${styles.gridTile} ${styles.blocksMined}`} >
        <InfoPanel title="Blocks Mined" quantity='164K' icon={"iconURL"} />
      </div>

      <div className={`${styles.gridTile} ${styles.gamesPlayed}`} >
        <InfoPanel title="Games Played" quantity='589' icon={"iconURL"} />
      </div>

      <div className={`${styles.gridTile} ${styles.crystalsCollected}`} >
        <InfoPanel title="Crystals Collected" quantity='436K' icon={"iconURL"} />
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
