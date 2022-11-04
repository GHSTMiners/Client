import refinery from "assets/images/refinery.png"
import refuel from "assets/images/refuel.png"
import shop from "assets/images/shop.png"
import garage from "assets/images/garage.png"
import drilling from "assets/images/drilling.png"
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
import globalStyles from "theme/globalStyles.module.css"
import { useGlobalStore } from "store"


const HowToPlay = (): JSX.Element => {
  const isLoading = useGlobalStore( state => state.isLoading);
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

  const gameFlowList = [
    { image: drilling, title: 'Drill', text: 'Use your drill to find crypto crystals' },
    { image: refinery, title: 'Refine', text: 'Convert your cargo into crypto' },
    { image: refuel, title: 'Refuel', text: 'Make sure to have enough fuel for your jetpack' },
    { image: garage, title: 'Repair', text: 'Use the garage to repair damage' },
    { image: shop, title: 'Trade', text: 'Trade, buy explosives and upgrade your gear' },
  ]

  return (
    <>
      <div className={`${styles.basicGrid} ${isLoading? globalStyles.isLoading :null}`}>

        <div className={`${globalStyles.gridTile} ${styles.welcomeTile}`}>
          <div className={globalStyles.tileTitle}>Welcome to Gotchi Miner</div>
          <div className={globalStyles.tileContent}>
            There is a special place in the Gotchiverse where great treasures hide under the surface. 
            Ancient civilizations flourished in the Gotchiverse by extracting buried Crypto Crystals. 
            Come and join the search Fren, the deeper you go, the higher the risk and juicier the rewards! 
            Don't forget to buy some upgrades to enhance your tools and speed up your work.
          </div>
        </div> 

        <div className={`${globalStyles.gridTile} ${styles.controlsTile}`}>
          <div className={globalStyles.tileTitle}>Controls</div>
          <div className={globalStyles.tileContent}>
            {renderControlItem(wasdKeys,'Movement Keys', 5)}
            {renderControlItem(spaceKey,'Open/Close Console', 2.5)}
            {renderControlItem(eKey,'Interact with Buildings',2.5)}
            {renderControlItem(numericInfoKey,'Use Explosives',2.5)}
          </div>
        </div>

        <div className={`${globalStyles.gridTile} ${styles.gameflowTile}`}>
          <div className={globalStyles.tileTitle}>GameFlow</div>
          <div className={globalStyles.tileContent}>
            {gameFlowList.map( (entry,index) =>{
              return(
                <div className={styles.gameFlowEntry} key={`illustration_${index}`}>
                  <div className={styles.imageFrame}>
                    <img src={entry.image} className={styles.gameflowThumbnail} alt={entry.title}/>
                    <div className={styles.imageTitle}>{entry.title}</div>
                  </div>
                  <div className={styles.gameflowText} >{entry.text}</div>
                </div>
              )
            })}
          </div>
        </div>

        <div className={`${globalStyles.gridTile} ${styles.traitsTile}`}>
          <div className={globalStyles.tileTitle}>Gotchi Traits</div>
          <div className={globalStyles.tileContent}>
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

        <div className={`${globalStyles.gridTile} ${styles.vitalsTile}`}>
          <div className={globalStyles.tileTitle}>Vitals</div>
          <div className={globalStyles.tileContent}>
            <img src={vitalsHowTo} className={styles.flowImage} alt={'Vitals Console'}/>
          </div>
        </div>

        <div className={`${globalStyles.gridTile} ${styles.consoleTile}`}>
          <div className={globalStyles.tileTitle}>Console</div>
          <div className={globalStyles.tileContent}>
            <img src={consoleHowTo} className={styles.flowImage} alt={'Main Console'}/>
          </div>
        </div>
      </div>
    </>
  );
};

export default HowToPlay;