import { useEffect, useState } from 'react';

const useCountdown = (targetDate: Date , refreshInterval: number) => {
  const countDownDate = new Date(targetDate).getTime();

  const [countDown, setCountDown] = useState(
    countDownDate - new Date().getTime()
  );

  useEffect(() => {
    if (countDownDate <= 0) return

    const interval = setInterval(() => {
      setCountDown(countDownDate - new Date().getTime());
    }, refreshInterval);

    return () => clearInterval(interval);
  }, [countDownDate,refreshInterval]);

  return getReturnValues(countDown);
};

const getReturnValues = (countDown: number) => {
  // calculate time left
  //const days = Math.floor(countDown / (1000 * 60 * 60 * 24));
  //const hours = Math.floor((countDown % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
  const minutes = Math.floor((countDown % (1000 * 60 * 60)) / (1000 * 60));
  const seconds = Math.floor((countDown % (1000 * 60)) / 1000);

  return [ minutes, seconds ];
};

export default useCountdown ;