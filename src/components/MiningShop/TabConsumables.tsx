import React, { FC, useContext, useEffect, useState } from "react";
import styles from "./styles.module.css"
import * as Chisel from "chisel-api-interface";
import Client from "matchmaking/Client";
import * as Protocol from "gotchiminer-multiplayer-protocol"
import { ShopContext } from ".";


const TabConsumables: FC<{}> = () => {
  
  type shopItem = { name: string; id: number, price: number; pattern:Chisel.ExplosionCoordinate[]; image: string };
  type patternElement = { x: number; y: number; styleTag: string };

  const world: Chisel.DetailedWorld | undefined =   Client.getInstance().chiselWorld;

  let shopItemArray: shopItem[] = [];

   // extracting info from Chisel about all possible explosives
   world.explosives.forEach((explosive)=>{
    shopItemArray.push({ 
      name: explosive.name,
      id: explosive.id, 
      price: explosive.price, 
      pattern: explosive.explosion_coordinates,
      image: `https://chisel.gotchiminer.rocks/storage/${explosive.drop_image}`
    })
   })

   const [selectedItem, setSelectedItem] = useState<shopItem | any>([]);
   const [itemQuantity, setItemQuantity] = useState<number>(1);
   const [multipleItemPrice, setmultipleItemPrice] = useState<number>(shopItemArray[0].price);
   const playerDoekoes = useContext(ShopContext);

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
        ${ (element.styleTag=='detonationElement') ? styles.detonationElement : '' } `}>
      </div> )
  }
  );

   useEffect(()=>{ 
     setmultipleItemPrice(itemQuantity*selectedItem.price)}
    ,[itemQuantity,selectedItem])
   
   const handleInputChange = ( event : React.ChangeEvent<HTMLInputElement> ) => {
     if (+event.target.value>=1){
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

   const buyItem = ( item:shopItem , quantity:number) =>{
    let purchaseMessage : Protocol.PurchaseExplosive = new Protocol.PurchaseExplosive;
    purchaseMessage.id = item.id;
    purchaseMessage.quantity = quantity;
    const serializedMessage = Protocol.MessageSerializer.serialize(purchaseMessage);
    Client.getInstance().colyseusRoom.send(serializedMessage.name,serializedMessage.data);
   }

   // TO DO: add also consumables when available to the shopItemArray
  const renderShopItem = (item: shopItem) => (
  <div className={`${styles.itemContainer}
                  ${playerDoekoes>=item.price? styles.enabledContainer : styles.disabledContainer }`} 
       onClick={()=>{ displaySelectedItem(item); }}>
      <img src={item.image} className={styles.itemImage} />
      <div className={styles.itemText}>
        {item.name} : {item.price} GHST
      </div>
      <button className={`${styles.buyButton} 
                          ${playerDoekoes>=item.price? styles.enabledButton : styles.disabledButton }`} 
              onClick={ ()=>{buyItem(item,1)} }
              disabled={playerDoekoes>=item.price? false: true}> 
              BUY 
      </button>
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
          <button className={`${styles.buyManyButton} 
                            ${playerDoekoes>=multipleItemPrice? styles.enabledButton : styles.disabledButton }` }
                  disabled={playerDoekoes>=multipleItemPrice? false: true }>
                  BUY
          </button>
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

