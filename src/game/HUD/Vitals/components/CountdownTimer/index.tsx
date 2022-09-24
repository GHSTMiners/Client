import React, { useEffect } from 'react';
import useCountdown from 'hooks/useCountdown';
import styles from './styles.module.css'
//import Client from 'matchmaking/Client'
//import gameEvents from 'game/helpers/gameEvents';


interface Props{
    targetDate : Date
}

const CountdownTimer : React.FC<Props>   = ( { targetDate } ) => {
  const [ minutes, seconds] = useCountdown(targetDate);


  useEffect(()=>{
    if ( minutes<=0 && seconds<=0){
        //console.log('Triggering end game 💀 💀 💀 💀 💀 ')
        //Client.getInstance().phaserGame.events.emit( gameEvents.game.END )
    }
  },[minutes,seconds])

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