import { useEffect, useState } from "react";
import ShortcutButon from "./ShortcutButon";
import { useGlobalStore } from "store";

const ConsoleButtons = () => {
    const worldExplosives = useGlobalStore( state => state.worldExplosives );  
    const playerExplosives = useGlobalStore( state => state.explosives )
    const [ explosiveKeys , setExplosivesKeys] = useState(Object.keys(playerExplosives))
    
    
    //console.count('Rendering console buttons:')
    useEffect(()=>{
      
      setExplosivesKeys([...Object.keys(playerExplosives)]);
    },[playerExplosives])

    return ( 
      <>
        <ShortcutButon item={ worldExplosives[+explosiveKeys[0]] } amount={playerExplosives[+explosiveKeys[0]] } index={1} />
        <ShortcutButon item={ worldExplosives[+explosiveKeys[1]] } amount={playerExplosives[+explosiveKeys[1]] } index={2} />
        <ShortcutButon item={ worldExplosives[+explosiveKeys[2]] } amount={playerExplosives[+explosiveKeys[2]] } index={3} />
        <ShortcutButon item={ worldExplosives[+explosiveKeys[3]] } amount={playerExplosives[+explosiveKeys[3]] } index={4} />
      </> 
      )
}

export default ConsoleButtons

