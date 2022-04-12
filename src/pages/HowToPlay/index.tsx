import styles from "./styles.module.css";
import { Header } from "components";


const HowToPlay = (): JSX.Element => {
  return (
    <>
      <div className={styles.backgroundContainer}>
        <Header />
        <div className={styles.maintText}>
          
          <h1>Welcome to Gotchi Miner</h1>
          <p>There is a special place in the Gotchiverse where great treasures hide under the surface. 
            Ancient civilizations flourished in the DeFi Desert by extracting buried Crypto Crystals. 
            Come and join the search Fren, the deeper you go, the higher the risk and juicier the rewards! 
            Don't forget to collect Gotchus Alchemica for upgrading your tools and speeding up your work.</p>
          
          <h2>Choose your gotchi wisely!</h2>
          The unique traits of your companion have a great impact on the game:
          <ul>
            <li> Turnt gotchis move very fast through the DeFi desert, however Zen gotchis make better use of their fuel. </li> 
            <li> Based aggressiveness allows drilling faster. Nonviolent gotchis spend more time breaking down every little crystal, effectively expanding their total cargo space.</li>
            <li> Ghastly creatures can usually survive greater damage. Cuddly gotchis benefit from their cute aspect, enjoying cheaper upgrades.</li>
            <li> Galaxy brain gotchis are the best at finding good deals trading crypto crystals. People selling explosives have an affinity with smol brain gotchis, selling cheaper items to frens.</li>
          </ul>
          
          <h2> Upgrade your tools and buy explosives</h2> 
          All gotchis start with a set of common tools. Collect Gotchus Alchemica to upgrade your gear up to a Godlike level. 
          Health, jetpack, cargo, fuel tank, and drill can be improved by upgrades.
          There are also several explosives available during your mission. 
          During the beta testing phase of the game we have made them unlimited for all players, 
          press the numeric keys from 1 to 4 to experiment using different types of explosives, time have a blast!
    
        </div>

      </div>
    </>
  );
};

export default HowToPlay;

