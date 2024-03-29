import styles from "./styles.module.css";
import cargoIcon from "assets/hud/cargo_icon.svg";
import { LazyLoadImage } from 'react-lazy-load-image-component';
import { useGlobalStore } from "store";
import { formatCurrency } from "helpers/functions";

const Cargo = () => {  
  
  const worldCrypto = useGlobalStore( state => state.worldCrypto );
  const playerCargo = useGlobalStore( state => state.cargo );
  
  const inventoryCrystal = (tag: string, quantity: number, image: string, price: number) => (
    <div className={styles.crystalContainer} key={`inventory${tag}`}>
      <LazyLoadImage 
            src={image} 
            className={`${styles.crystalIcon} 
                        ${ quantity>0 ? styles.itemEnabled : styles.itemDisabled}`} 
            alt={tag}
            effect={'blur'}/>
      <div className={`${styles.crystalTag}
                       ${ quantity>0 ? styles.itemEnabled : styles.itemDisabled}`}>
        <div>{quantity? quantity : 0} x {tag}</div>
        <div className={styles.cryptoPrice}>{formatCurrency(price)}</div>
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
        { Object.keys(worldCrypto)
            .map( function (key) {
              const crypto = worldCrypto[key];
              return inventoryCrystal(
                crypto.name,
                playerCargo[crypto.cryptoID],
                crypto.crystal,
                crypto.price)
            })
        }
      </div>
    </div>
  );
};

export default Cargo;
