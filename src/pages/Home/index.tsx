import styles from "./styles.module.css";

const Home = (): JSX.Element => {


  return (
    <>
     <div className={styles.basicGrid}>
       
      <div className={`${styles.gridTile} ${styles.video}`}> Video </div>
      <div className={`${styles.gridTile} ${styles.activeFrens}`}> Active Frens</div> 
      <div className={`${styles.gridTile} ${styles.blocksMined}`} >Blocks Mined</div> 
      <div className={`${styles.gridTile} ${styles.topPlayers}`} >Top Players</div>
      <div className={`${styles.gridTile} ${styles.gamesPlayed}`} >Games Played</div>
      <div className={`${styles.gridTile} ${styles.crystalsCollected}`} >Crystals Collected</div>
      <div className={`${styles.gridTile} ${styles.alphaNews}`} >Alpha News</div>
      <div className={`${styles.gridTile} ${styles.myStaats}`} >My Staats</div>

      </div>        
    </>
  );
};
export default Home;
