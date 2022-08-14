import useSoundFXManager from "hooks/useSoundFXManager";
import { useEffect, useState } from "react";

const useLowFuel = ( fuel: number ) => {

    const [lowFuel,setLowFuel] = useState(false);
    const soundFXManager = useSoundFXManager();
    
    useEffect(()=>{
        const lowFuelThreshold = 20;
        if (fuel<lowFuelThreshold && lowFuel === false ) {
          soundFXManager.playLowFuel();
          setLowFuel(true);
        } 
        else if (fuel>lowFuelThreshold && lowFuel === true ){
          setLowFuel(false);
        } 
        // eslint-disable-next-line react-hooks/exhaustive-deps
    },[fuel,soundFXManager])

    return { lowFuel }
}

export default useLowFuel