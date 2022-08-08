import { useContext, useEffect, useState } from "react";
import renderConsumable from "../helpers/renderConsumable";
import { HUDContext } from "game/HUD";

const useConsoleButtons = () => {
    // state variables
    const playerConsumables = useContext(HUDContext);
    const [renderedButtons , setRenderedButtons] = useState([] as JSX.Element[]);

    // UI
    useEffect(()=>{  
        const numberOfButtons = 4; // defined depending on the UI
        let updatedButtons = [];
        for (let i = 0; i < numberOfButtons; i++) {
          updatedButtons.push( renderConsumable( playerConsumables[i], i+1) )
        }
        setRenderedButtons( updatedButtons );
      },[playerConsumables])

    return { renderedButtons }
}

export default useConsoleButtons

