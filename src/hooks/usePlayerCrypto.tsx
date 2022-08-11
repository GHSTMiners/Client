import { useEffect, useState } from "react";
import Client from "matchmaking/Client";
import gameEvents from "game/helpers/gameEvents";
import { IndexedArray } from "types";

const usePlayerCrypto = ():{walletBalance:IndexedArray,setWalletBalance: React.Dispatch<React.SetStateAction<IndexedArray>>} =>{

    const [gameOn, setGameOn] = useState(false);
    const [walletBalance, setWalletBalance] = useState<IndexedArray>({});
    
    useEffect(() => {   
        Client.getInstance().phaserGame.events.on( gameEvents.room.JOINED, () => setGameOn(true) )
    },[])

    useEffect(()=>{
        const updateWallet = (id:number,value:number) => {
            setWalletBalance( (wallet:IndexedArray) => { wallet[id]=value;  return {...wallet}  } );
        }

        if (gameOn){
            Client.getInstance().ownPlayer.wallet.onAdd = (item) => {
                updateWallet(item.cryptoID,item.amount)
                item.onChange = () => updateWallet(item.cryptoID,item.amount);
            };             
        }
    },[gameOn])

    return { walletBalance , setWalletBalance }
}

export default usePlayerCrypto