import React from 'react';
import gotchiPodium from "assets/svgs/podium.svg"
import styles from './styles.module.css';
import { HighScore } from 'types';
import { number } from 'mathjs';
import GotchiPreview from 'components/GotchiPreview';
import { CustomiseOptions } from 'helpers/aavegotchi';
import { StatisticCategory } from 'chisel-api-interface/lib/Statistics';
import { formatScore } from 'helpers/functions';

interface Props {
  podiumGotchis : Array<HighScore>;
  category: StatisticCategory
}

export const Podium: React.FC<Props> = ({
  podiumGotchis, category
}) => {
    
    const renderGotchi = (id:number, winner:boolean, options?: CustomiseOptions)=>{
      return(
          <GotchiPreview tokenId={`${id}`} options={options} />
        )
    }
    
      
  return (
    <div className={styles.podiumContent}>
        { podiumGotchis.length>2 ? 
        <>
          <div className={styles.gotchiRank1}>
            {renderGotchi(number(podiumGotchis[0].tokenId) as number,true,{armsUp:true})}
          </div>
          <div className={`${styles.podiumText} ${styles.rank1Text}`}>
            {podiumGotchis[0].name}
            <div style={{color:'#ffffff'}} >{formatScore(podiumGotchis[0].score,category)}</div>
          </div>
          <div className={styles.gotchiRank2}>
            {renderGotchi(number(podiumGotchis[1].tokenId) as number,false)}
          </div>
          <div className={`${styles.podiumText} ${styles.rank2Text}`}>
            {podiumGotchis[1].name}
            <div style={{color:'#ffffff'}} >{formatScore(podiumGotchis[1].score,category)}</div>
          </div>
          <div className={styles.gotchiRank3}>
            {renderGotchi(number(podiumGotchis[2].tokenId) as number,false)}
          </div>
          <div className={`${styles.podiumText} ${styles.rank3Text}`}>
            {podiumGotchis[2].name}
            <div style={{color:'#ffffff'}} >{formatScore(podiumGotchis[2].score,category)}</div>
          </div>
        </>
        : ''}
        <img className={styles.gotchiPodium} src={gotchiPodium} alt={'Gotchi Podium'}/>
   </div>
  );
};
