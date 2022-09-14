import styles from "./styles.module.css";
import cargoIcon from "assets/hud/cargo_icon.svg";
import { useContext } from "react";
import { HUDContext } from "game/HUD";
import { LazyLoadImage } from 'react-lazy-load-image-component';
import { useGlobalStore } from "hooks/useGlobalStore";

const Crystals = () => {  
  
  const hudContext = useContext(HUDContext);
  //const crystalsArray = hudContext.world.crypto;
  const crystalsArray = useGlobalStore( state => state.worldCrypto );
  
  const inventoryCrystal = (tag: string, quantity: number, image: string) => (
    <div className={styles.crystalContainer} key={`inventory${tag}`}>
      <LazyLoadImage 
            src={image} 
            className={`${styles.crystalIcon} 
                        ${ quantity>0 ? styles.itemEnabled : styles.itemDisabled}`} 
            alt={tag}
            effect={'blur'}/>
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
