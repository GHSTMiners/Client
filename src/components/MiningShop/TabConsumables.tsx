import React, { FC, Fragment, useEffect, useState } from "react";
import styles from "./styles.module.css"
import * as Chisel from "chisel-api-interface";
import Client from "matchmaking/Client";
import SquareButton from "components/SquareButton";
import { forEachLeadingCommentRange } from "typescript";

const TabConsumables: FC<{}> = () => {

  const world: Chisel.DetailedWorld | undefined =   Client.getInstance().chiselWorld;
  
  type shopItem = { name: string; price: number; pattern:Chisel.ExplosionCoordinate[]; image: string };
  type patternElement = { x: number; y: number; styleTag: string };

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

   const [selectedItem, setSelectedItem] = useState<shopItem | any>([]);
   const [itemQuantity, setItemQuantity] = useState<number>(1);
   const [multipleItemPrice, setmultipleItemPrice] = useState<number>(shopItemArray[0].price);

     // Initializing empty explosive pattern (double definition to avoid pointer problems)
  let emptyPatternArrray: patternElement[] = [];
  let patternArray: patternElement[] = [];
  for (let row = -5 ; row < 6 ; row++ ) {
    for (let column = -5 ; column < 6 ; column++ ) {
      patternArray.push({x: row, y: column, styleTag:''});
      emptyPatternArrray.push({x: row, y: column, styleTag:''});
    } 
  } 

  const [explosionPattern, setExplosionPattern] = useState<patternElement[]>(patternArray);

  let renderExplosivePattern = explosionPattern.map( function(element) {
    return (
      <div className={`${styles.patternElement} 
        ${ (element.styleTag=='explosionElement') ? styles.explosionElement : '' }
        ${ (element.styleTag=='detonationElement') ? styles.detonationElement : '' } `} />)
  }
  );

   useEffect(()=>{ 
     setmultipleItemPrice(itemQuantity*selectedItem.price)}
    ,[itemQuantity,selectedItem])
   
   const handleInputChange = ( event : React.ChangeEvent<HTMLInputElement> ) => {
     if (+event.target.value>=0){
      setItemQuantity(+event.target.value);
     }
  }

   const displaySelectedItem = (item : shopItem) => {
    setSelectedItem(item)
    patternArray = emptyPatternArrray;
    item.pattern.forEach((explosionCoodinate:Chisel.ExplosionCoordinate)=>{
      patternArray.forEach((element:patternElement)=>{
        if (element.x == explosionCoodinate.x && element.y == explosionCoodinate.y ){
          element.styleTag = 'explosionElement';
        }
        if (element.x == 0 && element.y==0){
          element.styleTag = 'detonationElement';
        }
      })
    })
    setExplosionPattern(patternArray);
   }

   // TO DO: add also consumables when available to the shopItemArray
  const renderShopItem = (item: shopItem) => (
  <div className={styles.itemContainer} onClick={()=>{ displaySelectedItem(item); }}>
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

  const detailsPanel = (
    <>
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
    </>
  );

  return (
    <div className={styles.contentContainer}>
      <div className={styles.galleryPanel}>
        {shopInventory}
      </div>
      <div className={styles.detailsPanel}>
        {selectedItem.name ? detailsPanel : ''}
      </div>
    </div>
  );
};
export default TabConsumables;
