import React from 'react';
import { GotchiSVG} from "components";
import gotchiPodium from "assets/svgs/podium.svg"
import styles from './styles.module.css';
import { HighScore } from 'types';
import { number } from 'mathjs';

interface Props {
  podiumGotchis : Array<HighScore>;
}

export const Podium: React.FC<Props> = ({
  podiumGotchis
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
          {renderGotchi(number(podiumGotchis[0].tokenId) as number,true)}
        </div>
        <div className={`${styles.podiumText} ${styles.rank1Text}`}>
          {podiumGotchis[0].name}
          <div style={{color:'#ffffff'}} >{podiumGotchis[0].score}</div>
        </div>
        <div className={styles.gotchiRank2}>
          {renderGotchi(number(podiumGotchis[1].tokenId) as number,false)}
        </div>
        <div className={`${styles.podiumText} ${styles.rank2Text}`}>
          {podiumGotchis[1].name}
          <div style={{color:'#ffffff'}} >{podiumGotchis[1].score}</div>
        </div>
        <div className={styles.gotchiRank3}>
          {renderGotchi(number(podiumGotchis[2].tokenId) as number,false)}
        </div>
        <div className={`${styles.podiumText} ${styles.rank3Text}`}>
          {podiumGotchis[2].name}
          <div style={{color:'#ffffff'}} >{podiumGotchis[2].score}</div>
        </div>
        <img className={styles.gotchiPodium} src={gotchiPodium} />
   </div>
  );
};
