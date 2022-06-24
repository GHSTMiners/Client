import React, { FC, useContext, useEffect, useState } from "react";
import styles from "./styles.module.css"
import * as Chisel from "chisel-api-interface";
import Client from "matchmaking/Client";
import * as Protocol from "gotchiminer-multiplayer-protocol"
import { ShopContext } from ".";
import { IndexedArray } from "types";


const TabConsumables: FC<{}> = () => {
  
  // specific type definition
  type shopItem = { name: string; id: number; price: number; pattern:Chisel.ExplosionCoordinate[]; image: string };
  type patternElement = { x: number; y: number; styleTag: string };
  type indexedShopItem =  {[key: number]: shopItem};

  // global variables
  const world: Chisel.DetailedWorld | undefined =   Client.getInstance().chiselWorld;
  const contextObj = useContext(ShopContext);
  const playerDoekoes = contextObj.currencyBalance;

  // state hooks
  const [ shopItemArray, setShopItemArray ] = useState<indexedShopItem>({});
  const [ selectedItem, setSelectedItem] = useState<shopItem | any>([]);
  const [ itemQuantity, setItemQuantity] = useState<number>(1);
  const [ multipleItemPrice, setmultipleItemPrice] = useState<number>(0);
  const [ emptyPattern , setEmptyPattern] = useState<patternElement[]>([]);
  const [ explosionPattern, setExplosionPattern] = useState<patternElement[]>([]);
  
  useEffect(()=>{
   // extracting info from Chisel about all possible explosives
   world.explosives.forEach((explosive)=>{
    shopItemArray[explosive.id]=({ 
      name: explosive.name,
      id: explosive.id,
      price: explosive.price, 
      pattern: explosive.explosion_coordinates,
      image: `https://chisel.gotchiminer.rocks/storage/${explosive.inventory_image}`
    })
   })
   setShopItemArray({...shopItemArray});
   // Initializing the empty explosive pattern display in the shop
   for (let row = -5 ; row < 6 ; row++ ) {
     for (let column = -5 ; column < 6 ; column++ ) {
       emptyPattern.push({x: row, y: column, styleTag:''});
     } 
   }
   setExplosionPattern([...emptyPattern]);
  },[])
  
  // Updating UI every time the item (quantity or selection) changes
  useEffect(()=>{ 
    setmultipleItemPrice(itemQuantity*selectedItem.price)}
   ,[itemQuantity,selectedItem])

  // rending explosive pattern
  let renderExplosivePattern = explosionPattern.map( function(element,index) {
    return (
      <div className={`${styles.patternElement} 
        ${ (element.styleTag=='explosionElement') ? styles.explosionElement : '' }
        ${ (element.styleTag=='detonationElement') ? styles.detonationElement : '' } `}
        key={`explosivePattern${index}`}>
      </div> )
  });

  const handleInputChange = ( event : React.ChangeEvent<HTMLInputElement> ) => {
    if (+event.target.value>=1){
     setItemQuantity(+event.target.value);
    }
  } 

  const displaySelectedItem = (item : shopItem) => {
   // updating the item selected
   setSelectedItem(item)
   // deep cloning the empty pattern
   let selectedPattern = emptyPattern.map(x => Object.assign({}, x));
   // replicating the stored pattern overwriting every cell
   item.pattern.forEach((explosionCoodinate:Chisel.ExplosionCoordinate)=>{  
     selectedPattern.forEach((element:patternElement)=>{
       if (element.x == explosionCoodinate.x && element.y == explosionCoodinate.y ){
         element.styleTag = 'explosionElement';
       }
       if (element.x == 0 && element.y==0){
         element.styleTag = 'detonationElement';
       }
     })
   })
   // refreshing UI with the updated pattern
   setExplosionPattern(selectedPattern);
  }

  const buyItem = ( id:number , quantity:number) =>{
   let purchaseMessage : Protocol.PurchaseExplosive = new Protocol.PurchaseExplosive;
   purchaseMessage.id = id;
   purchaseMessage.quantity = quantity;
   const serializedMessage = Protocol.MessageSerializer.serialize(purchaseMessage);
   Client.getInstance().colyseusRoom.send(serializedMessage.name,serializedMessage.data);
  }

  // Rendering shop item list
  const renderShopItem = (id: number) => {
    const item = shopItemArray[id];
    return(
      <div className={`${styles.itemContainer}
                      ${playerDoekoes>=item.price? styles.enabledContainer : styles.disabledContainer }`} 
           onClick={()=>{ displaySelectedItem(item); }}
           key={item.name}>
          <img src={item.image} className={styles.itemImage} />
          <div className={styles.itemText}>
            {item.name} : {item.price} GHST
          </div>
          <button className={`${styles.buyButton} 
                              ${playerDoekoes>=item.price? styles.enabledButton : styles.disabledButton }`} 
                  onClick={ ()=>{ buyItem(id,1) } }
                  disabled={playerDoekoes>=item.price? false: true}> 
                  BUY 
          </button>
        </div>
    );
  }

  const shopItemIds = Object.keys(shopItemArray)
  let shopInventory = shopItemIds.map(function (id) {
    return renderShopItem( +id );
  });

  const detailsPanel = () => {
    return(
    <>
      <div className={styles.detailsTitle}>
        <div>{selectedItem.name}</div>
        <img src={selectedItem.image} className={styles.titleImage} />
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
                  onClick={ ()=>{ buyItem(selectedItem.id,itemQuantity)} }
                  disabled={playerDoekoes>=multipleItemPrice? false: true }>
                  BUY
          </button>
        </div>
        <div className={styles.totalPrice}>
          Price: {multipleItemPrice}
        </div>
      </div>
    </>
    )
  };

  return (
    <div className={styles.contentContainer}>
      <div className={styles.galleryPanel}>
        {shopInventory}
      </div>
      <div className={styles.detailsPanel}>
        {selectedItem.name ? detailsPanel() : ''}
      </div>
    </div>
  );
};

export default TabConsumables;

