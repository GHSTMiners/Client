import styles from "./styles.module.css";
import Client from "matchmaking/Client";
import React, { useEffect, useState } from "react";
import * as Chisel from "chisel-api-interface";
import { IndexedArray } from "types";
import useVisible from "hooks/useVisible";
import sellCrypto from "./helpers/sellCrypto"
import { useGlobalStore } from "store";

interface Props {
  hidden: boolean;
}

const Exchange : React.FC<Props> = ({ hidden }) => {

  const wallet = useGlobalStore( state => state.wallet );
  const cryptoRecord = useGlobalStore( state => state.worldCrypto );
  const exchangeVisibility = useVisible('exchange', !hidden); 
  const [inputValues , setInputValues] = useState<IndexedArray>(wallet);
  const world: Chisel.DetailedWorld | undefined =   Client.getInstance().chiselWorld;
  
  useEffect(() => {
    setInputValues( c => { return {...wallet}} )
  }, [wallet]);

  const handleInputChange = ( event : React.ChangeEvent<HTMLInputElement>, id:number ) => {
    if (+event.target.value>=0 && +event.target.value<=wallet[id] ){
      inputValues[id] = +event.target.value;
      let newValues = {...inputValues};
      setInputValues( newValues);
    }
  } 

  const renderCoinEntry = ( id: number ) => {
    const quantity = wallet[id];
    const hasCoins = quantity>0;
    const inputTokens = inputValues[id];
    return(
      <div className={styles.coinContainer} key={`coinEntry${id}`}>
        <img src={cryptoRecord[id].image}  alt={cryptoRecord[id].name} className={`${styles.exchangeCoin} ${hasCoins? styles.itemEnabled : styles.itemDisabled}`} />
        <div className={`${styles.coinRowContainer} ${hasCoins? styles.hasCoins : styles.noCoins }`}>
          <div className={styles.exchangeRowText}>
            <div className={styles.tokenValue}>{quantity} x {cryptoRecord[id].name}</div>
            <div  className={styles.ggemsValue}>{Math.round(cryptoRecord[id].price*quantity*10)/10} DAI</div>
          </div>
          <input className={`${styles.inputQuantity} ${inputValues[id]>0? '': styles.emptyInput }`} 
                 type="number" 
                 value={inputTokens} 
                 onChange={(e)=>{handleInputChange(e,id)}
                 }/>
        </div>
        
        <button className={`${styles.sellButton} ${hasCoins? styles.enabledButton: styles.disabledButton}`}
                onClick={ () => sellCrypto(id,inputTokens) } > SELL </button> 
      </div>
    )
  }
     
  return (
    <>
      <div  id="exchange" 
            className={`${styles.exchangeContainer}
                       ${exchangeVisibility.state? styles.displayOn:styles.displayOff }`}>
          <div>
            <div className={styles.exchangeDisplayContainer}>
              <div className={styles.exchangeHeader} key={'exchangeHeader'}>
                <h2>WALLET</h2>

                <button className={styles.closeButton} onClick={ exchangeVisibility.hide }>X</button>
              </div>
              <div className={styles.coinList}> 
                {Object.keys(cryptoRecord)
                .sort( (prev,next) => wallet[next] - wallet[prev])
                .map( function (id) {
                    return +id===world.world_crypto_id ? '' : renderCoinEntry(+id);
                  })} 
              </div>
            </div>
          </div>
      </div>
    </>
  );
};

export default Exchange