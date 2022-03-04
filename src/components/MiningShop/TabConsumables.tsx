import React, { FC, Fragment, useEffect, useState } from "react";
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
   const [itemQuantity, setItemQuantity] = useState<number>(1);
   const [multipleItemPrice, setmultipleItemPrice] = useState<number>(shopItemArray[0].price);

     // Initializing empty explosive pattern 
  const explosivePatternArrray = [];
  for (let row = -5 ; row < 6 ; row++ ) {
    for (let column = -5 ; column < 6 ; column++ ) {
      explosivePatternArrray.push({x: row, y: column});
    } 
  } 

  let renderExplosivePattern = explosivePatternArrray.map( function(element) {
    return (
      <div className={styles.patternElement} />)
  }
  );

   useEffect(()=>{ 
     setmultipleItemPrice(itemQuantity*selectedItem.price)}
    ,[itemQuantity])
   
   const handleInputChange = ( event : React.ChangeEvent<HTMLInputElement> ) => {
     if (+event.target.value>=0){
      setItemQuantity(+event.target.value);
     }
  }

   const displaySelectedItem = (item : shopItem) => {
    setSelectedItem(item)
    //item.pattern.forEach(()=>{ }) // to do
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
          <img src={selectedItem.image} className={styles.itemImage} />
        </div>
        <div className={styles.detailsBody}>
          <div className={styles.explosivePattern}>
            {renderExplosivePattern}
          </div>
          <div className={styles.amountContainer}>
            <input className={styles.inputQuantity} 
                   type="number" 
                   value={itemQuantity} 
                   onChange={(e)=>{handleInputChange(e)}
                   }/>
            <button className={styles.buyManyButton}>BUY</button>
          </div>
          <div className={styles.totalPrice}>
            Price: {multipleItemPrice}
            </div>
        </div>
      </div>
    </div>
  );
};
export default TabConsumables;
