import { useEffect, useState } from "react";
import ShortcutButon from "./ShortcutButon";
import { useGlobalStore } from "store";

const buttonsSetup = [
  { id: 0 , shortcut: 1 },
  { id: 1 , shortcut: 2 },
  { id: 2 , shortcut: 3 },
  { id: 3 , shortcut: 4 }
]

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
        { buttonsSetup.map( button => 
            <ShortcutButon 
                item={ worldExplosives[+explosiveKeys[button.id]] } 
                amount={ playerExplosives[+explosiveKeys[button.id]] } 
                index={ button.shortcut }
              />
        )}
      </> 
      )
}

export default ConsoleButtons

