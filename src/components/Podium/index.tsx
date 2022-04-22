import React from 'react';
import { GotchiSVG} from "components";
import gotchiPodium from "assets/svgs/podium.svg"
import styles from './styles.module.css';

interface Props {
  gotchiIDs: number[];
}

export const Podium: React.FC<Props> = ({
    gotchiIDs
}) => {
    
    const renderGotchi = (id:number, winner:boolean)=>{
        return(
          <GotchiSVG tokenId={`${id}`}  
          options={{ animate: true, removeBg: true, armsUp:winner }}
          />
        )
    }
    
      
  return (
    <div className={styles.podiumContent}>
        <div className={styles.gotchiRank1}>
          {renderGotchi(gotchiIDs[0],true)}
        </div>
        <div className={`${styles.podiumText} ${styles.rank1Text}`}>
          Martens
          <div style={{color:'#ffffff'}} >420</div>
        </div>
        <div className={styles.gotchiRank2}>
          {renderGotchi(gotchiIDs[1],false)}
        </div>
        <div className={`${styles.podiumText} ${styles.rank2Text}`}>
          Corelone
          <div style={{color:'#ffffff'}} >169</div>
        </div>
        <div className={styles.gotchiRank3}>
          {renderGotchi(gotchiIDs[2],false)}
        </div>
        <div className={`${styles.podiumText} ${styles.rank3Text}`}>
          Yoda
          <div style={{color:'#ffffff'}} >101</div>
        </div>
        <img className={styles.gotchiPodium} src={gotchiPodium} />
   </div>
  );
};
