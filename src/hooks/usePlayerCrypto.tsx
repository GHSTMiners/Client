import { useEffect, useState } from "react";
import Client from "matchmaking/Client";
import gameEvents from "game/helpers/gameEvents";
import { IndexedArray } from "types";

const usePlayerCrypto = () => {

    const [walletBalance, setWalletBalance] = useState<IndexedArray>({});
    const [totalCryptoValue, setTotalCryptoValue] = useState(0);

    useEffect(()=>{
        let total = 0;
        Object.keys(walletBalance).forEach( key => total = walletBalance[key] + total)
        setTotalCryptoValue(total)
    },[walletBalance])

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

    return { walletBalance , totalCryptoValue, setWalletBalance }
}

export default usePlayerCrypto