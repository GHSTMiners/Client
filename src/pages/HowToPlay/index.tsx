import gameFlow from "assets/images/gameflow.png"
import explosivesFlow from "assets/images/explosivesflow.png"
import upgradesFlow from "assets/images/upgradesflow.png"
import vitalsHowTo from "assets/svgs/vitals_howto.svg"
import consoleHowTo from "assets/svgs/console_howto.svg"
import numericInfoKey from "assets/svgs/infoKeys/1234.svg"
import eKey from "assets/svgs/infoKeys/e.svg"
import spaceKey from "assets/svgs/infoKeys/space.svg"
import wasdKeys from "assets/svgs/infoKeys/wasd.svg"
import nrg from "assets/images/nrg.png"
import agg from "assets/images/agg.png"
import spk from "assets/images/spk.png"
import brn from "assets/images/brn.png"
import styles from "./styles.module.css";


const HowToPlay = (): JSX.Element => {

  const renderControlItem = ( keyIcon: string , description: string, iconHeight : number ) =>{
    return(
      <div className={styles.controlKeyContainer}>
        <img src={keyIcon} style={{height:`${iconHeight}rem`}} alt={keyIcon}/>
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
          <div className={styles.tileTitle}>Welcome to Gotchi Miner</div>
          <div className={styles.tileContent}>
            There is a special place in the Gotchiverse where great treasures hide under the surface. 
            Ancient civilizations flourished in the Gotchiverse by extracting buried Crypto Crystals. 
            Come and join the search Fren, the deeper you go, the higher the risk and juicier the rewards! 
            Don't forget to buy some upgrades to enhance your tools and speed up your work.
          </div>
        </div> 

        <div className={`${styles.gridTile} ${styles.controlsTile}`}>
          <div className={styles.tileTitle}>Controls</div>
          <div className={styles.tileContent}>
            {renderControlItem(wasdKeys,'Movement Keys', 5)}
            {renderControlItem(spaceKey,'Open/Close Console', 2.5)}
            {renderControlItem(eKey,'Interact with Buildings',2.5)}
            {renderControlItem(numericInfoKey,'Use Explosives',2.5)}
          </div>
        </div>

        <div className={`${styles.gridTile} ${styles.gameflowTile}`}>
          <div className={styles.tileTitle}>GameFlow</div>
          <div className={styles.tileContent}>
            <div className={styles.flowTitle}>Leaderboard grinding</div>
            <img src={gameFlow} className={styles.flowImage} alt={'Game Flow'}/>
            <div className={styles.flowTitle}>Upgrading your gear</div>
            <img src={upgradesFlow} className={styles.flowImage} alt={'Purchasing Upgrades'}/>
            <div className={styles.flowTitle}>Purchasing explosives</div>
            <img src={explosivesFlow} className={styles.flowImage} alt={'Purchasing Explosives'}/>
          </div>
        </div>

        <div className={`${styles.gridTile} ${styles.traitsTile}`}>
          <div className={styles.tileTitle}>Gotchi Traits</div>
          <div className={styles.tileContent}>
            <div className={styles.traitList}>
              <div className={styles.traitElement}> 
                <img src={nrg} className={styles.traitIcon} alt={'Energy'}/>
                Turnt gotchis move very fast, Zen gotchis are more fuel efficient. 
              </div> 
              <div className={styles.traitElement}> 
                <img src={agg} className={styles.traitIcon} alt={'Aggresiveness'}/>
                Based gotchis are the best at drilling. Nonviolent gotchis have better cargo. 
              </div> 
              <div className={styles.traitElement}> 
                <img src={spk} className={styles.traitIcon} alt={'Spookiness'}/>
                Ghastly creatures can survive greater damage. Cuddly ones enjoy cheaper upgrades.
              </div> 
              <div className={styles.traitElement}> 
                <img src={brn} className={styles.traitIcon} alt={'Brain Size'}/>
                Galaxy brains are great at trading crypto. Smol brains get discounts on explosives.
              </div> 
            </div>
          </div>
        </div>

        <div className={`${styles.gridTile} ${styles.vitalsTile}`}>
          <div className={styles.tileTitle}>Vitals</div>
          <div className={styles.tileContent}>
            <img src={vitalsHowTo} className={styles.flowImage} alt={'Vitals Console'}/>
          </div>
        </div>

        <div className={`${styles.gridTile} ${styles.consoleTile}`}>
          <div className={styles.tileTitle}>Console</div>
          <div className={styles.tileContent}>
            <img src={consoleHowTo} className={styles.flowImage} alt={'Main Console'}/>
          </div>
        </div>
      </div>
    </>
  );
};

export default HowToPlay;