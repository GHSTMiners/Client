import { useEffect, useState } from "react";
import Client from "matchmaking/Client";
import gameEvents from "game/helpers/gameEvents";
import { IndexedArray } from "types";

const usePlayerCrypto = ():{walletBalance:IndexedArray,setWalletBalance: React.Dispatch<React.SetStateAction<IndexedArray>>} =>{

    const [walletBalance, setWalletBalance] = useState<IndexedArray>({});

    useEffect(()=>{
        
        const updateWallet = (id:number,value:number) => {
            setWalletBalance( (wallet:IndexedArray) => { wallet[id]=value;  return {...wallet}  } );
        }
        
        const walletListener = () => {
            Client.getInstance().ownPlayer.wallet.onAdd = (item) => {
                updateWallet(item.cryptoID,item.amount)
                item.onChange = () => updateWallet(item.cryptoID,item.amount);
            };             
        }
        
        Client.getInstance().phaserGame.events.on( gameEvents.room.JOINED, walletListener )

        return () => {
            Client.getInstance().phaserGame.events.off( gameEvents.room.JOINED, walletListener )
        }

    },[])

    return { walletBalance , setWalletBalance }
}

export default usePlayerCrypto