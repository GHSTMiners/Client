import ShortcutButon from "./ShortcutButon";
import { useGlobalStore } from "store";
import { ItemTypes } from "helpers/vars";
import { ConsumableSchema } from "types";

const buttonsSetup = [
  { shortcut: 1 },
  { shortcut: 2 },
  { shortcut: 3 },
  { shortcut: 4 },
  { shortcut: 5 }
]

const ConsoleButtons = () => {
    const userShortcuts = useGlobalStore(state => state.userShortcuts )
    const explosives = useGlobalStore( state => state.explosives ) 
    const consumables = useGlobalStore( state => state.consumables )

    return ( 
      <>
        { buttonsSetup.map( button => {
            const item =  userShortcuts[button.shortcut];
            let consumableSchema = {} as ConsumableSchema;
            consumableSchema.amount = 0;
            switch (item?.type){
              case ItemTypes.Explosive: 
                if(explosives[item.id]) consumableSchema = explosives[item.id];
                break;
              case ItemTypes.Consumable: 
                if(consumables[item.id]) consumableSchema = consumables[item.id];
                break;
              default:
                break;  
            }
            return(
              <ShortcutButon 
                  item={ item } 
                  amount={  consumableSchema.amount } 
                  index={ button.shortcut }
                  key= {`shortcut${button.shortcut}`}
                />
            ) 
            })}
      </> 
    )
}

export default ConsoleButtons

