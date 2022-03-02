import React, { FC, Fragment, useState } from "react";
import styles from "./styles.module.css"
import * as Chisel from "chisel-api-interface";
import Client from "matchmaking/Client";
import SquareButton from "components/SquareButton";

const TabConsumables: FC<{}> = () => {

  const world: Chisel.DetailedWorld | undefined =   Client.getInstance().chiselWorld;
  
  type shopItem = { name: string; price: number; pattern:any; image: string };

  let shopItemArray: shopItem[] = [];

   // extracting info from Chisel about all possible explosives
   world.explosives.forEach((explosive)=>{
    shopItemArray.push({ 
      name: explosive.name, 
      price: explosive.price, 
      pattern: explosive.explosion_coordinates,
      image: `https://chisel.gotchiminer.rocks/storage/${explosive.drop_image}`
    })
   })

   const [selectedItem, setSelectedItem] = useState(shopItemArray[0]);

   const displaySelectedItem = (item : shopItem) => {
    setSelectedItem(item)
   }

   // TO DO: add also consumables when available to the shopItemArray
  const renderShopItem = (item: shopItem) => (
  <div className={styles.itemContainer} onClick={()=>{ displaySelectedItem(item); console.log('new click!')}}>
      <img src={item.image} className={styles.itemImage} />
      <div className={styles.itemText}>
        {item.name} : {item.price} GHST
      </div>
      <button className={styles.buyButton}> BUY </button>
    </div>
  );

  let shopInventory = shopItemArray.map(function (shopItem) {
    return renderShopItem( shopItem );
  });

  return (
    <div className={styles.contentContainer}>
      <div className={styles.galleryPanel}>
        {shopInventory}
      </div>
      <div className={styles.detailsPanel}>
        <div className={styles.detailsTitle}>
          {selectedItem.name}
        </div>
        <div className={styles.detailsBody}>
          <img src={selectedItem.image} className={styles.itemImage} />
          Price: {selectedItem.price}
          <div className={styles.amountContainer}>
            Amount: 1 
            <button className={styles.buyManyButton}>BUY</button>
          </div>
        </div>
      </div>
    </div>
  );
};
export default TabConsumables;
