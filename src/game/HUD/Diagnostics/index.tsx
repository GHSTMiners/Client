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
    console.count('Rendering diagnostics: ')
    const updateLatency = (newLatency:number) => {
        setLatency(newLatency);
    }
    
    const updateDisplay = (state:boolean) =>{
        if (state === true){
            Client.getInstance().phaserGame.events.emit( gameEvents.diagnostics.START );
        } else {
            Client.getInstance().phaserGame.events.emit( gameEvents.diagnostics.STOP );
        }
    }

    useEffect(()=>{
        if (elementVisibility.state){
            Client.getInstance().phaserGame.events.on( gameEvents.diagnostics.SHOW , updateDisplay)
            Client.getInstance().phaserGame.events.on( gameEvents.diagnostics.HIDE , updateDisplay)
            Client.getInstance().phaserGame.events.on( gameEvents.diagnostics.LATENCY , updateLatency )

            return () =>{
                Client.getInstance().phaserGame.events.off( gameEvents.diagnostics.SHOW , updateDisplay)
                Client.getInstance().phaserGame.events.off( gameEvents.diagnostics.HIDE , updateDisplay)
                Client.getInstance().phaserGame.events.off( gameEvents.diagnostics.LATENCY, updateLatency )  
            }
        }
    },[elementVisibility.state])

    return(
        <div className={ `${styles.diagnosticsContainer}
                          ${elementVisibility.state? styles.displayOn:styles.displayOff }`}>
            Latency: {latency}ms ;
            FPS : {Math.round(Client.getInstance().phaserGame?.loop.actualFps)}
        </div>
    )
};

export default React.memo(Diagnostics)