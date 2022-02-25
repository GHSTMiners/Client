import React, { FC, Fragment } from "react";
import styles from "./styles.module.css"
import * as Chisel from "chisel-api-interface";
import Client from "matchmaking/Client";
import SquareButton from "components/SquareButton";

const TabConsumables: FC<{}> = () => {

  const world: Chisel.DetailedWorld | undefined =   Client.getInstance().chiselWorld;
  
  type shopItem = { name: string; price: number; image: string };

  let shopItemArray: shopItem[] = [];

   // extracting info from Chisel about all possible explosives
   world.explosives.forEach((explosive)=>{
    shopItemArray.push({ 
      name: explosive.name, 
      price: explosive.price, 
      image: `https://chisel.gotchiminer.rocks/storage/${explosive.drop_image}`
    })
   })

   // TO DO: add also consumables when available to the shopItemArray
   
  const renderShopItem = (name: string, price: number, image: string) => (
    <div className={styles.itemContainer}>
      <img src={image} className={styles.itemImage} />
      <div className={styles.itemText}>
        {name} : {price} GHST
      </div>
      <button className={styles.buyButton}>
          BUY
        </button>
    </div>
  );

  let shopInventory = shopItemArray.map(function (shopItem) {
    return renderShopItem( shopItem.name, shopItem.price, shopItem.image );
  });

  return (
    <div className={styles.contentContainer}>
      <div className={styles.galleryPanel}>
        {shopInventory}
      </div>
      <div className={styles.detailsPanel}>
        Selected item details
      </div>
    </div>
  );
};
export default TabConsumables;
