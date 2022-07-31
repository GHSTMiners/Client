import React, { useEffect, useState } from 'react';
import styles from './styles.module.css'
import Client from "matchmaking/Client";

interface Props{
    hidden : boolean
}

const Diagnostics : React.FC<Props>   = ( { hidden } ) => {
    const [latency,setLatency]=useState(0);
    const [showDiagnostics,setShowDiagnostics] = useState<boolean>(!hidden);

    const updateLatency = (newLatency:number) => {
        setLatency(newLatency);
    }

    const updateDisplay = (state:boolean) =>{
        setShowDiagnostics(state);
        if (state === true){
            Client.getInstance().phaserGame.events.emit('start_polling');
        } else {
            Client.getInstance().phaserGame.events.emit('stop_polling');
        }
    }

    useEffect(()=>{
        Client.getInstance().phaserGame.events.on("joined_game", () => {
            Client.getInstance().phaserGame.events.on('new_latency', updateLatency )
            Client.getInstance().phaserGame.events.on('open_diagnostics', () => updateDisplay(true) )
            Client.getInstance().phaserGame.events.on('close_dialogs', () => updateDisplay(false)  );
            Client.getInstance().phaserGame.events.emit('start_polling');  // automatically start checking latency by default
        })
    },[])

    return(
        <div className={ `${styles.diagnosticsContainer}
                          ${showDiagnostics? styles.displayOn:styles.displayOff }`}>
            Latency: {latency} ms
        </div>
    )
};

export default Diagnostics