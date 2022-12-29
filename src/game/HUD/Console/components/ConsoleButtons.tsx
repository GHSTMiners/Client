import ShortcutButon from "./ShortcutButon";
import { useGlobalStore } from "store";

const buttonsSetup = [
  { shortcut: 1 },
  { shortcut: 2 },
  { shortcut: 3 },
  { shortcut: 4 }
]

const ConsoleButtons = () => {
    const userShortcuts = useGlobalStore(state => state.userShortcuts )
    const playerExplosives = useGlobalStore(state => state.explosives)
    return ( 
      <>
        { buttonsSetup.map( button => 
            <ShortcutButon 
                item={ userShortcuts[button.shortcut] } 
                amount={  playerExplosives[+userShortcuts[button.shortcut]?.id] } 
                index={ button.shortcut }
                key= {`shortcut${button.shortcut}`}
              /> )}
      </> 
    )
}

export default ConsoleButtons

