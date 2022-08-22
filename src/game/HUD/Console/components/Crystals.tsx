import styles from "./styles.module.css";
import cargoIcon from "assets/hud/cargo_icon.svg";
import { useContext } from "react";
import { HUDContext } from "game/HUD";

const Crystals = () => {  
  
  const hudContext = useContext(HUDContext);
  const crystalsArray = hudContext.world.crypto;
 
  const inventoryCrystal = (tag: string, quantity: number, image: string) => (
    <div className={styles.crystalContainer} key={`inventory${tag}`}>
      <img src={image} className={`${styles.crystalIcon} 
                                   ${ quantity>0 ? styles.itemEnabled : styles.itemDisabled}`} 
            alt={tag}/>
      <div className={`${styles.crystalTag}
                       ${ quantity>0 ? styles.itemEnabled : styles.itemDisabled}`}>
        {quantity} x {tag}
      </div>
    </div>
  );

  return (
    <div className={styles.cryptoContainer}>
      <div className={styles.sectionTitle}>CARGO</div>
      <img
        src={cargoIcon}
        className={`${styles.cargoIcon} ${styles.iconSelected}`}
        alt={'Cargo'}
      />
      <div className={styles.cryptoGallery}>
        { Object.keys(crystalsArray)
            .filter( (key) => crystalsArray[key].name !== 'GGEMS' )
            .map( function (key) {
              const crypto = crystalsArray[key];
              return inventoryCrystal(
                crypto.name,
                hudContext.player.crystals[crypto.cryptoID],
                crypto.crystal)
            })
        }
      </div>
    </div>
  );
};

export default Crystals;
