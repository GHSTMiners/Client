import { hexConcat } from "ethers/lib/utils";
import React, { useState } from "react";
import styles from "./styles.module.css";

interface Props {
  text?: string;
  topPosition?:number;
  leftPosition?:number;
  initialLevel?:number;
  onUpgrade?: () => void;
}

const UpgradeBar: React.FC<Props> = ({
  text,
  topPosition,
  leftPosition,
  initialLevel = 0,
  onUpgrade
}) => {

  type upgradeObj = { name: string; color: string };

  // Defining the tags and colors of all possible upgrade levels
  const [ upgradeLevel, setUpgradeLevel ]=useState(initialLevel);

  let upgradeLevelArray: upgradeObj[] = [];
  upgradeLevelArray.push({name:'common', color:'#7f63ff'});
  upgradeLevelArray.push({name:'uncommon', color:'#33bacc'});
  upgradeLevelArray.push({name:'rare', color:'#59bcff'});
  upgradeLevelArray.push({name:'legendary', color:'#ffc36b'});
  upgradeLevelArray.push({name:'mythical', color:'#ff96ff'});
  upgradeLevelArray.push({name:'godlike', color:'#51ffa8'});
  
  //
  const purchaseUpgrade = ()=>{
    if (upgradeLevel<upgradeLevelArray.length-1) {
      setUpgradeLevel(upgradeLevel+1); // TO DO: replace this with an upgrade message to the server if funds are available
    }
  }

  // creatng definition of each of the upgradable levels
  const renderUpgradeLevel = (name: string, color: string, disabled: boolean) => (
    <div className={styles.levelElement} style={{backgroundColor:color}} >
    </div>
  );

  // rendering the array of level elements and storing into one variable
  const upgradeLevels = upgradeLevelArray.map( (upgradeElement , index) => {
    return(  
      ( index<=upgradeLevel ? renderUpgradeLevel( upgradeElement.name, upgradeLevelArray[upgradeLevel].color, false ) : '')  
      );
  });

  return (
    <div className={styles.upgradeBarContainer} style={{top: `${topPosition}%` , left:  `${leftPosition}%` }}>
      {text} <br />
      <button className={styles.upgradeButton}
              onClick={purchaseUpgrade} >
        <div className={styles.upgradeButtonText}>+</div>        
      </button>  
      <div className={styles.levelContainer}>
        {upgradeLevels}
      </div>
      
    </div>
  );
};

export default UpgradeBar;
