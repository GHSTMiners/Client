import { useContext, useEffect, useState } from "react";
import ShortcutButon from "./ShortcutButon";
import { HUDContext } from "game/HUD";
import { useGlobalStore } from "hooks/useGlobalStore";

const ConsoleButtons = () => {
    const hudContext = useContext(HUDContext);
    const [ explosiveKeys , setExplosivesKeys] = useState(Object.keys(hudContext.player.explosives))
    const worldExplosives = useGlobalStore( state => state.worldExplosives );
    
    //console.count('Rendering console buttons:')
    useEffect(()=>{
      
      setExplosivesKeys([...Object.keys(hudContext.player.explosives)]);
    },[hudContext.player.explosives])

    return ( 
      <>
        <ShortcutButon item={ worldExplosives[+explosiveKeys[0]] } amount={hudContext.player.explosives[+explosiveKeys[0]] } index={1} />
        <ShortcutButon item={ worldExplosives[+explosiveKeys[1]] } amount={hudContext.player.explosives[+explosiveKeys[1]] } index={2} />
        <ShortcutButon item={ worldExplosives[+explosiveKeys[2]] } amount={hudContext.player.explosives[+explosiveKeys[2]] } index={3} />
        <ShortcutButon item={ worldExplosives[+explosiveKeys[3]] } amount={hudContext.player.explosives[+explosiveKeys[3]] } index={4} />
      </> 
      )
}

export default ConsoleButtons

