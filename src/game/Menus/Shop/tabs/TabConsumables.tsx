import React, { FC, useEffect, useState } from "react";
import styles from "./styles.module.css"
import { ConsumableItem } from "types";
import buyConsumable from "../helpers/buyConsumable";
import { LazyLoadImage } from 'react-lazy-load-image-component';
import { useGlobalStore } from "store";
import InfoMessage from "../components/InfoMessage";

const TabConsumables: FC<{}> = () => {

  // global variables
  const wallet = useGlobalStore( state => state.wallet );
  const consumables = useGlobalStore( state => state.consumables );
  const worldCrypto = useGlobalStore( state => state.worldCrypto );
  const worldConsumables = useGlobalStore( state => state.worldConsumables );
  const [ selectedItem, setSelectedItem ] = useState<ConsumableItem>({} as ConsumableItem);
  const [ hoverItem, setHoverItem ] = useState<ConsumableItem >({} as ConsumableItem);
  const [ detailsItem , setDetailsItem ] = useState<ConsumableItem>({} as ConsumableItem)
  const [ itemQuantity, setItemQuantity ] = useState<number>(1);
  const [ multipleItemPrice, setmultipleItemPrice ] = useState<number>(0);
  
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

  // Rendering shop item list
  const renderShopItem = (id: number) => {
    const item = worldConsumables[id];
    const isSelected = selectedItem.id === id;
    let itemsLeft = item.purchase_limit;
    if ((item.id in consumables) && item.purchase_limit)  itemsLeft = item.purchase_limit - consumables[item.id].amountPurchased ;
    return(
      <div className={`${styles.itemContainer}
                      ${wallet[item.crypto_id]>=item.price? styles.enabledContainer : styles.disabledContainer }
                      ${isSelected? styles.selectedContainer : ''} `} 
           onClick={()=>setSelectedItem(item)}
           key={item.name}
           onMouseEnter={()=>setHoverItem(item)}
           onMouseLeave={()=>setHoverItem({} as ConsumableItem)}>
          <LazyLoadImage src={item.image} className={styles.itemImage} alt={item.name} loading='lazy'/>
          <div className={styles.itemText}>
            {item.name} 
            <LazyLoadImage src={worldCrypto[item.crypto_id].image} 
                className={`${styles.cryptoThumbnail}
                            ${wallet[item.crypto_id]>=item.price? styles.coinAvailable : styles.coinUnavailable }`} 
                alt={worldCrypto[item.crypto_id].name}
                effect={'blur'}/>
            {item.price} 
          </div>
          <button className={`${styles.buyButton} 
                              ${(wallet[item.crypto_id]>=item.price && (itemsLeft && itemsLeft>=1) )? styles.enabledButton : styles.disabledButton }`} 
                  onClick={ ()=>{ buyConsumable(id,1) } }
                  disabled={(wallet[item.crypto_id]>=item.price && (itemsLeft && itemsLeft>=1 ))? false: true}> 
                  BUY 
          </button>
        </div>
    );
  }

  const detailsPanel = () => {
    let itemsLeft = detailsItem.purchase_limit;
    if ((detailsItem.id in consumables) && detailsItem.purchase_limit)  itemsLeft = detailsItem.purchase_limit - consumables[detailsItem.id].amountPurchased ;
    return(
    <>
      <div className={styles.detailsTitle}>
        <div>{detailsItem.name}</div>
        <LazyLoadImage src={detailsItem.image} className={styles.titleImage} alt={detailsItem.name} loading='lazy'/>
      </div>
      <div className={styles.detailsBody}>
        <div className={styles.itemDescription}>
          {detailsItem.description}
        </div>
        <div className={styles.amountContainer}>
          <input className={styles.inputQuantity} 
                 type="number" 
                 value={itemQuantity} 
                 onChange={(e)=>{handleInputChange(e)}
                 }/>
          <button className={`${styles.buyManyButton} 
                            ${(wallet[detailsItem.crypto_id]>=multipleItemPrice && (itemsLeft && itemsLeft>=itemQuantity ) )? styles.enabledButton : styles.disabledButton }` }
                  onClick={ ()=>{ buyConsumable(detailsItem.id,itemQuantity)} }
                  disabled={(wallet[detailsItem.crypto_id]>=multipleItemPrice && (itemsLeft && itemsLeft>=itemQuantity ) )? false: true }>
                  BUY
          </button>
        </div>
        <div className={styles.totalPrice}>
          Price
          <LazyLoadImage src={worldCrypto[detailsItem.crypto_id].image} 
              className={`${styles.cryptoThumbnail}
              ${wallet[detailsItem.crypto_id]>=multipleItemPrice? styles.coinAvailable : styles.coinUnavailable }`} 
              alt={worldCrypto[detailsItem.crypto_id].name}
              loading='lazy'/>
          {multipleItemPrice}
        </div>
        <div className={styles.itemsAvailable}>
          {detailsItem.purchase_limit && (detailsItem.purchase_limit>0)? `${itemsLeft} item(s) available` : ''}
        </div>
      </div>
    </>
    )
  };

  return (
    <div className={styles.contentContainer}>
      <div className={styles.galleryPanel}>
        { Object.keys( worldConsumables ).map( (id) => renderShopItem( +id ) )}
      </div>
      <div className={styles.detailsPanel}>
        {detailsItem.name && detailsPanel()}
        <InfoMessage hidden={detailsItem.name? true: false}/>
      </div>
    </div>
  );
};

export default TabConsumables;

