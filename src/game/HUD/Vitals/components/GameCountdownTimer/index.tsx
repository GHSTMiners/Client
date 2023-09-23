import React, { useEffect, useState } from 'react';
import useCountdown from 'hooks/useCountdown';
import styles from './styles.module.css'

interface Props{
    targetDate : Date
}

const GameCountdownTimer : React.FC<Props>   = ( { targetDate } ) => {
  const {minutes, seconds} = useCountdown(targetDate,1000);
  const [ isHidden , setIsHidden] = useState(false)

  useEffect(()=>{
    ( (minutes+seconds) <= 0 )? setIsHidden(true) : setIsHidden(false)
  },[minutes,seconds])

  function formatDigits(value:number){
    let valueText = String(value);
    if(value<10){
        valueText = '0'+valueText;
    }
    return(valueText)
  }

    return(
        <div className={styles.timerContainer} hidden={ isHidden }>
            <span className={styles.minutesLeft}>
                {formatDigits(minutes)[0]}
            </span>
            <span className={styles.minutesRight}>
                {formatDigits(minutes)[1]}
            </span>
            <span className={styles.secondsLeft}>
                {formatDigits(seconds)[0]}
            </span>
            <span className={styles.secondsRight}>
                {formatDigits(seconds)[1]}
            </span>
        </div>
    )
};

export default GameCountdownTimer