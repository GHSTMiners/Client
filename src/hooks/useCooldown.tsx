import { useEffect, useState } from 'react';

const useCooldown = ( targetDate: Date , totalCooldown: number ) => {
  const targetTime = new Date(targetDate).getTime();
  const [countDown, setCountDown] = useState( 0 );
  const [ cooldownProgress, setCooldownProgress]= useState(0);
  const secondsLeft = Math.floor( countDown / 100 ) / 10;

  useEffect(()=>{
    setCountDown( new Date(targetDate).getTime() - new Date().getTime() )
  },[targetDate])

  useEffect(() => {
    if (countDown <= 0) return
    const refreshInterval = 25; // (ms)

    const interval = setInterval(() => {
      setCountDown(targetTime - new Date().getTime());
    }, refreshInterval);

    setCooldownProgress( ((totalCooldown-(countDown/1000))/totalCooldown)*100 )

    return () => clearInterval(interval);
  }, [ targetTime, countDown, totalCooldown ]);

  return [ secondsLeft , cooldownProgress ];
};

export default useCooldown ;