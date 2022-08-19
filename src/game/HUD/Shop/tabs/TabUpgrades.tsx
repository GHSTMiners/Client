import { useState } from "react";
import styles from "./styles.module.css";
import UpgradeBar from "game/HUD/Shop/components/UpgradeBar";
import buyUpgrade from "../helpers/buyUpgrade";
import { UpgradePriceObject } from "types";
import useWorldUpgrades from "hooks/useWorldUpgrades";
import usePlayerUpgrades from "hooks/usePlayerUpgrades";
import usePlayerGotchi from "hooks/usePlayerGotchi";
  
const TabUpgrades = () => {
  const [ hoverUpgrade , setHoverUpgrade] = useState({} as UpgradePriceObject);
  const [ selectedUpgrade ] = useState({} as UpgradePriceObject);
  const { playerGotchi } = usePlayerGotchi();
  const { worldUpgrades } = useWorldUpgrades();
  const {currentTiers} = usePlayerUpgrades();

  function renderUpgradeElement ( obj: UpgradePriceObject , upgradeTier: number) {
    const isSelected = (obj.id === selectedUpgrade.id);
    const nextTier = upgradeTier + 1;
    const upgradeCost = obj.costPerTier.find(entry => entry.tierLabel === `tier_${nextTier}`)?.priceList;
    return  (
      <div className={`${styles.upgradesContainer} ${isSelected? styles.selectedUpgrade : '' }`} 
            key={`${obj.name}_container`}
            onMouseEnter={()=>setHoverUpgrade(obj)}
            onMouseLeave={()=>setHoverUpgrade(obj)}>
        <UpgradeBar upgradeId={obj.id}
                    upgradeLabel={obj.name} 
                    upgradeCost={upgradeCost} 
                    currentTier={nextTier-1}
                    purchaseCallback={ ()=>{ buyUpgrade(obj.id,nextTier) } }/>
      </div>
    )
  }

  return (
    <div className={styles.contentContainer}>
      <div className={styles.upgradePanel}>
        <div className={styles.upgradesList}>
          { worldUpgrades.map( function(entry) { 
            return(  
              renderUpgradeElement(entry,currentTiers[entry.id])  
              )}
            )}
        </div>
        
      </div>
      <div className={styles.detailsPanel}>
        {hoverUpgrade? hoverUpgrade.description: selectedUpgrade.description}
        <img src={playerGotchi} className={styles.gotchiPreview} alt={'My Gotchi'}></img>
      </div>
    </div>
  );
};
export default TabUpgrades;