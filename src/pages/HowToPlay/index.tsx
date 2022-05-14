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
import nrg from "assets/images/nrg.png"
import agg from "assets/images/agg.png"
import spk from "assets/images/spk.png"
import brn from "assets/images/brn.png"


const HowToPlay = (): JSX.Element => {

  const renderControlItem = ( keyIcon: string , description: string, iconHeight : number ) =>{
    return(
      <div className={styles.controlKeyContainer}>
        <img src={keyIcon} style={{height:`${iconHeight}rem`}}/>
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
          <h4>Controls</h4>
          {renderControlItem(wasdKeys,'Movement Keys', 5)}
          {renderControlItem(spaceKey,'Open/Close Console', 2.5)}
          {renderControlItem(eKey,'Interact with Buildings',2.5)}
          {renderControlItem(qKey,'Open/Close Wallet',2.5)}
          {renderControlItem(numericInfoKey,'Use Explosives',2.5)}
          
        </div>

        <div className={`${styles.gridTile} ${styles.gameflowTile}`}>
          <h4>GameFlow</h4>
          <div className={styles.flowTitle}>Leaderboard grinding</div>
          <img src={gameFlow} className={styles.flowImage}/>
          <div className={styles.flowTitle}>Upgrading your gear</div>
          <img src={upgradesFlow} className={styles.flowImage}/>
          <div className={styles.flowTitle}>Purchasing explosives</div>
          <img src={explosivesFlow} className={styles.flowImage}/>
        </div>

        <div className={`${styles.gridTile} ${styles.traitsTile}`}>
          <h4>Gotchi Traits</h4>
          <div className={styles.traitList}>
            <div className={styles.traitElement}> 
              <img src={nrg} className={styles.traitIcon}/>
              Turnt gotchis move very fast, Zen gotchis make better use of their fuel. 
            </div> 
            <div className={styles.traitElement}> 
              <img src={agg} className={styles.traitIcon}/>
              Based gotchis drill faster. Nonviolent gotchis use their cargo more effectively. 
            </div> 
            <div className={styles.traitElement}> 
              <img src={spk} className={styles.traitIcon}/>
              Ghastly creatures can survive greater damage. Cuddly gotchis enjoy cheaper upgrades.
            </div> 
            <div className={styles.traitElement}> 
              <img src={brn} className={styles.traitIcon}/>
              Galaxy brains are great trading crypto crystals. Smol brain gotchis get discounts on explosives.
            </div> 
          </div>
        </div>

        <div className={`${styles.gridTile} ${styles.vitalsTile}`}>
          <h4>Vitals</h4>
          <img src={vitalsHowTo} className={styles.flowImage}/>
        </div>

        <div className={`${styles.gridTile} ${styles.consoleTile}`}>
          <h4>Console</h4>
          <img src={consoleHowTo} className={styles.flowImage}/>
        </div>
      </div>
    </>
  );
};

export default HowToPlay;