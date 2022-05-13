import styles from "./styles.module.css";
import gameFlow from "assets/images/gameflow.png"
import explosivesFlow from "assets/images/explosivesflow.png"
import upgradesFlow from "assets/images/upgradesflow.png"
import vitalsHowTo from "assets/svgs/vitals_howto.svg"
import consoleHowTo from "assets/svgs/console_howto.svg"
import numericInfoKey from "assets/svgs/infoKeys/1234.svg"
import eKey from "assets/svgs/infoKeys/e.svg"
import qKey from "assets/svgs/infoKeys/q.svg"
import spaceKey from "assets/svgs/infoKeys/space.svg"
import wasdKeys from "assets/svgs/infoKeys/wasd.svg"


const HowToPlay = (): JSX.Element => {

  const renderControlItem = ( keyIcon: string , description: string, styleClass : string ) =>{
    return(
      <div className={styles.controlKeyContainer}>
        <img src={keyIcon} className={styles.singleKey}/>
        <div className={styles.controlDescription}>
          {description}
        </div>
      </div>
    )
  }

  return (
    <>
      <div className={styles.basicGrid}>

        <div className={`${styles.gridTile} ${styles.welcomeTile}`}>
          <h3>Welcome to Gotchi Miner</h3>
            <p>There is a special place in the Gotchiverse where great treasures hide under the surface. 
              Ancient civilizations flourished in the DeFi Desert by extracting buried Crypto Crystals. 
              Come and join the search Fren, the deeper you go, the higher the risk and juicier the rewards! 
              Don't forget to collect Gotchus Alchemica for upgrading your tools and speeding up your work.</p>
        </div> 

        <div className={`${styles.gridTile} ${styles.controlsTile}`}>
          {renderControlItem(wasdKeys,'movement keys','styles.wasdKeys')}
          {renderControlItem(spaceKey,'open/close console','styles.singleKey')}
          {renderControlItem(eKey,'interact with building','styles.singleKey')}
          {renderControlItem(qKey,'open/close wallet','singleKey')}
          {renderControlItem(numericInfoKey,'use explosives','singleKey')}
          
        </div>

        <div className={`${styles.gridTile} ${styles.gameflowTile}`}>
          GameFlow
          <img src={gameFlow} className={styles.flowImage}/>
          <img src={upgradesFlow} className={styles.flowImage}/>
          <img src={explosivesFlow} className={styles.flowImage}/>
        </div>

        <div className={`${styles.gridTile} ${styles.traitsTile}`}>
        The unique traits of your companion have a great impact on the game:
          <ul>
            <li> Turnt gotchis move very fast through the DeFi desert, however Zen gotchis make better use of their fuel. </li> 
            <li> Based aggressiveness allows drilling faster. Nonviolent gotchis spend more time breaking down every little crystal, effectively expanding their total cargo space.</li>
            <li> Ghastly creatures can usually survive greater damage. Cuddly gotchis benefit from their cute aspect, enjoying cheaper upgrades.</li>
            <li> Galaxy brain gotchis are the best at finding good deals trading crypto crystals. People selling explosives have an affinity with smol brain gotchis, selling cheaper items to frens.</li>
          </ul>
        </div>

        <div className={`${styles.gridTile} ${styles.vitalsTile}`}>
          <img src={vitalsHowTo} className={styles.flowImage}/>
        </div>

        <div className={`${styles.gridTile} ${styles.consoleTile}`}>
          <img src={consoleHowTo} className={styles.flowImage}/>
        </div>
      </div>
    </>
  );
};

export default HowToPlay;