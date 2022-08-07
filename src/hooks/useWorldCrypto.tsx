import { useEffect, useState } from "react";
import * as Chisel from "chisel-api-interface";
import * as Schema from "matchmaking/Schemas"
import Client from "matchmaking/Client";
import { IndexedCrypto } from "types";


const useWorldCrypto = ():[IndexedCrypto] => {

  const schema: Schema.World = Client.getInstance().colyseusRoom.state;
  const world: Chisel.DetailedWorld | undefined =   Client.getInstance().chiselWorld;  
  const [cryptoRecord, setCryptoRecord] = useState<IndexedCrypto>({});
  
  // Fetching the list of crypto from Chisel
  useEffect(()=>{
    //const worldCryptos = {} as IndexedCrypto;
    for (let i = 0; i < world.crypto.length; i++) {
      const cryptoPrice = schema.exchange.get(world.crypto[i].id.toString());
      const id = world.crypto[i].id;
      const newCrypto = {
        cryptoID: id,
        name: `${world.crypto[i].shortcode}`,
        image: `https://chisel.gotchiminer.rocks/storage/${world.crypto[i].wallet_image}`,
        price: (cryptoPrice? cryptoPrice.usd_value : 1)
      }
      cryptoRecord[newCrypto.cryptoID]= newCrypto;
    }
    setCryptoRecord({...cryptoRecord});
    // eslint-disable-next-line react-hooks/exhaustive-deps
  },[schema.exchange,world.crypto])

  return [ cryptoRecord ]

}

export default useWorldCrypto