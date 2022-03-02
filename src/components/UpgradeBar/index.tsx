import { hexConcat } from "ethers/lib/utils";
import React from "react";
import styles from "./styles.module.css";

interface Props {
  initialState?: number;
  text?: string;
  topPosition?:number;
  leftPosition?:number;
  onUpgrade?: () => void;
}

const UpgradeBar: React.FC<Props> = ({
  text,
  topPosition,
  leftPosition,
  initialState = 2,
  onUpgrade
}) => {

  type upgradeLevel = { name: string; color: string };

  // Defining the tags and colors of all possible upgrade levels
  let upgradeLevelArray: upgradeLevel[] = [];
  upgradeLevelArray.push({name:'common', color:'#7f63ff'});
  upgradeLevelArray.push({name:'uncommon', color:'#33bacc'});
  upgradeLevelArray.push({name:'rare', color:'#59bcff'});
  upgradeLevelArray.push({name:'legendary', color:'#ffc36b'});
  upgradeLevelArray.push({name:'mythical', color:'#ff96ff'});
  upgradeLevelArray.push({name:'godlike', color:'#51ffa8'});
  
  // creatng definition of each of the upgradable levels
  const renderUpgradeLevel = (name: string, color: string, disabled: boolean) => (
    <div className={styles.levelElement} style={{backgroundColor:color}} >
    </div>
  );

  // rendering the array of level elements and storing into one variable
  let upgradeLevels = upgradeLevelArray.map(function (upgradeLevel) {
    return renderUpgradeLevel( upgradeLevel.name, upgradeLevel.color, false );
  });

  return (
    <div className={styles.upgradeBarContainer} style={{top: `${topPosition}%` , left:  `${leftPosition}%` }}>
      {text} <br />
      <button className={styles.upgradeButton}>
        <div className={styles.upgradeButtonText}>+</div>        
      </button>  
      <div className={styles.levelContainer}>
        {upgradeLevels}
      </div>
      
    </div>
  );
};

export default UpgradeBar;
