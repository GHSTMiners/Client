import { useEffect, useState } from "react";
import Client from "matchmaking/Client";
import gameEvents from "game/helpers/gameEvents";
import { IndexedArray, IndexedCrypto } from "types";

const usePlayerCrypto = ( cryptoRecord : IndexedCrypto) => {

    const [walletBalance, setWalletBalance] = useState<IndexedArray>({});
    const [totalCryptoValue, setTotalCryptoValue] = useState(0);

    useEffect(()=>{
        let total = 0;
        Object.keys(walletBalance).forEach( key => total = walletBalance[key] * cryptoRecord[key].price + total)
        setTotalCryptoValue(total)
    },[walletBalance,cryptoRecord])

    useEffect(()=>{
        /*
        const updateWallet = (id:number,value:number) => {
            setWalletBalance( (wallet:IndexedArray) => { wallet[id]=value;  return {...wallet}  } );
        }
        */
        const walletListener = () => {
            /*
            Client.getInstance().ownPlayer.wallet.onAdd = (item) => {
                updateWallet(item.cryptoID,item.amount)
                item.onChange = () => updateWallet(item.cryptoID,item.amount);
            };*/             
        }
        
        Client.getInstance().phaserGame.events.on( gameEvents.room.JOINED, walletListener )

        return () => {
            Client.getInstance().phaserGame.events.off( gameEvents.room.JOINED, walletListener )
        }

    },[])

    return { walletBalance , totalCryptoValue, setWalletBalance }
}

export default usePlayerCrypto