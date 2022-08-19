import React, { FC, useContext, useEffect, useState } from "react";
import styles from "./styles.module.css"
import * as Chisel from "chisel-api-interface";
import Client from "matchmaking/Client";
import { HUDContext } from "game/HUD";
import { ShopItem } from "types";
import buyItem from "../helpers/buyItem";

const TabConsumables: FC<{}> = () => {

  // global variables
  const world: Chisel.DetailedWorld | undefined =   Client.getInstance().chiselWorld;
  const hudContext = useContext(HUDContext);
  const playerDoekoes = hudContext.player.crypto[world.world_crypto_id];
  const [ selectedItem, setSelectedItem ] = useState<ShopItem>({} as ShopItem);
  const [ hoverItem, setHoverItem ] = useState<ShopItem >({} as ShopItem);
  const [ detailsItem , setDetailsItem ] = useState<ShopItem>({} as ShopItem)
  const [ itemQuantity, setItemQuantity ] = useState<number>(1);
  const [ multipleItemPrice, setmultipleItemPrice ] = useState<number>(0);
  const [ emptyPattern ] = useState<Chisel.ExplosionCoordinate[]>([]);
    
   // Initializing the empty explosive pattern display in the shop
  useEffect(()=>{
   for (let row = -5 ; row < 6 ; row++ ) {
     for (let column = -5 ; column < 6 ; column++ ) {
       emptyPattern.push({id:0, explosive_id: 0, x: row, y: column});
     } 
   }
  },[emptyPattern])
  
  // Updating UI every time the item (quantity or selection) changes
  useEffect(()=>{ 
    setmultipleItemPrice(itemQuantity*detailsItem.price)}
   ,[itemQuantity,detailsItem])

   // Updating UI when there is on-hover changes only when there is no selection
   useEffect(()=>{
    if (selectedItem.id) {
      setDetailsItem(selectedItem)
    } else {
      if (hoverItem.id){
        setDetailsItem(hoverItem)
      }
    }
  },[hoverItem,selectedItem])
 
  const handleInputChange = ( event : React.ChangeEvent<HTMLInputElement> ) => {
    if (+event.target.value>=1){
     setItemQuantity(+event.target.value);
    }
  } 

  const renderExplosivePattern = emptyPattern.map( function(element,index) {
    let isExplosion = false;
    if (detailsItem.pattern){
      detailsItem.pattern.forEach( explosion => (explosion.x === element.x && explosion.y === element.y )? isExplosion=true : '' )
    }  
    return (
      <div className={`${styles.patternElement} 
            ${ (element.x === 0 && element.y === 0) ? styles.explosionElement : '' }
            ${ isExplosion ? styles.detonationElement : '' } `}
        key={`explosivePattern${index}`}>
      </div> )
  });

  // Rendering shop item list
  const renderShopItem = (id: number) => {
    const item = hudContext.world.explosives[id];
    const isSelected = selectedItem.id === id;
    return(
      <div className={`${styles.itemContainer}
                      ${playerDoekoes>=item.price? styles.enabledContainer : styles.disabledContainer }
                      ${isSelected? styles.selectedContainer : ''} `} 
           onClick={()=>setSelectedItem(item)}
           key={item.name}
           onMouseEnter={()=>setHoverItem(item)}
           onMouseLeave={()=>setHoverItem({} as ShopItem)}>
          <img src={item.image} className={styles.itemImage} alt={item.name}/>
          <div className={styles.itemText}>
            {item.name} : {item.price} GGEMS
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

  const detailsPanel = () => {
    return(
    <>
      <div className={styles.detailsTitle}>
        <div>{detailsItem.name}</div>
        <img src={detailsItem.image} className={styles.titleImage} alt={detailsItem.name}/>
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
                  onClick={ ()=>{ buyItem(detailsItem.id,itemQuantity)} }
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
        { Object.keys( hudContext.world.explosives ).map( (id) => renderShopItem( +id ) )}
      </div>
      <div className={styles.detailsPanel}>
        {detailsItem.name ? detailsPanel() : ''}
      </div>
    </div>
  );
};

export default TabConsumables;

