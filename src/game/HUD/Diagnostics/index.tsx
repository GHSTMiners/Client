import React, { useEffect, useState } from 'react';
import styles from './styles.module.css'
import Client from "matchmaking/Client";
import gameEvents from 'game/helpers/gameEvents';
import useVisible from 'hooks/useVisible';

interface Props{
    hidden : boolean
}

const Diagnostics : React.FC<Props>   = ( { hidden } ) => {
    const [latency,setLatency]=useState(0);
    const elementVisibility = useVisible('diagnostics', !hidden); 

    const updateLatency = (newLatency:number) => {
        setLatency(newLatency);
    }
    
    const updateDisplay = (state:boolean) =>{
        if (state === true){
            Client.getInstance().phaserGame.events.emit('start_polling');
        } else {
            Client.getInstance().phaserGame.events.emit('stop_polling');
        }
    }

    useEffect(()=>{
        Client.getInstance().phaserGame.events.on( gameEvents.diagnostics.SHOW , updateDisplay)
        Client.getInstance().phaserGame.events.on( gameEvents.diagnostics.HIDE , updateDisplay)
        Client.getInstance().phaserGame.events.on('new_latency', updateLatency )

        return () =>{
            Client.getInstance().phaserGame.events.off( gameEvents.diagnostics.SHOW , updateDisplay)
            Client.getInstance().phaserGame.events.off( gameEvents.diagnostics.HIDE , updateDisplay)
            Client.getInstance().phaserGame.events.off('new_latency', updateLatency )  
        }
    },[])

    return(
        <div className={ `${styles.diagnosticsContainer}
                          ${elementVisibility.state? styles.displayOn:styles.displayOff }`}>
            Latency: {latency} ms
        </div>
    )
};

export default Diagnostics