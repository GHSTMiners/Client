import { CryptoObj } from "types";
import styles from "../styles.module.css"

const renderCoinEntry = ( quantity: number, coin: CryptoObj) => {
    /*
    const hasCoins = quantity>0;
    return(
      <div className={styles.coinContainer} key={`coinEntry${coin.cryptoID}`}>
        <img src={coin.image}  alt={coin.name} className={`${styles.exchangeCoin} ${hasCoins? styles.itemEnabled : styles.itemDisabled}`} />
        <div className={`${styles.coinRowContainer} ${hasCoins? styles.hasCoins : styles.noCoins }`}>
          <div className={styles.exchangeRowText}>
            <div className={styles.tokenValue}>{quantity} x {coin.name}</div>
            <div  className={styles.ggemsValue}>{Math.round(coin.price*quantity*10)/10} GGEMS</div>
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
    )*/
  }