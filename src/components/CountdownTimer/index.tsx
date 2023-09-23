import React, { useEffect, useState } from 'react';
import useCountdown from 'hooks/useCountdown';
import styles from './styles.module.css'

interface Props{
    targetDate : Date
}

const CountdownTimer : React.FC<Props>   = ( { targetDate } ) => {
  const { days, hours, minutes, seconds} = useCountdown(targetDate,1000);
  const [ isOver , setIsOver] = useState(false)

  useEffect(()=>{
    ( (days+hours+minutes+seconds) <= 0 )? setIsOver(true) : setIsOver(false)
  },[days,hours,minutes,seconds])

  function renderDigits(time:number,tag:string){
    return(
      <div>
        <div className={styles.number}>{time}</div>
        <div className={styles.textTag}>{`${tag}${(time!==1)? 's':''}`}</div>
      </div>
    )
  }

    return(
        <div className={styles.timerContainer}>
            {!isOver && 
            <>
              {renderDigits(days,'day')}
              {renderDigits(hours,'hour')}
              {renderDigits(minutes,'minute')}
              {renderDigits(seconds,'second')}
            </>}
            { isOver && 'The Competition is now OVER 🎮❌'}
        </div>
    )
};

export default CountdownTimer