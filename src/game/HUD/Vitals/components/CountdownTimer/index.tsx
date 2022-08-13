import React from 'react';
import { useCountdown } from 'hooks/useCountdown';
import styles from './styles.module.css'


interface Props{
    targetDate : Date
}

const CountdownTimer : React.FC<Props>   = ( { targetDate } ) => {
  const [ minutes, seconds] = useCountdown(targetDate);

  function formatDigits(value:number){
    let valueText = String(value);
    if(value<10){
        valueText = '0'+valueText;
    }
    return(valueText)
  }

    return(
        <div className={styles.timerContainer}>
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

export default CountdownTimer