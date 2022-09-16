import { useEffect, useState } from "react";
import Client from "matchmaking/Client";
import gameEvents from "game/helpers/gameEvents";
import { IndexedArray } from "types";

const usePlayerCargo = () => {

    const [balance, setBalance] = useState<IndexedArray>({});

    useEffect(()=>{
        /*
        const updateCargo = (id:number,value:number) => {
            setBalance( (wallet:IndexedArray) => { wallet[id]=value;  return {...wallet}  } );
        }
        */
        
        const cargoListener = () => {
            /*
            Client.getInstance().ownPlayer.cargo.onAdd = (item) => {
                updateCargo(item.cryptoID,item.amount)
                item.onChange = () => updateCargo(item.cryptoID,item.amount);
            };             
            Client.getInstance().ownPlayer.cargo.onRemove = (item) => {
                updateCargo(item.cryptoID,0);
              }
              */
        }
        
        Client.getInstance().phaserGame.events.on( gameEvents.room.JOINED, cargoListener )

        return () => {
            Client.getInstance().phaserGame.events.off( gameEvents.room.JOINED, cargoListener )
        }

    },[])

    return { balance , setBalance }
}

export default usePlayerCargo