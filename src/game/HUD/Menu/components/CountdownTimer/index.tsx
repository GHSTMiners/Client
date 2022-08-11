import React from 'react';
import { useCountdown } from 'hooks/useCountdown';
import styles from './styles.module.css'


interface Props{
    targetDate : Date
}

const CountdownTimer : React.FC<Props>   = ( { targetDate } ) => {
  const [ minutes, seconds] = useCountdown(targetDate);

    return(
        <div className={styles.timerContainer}>
            {minutes} : {(seconds<10)? `0${seconds}`: seconds}
        </div>
    )
};

export default CountdownTimer