import styles from "./styles.module.css";
import Client from "matchmaking/Client";
import React, { useEffect, useState } from "react";
import * as Chisel from "chisel-api-interface";
import ggemsIcon from "assets/icons/ggems_icon.svg";
import { IndexedArray } from "types";
import useVisible from "hooks/useVisible";
import useWorldCrypto from "hooks/useWorldCrypto";
import usePlayerCrypto from "hooks/usePlayerCrypto";
import sellCrypto from "./helpers/sellCrypto"

interface Props {
  hidden: boolean;
}

const Exchange : React.FC<Props> = ({ hidden }) => {
  
  const { walletBalance, setWalletBalance } = usePlayerCrypto();
  const [cryptoRecord] = useWorldCrypto();
  const exchangeVisibility = useVisible('exchange', !hidden); 
  const [inputValues , setInputValues] = useState<IndexedArray>(walletBalance);
  const world: Chisel.DetailedWorld | undefined =   Client.getInstance().chiselWorld;

  // inializing cargo & wallet ballances to 0 and fetching the list of crypto from Chisel
  useEffect(()=>{
    (Object.keys(cryptoRecord)).forEach((id)=> setWalletBalance( s => {s[+id]=0; return s}) )
    // eslint-disable-next-line react-hooks/exhaustive-deps
  },[cryptoRecord])
  
  useEffect(() => {
    setInputValues( c => { return {...walletBalance}} )
  }, [walletBalance]);

  const handleInputChange = ( event : React.ChangeEvent<HTMLInputElement>, id:number ) => {
    if (+event.target.value>=0 && +event.target.value<=walletBalance[id] ){
      console.log(`changing input to ${event.target.value}`)
      inputValues[id] = +event.target.value;
      let newValues = {...inputValues};
      setInputValues( newValues);
    }
  } 

  const renderCoinEntry = ( id: number ) => {
    const quantity = walletBalance[id];
    const hasCoins = quantity>0;
    const inputTokens = inputValues[id];
    return(
      <div className={styles.coinContainer} key={`coinEntry${id}`}>
        <img src={cryptoRecord[id].image}  alt={cryptoRecord[id].name} className={`${styles.exchangeCoin} ${hasCoins? styles.itemEnabled : styles.itemDisabled}`} />
        <div className={`${styles.coinRowContainer} ${hasCoins? styles.hasCoins : styles.noCoins }`}>
          <div className={styles.exchangeRowText}>
            <div className={styles.tokenValue}>{quantity} x {cryptoRecord[id].name}</div>
            <div  className={styles.ggemsValue}>{Math.round(cryptoRecord[id].price*quantity*10)/10} GGEMS</div>
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
                <div className={styles.playerBalance}>
                  <img src={ggemsIcon} className={styles.ggemsIcon} alt={'GGEMS'}/>
                  {walletBalance[world.world_crypto_id]} x GGEMS
                </div>
                <button className={styles.closeButton} onClick={ exchangeVisibility.hide }>X</button>
              </div>
              <div className={styles.coinList}> 
                {Object.keys(cryptoRecord).map( function (id) {
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