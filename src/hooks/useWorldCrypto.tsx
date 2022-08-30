import { useEffect, useState } from "react";
import * as Chisel from "chisel-api-interface";
import * as Schema from "matchmaking/Schemas"
import Client from "matchmaking/Client";
import { IndexedCrypto } from "types";
import gameEvents from "game/helpers/gameEvents";


const useWorldCrypto = ():[IndexedCrypto] => {

  const schema: Schema.World = Client.getInstance().colyseusRoom.state;
  const world: Chisel.DetailedWorld | undefined =   Client.getInstance().chiselWorld;  
  const [cryptoRecord, setCryptoRecord] = useState<IndexedCrypto>({});
  
  // Fetching the list of crypto from Chisel
  useEffect(()=>{
    //const worldCryptos = {} as IndexedCrypto;
    const fetchWorldCrypto = () => {
      for (let i = 0; i < world.crypto.length; i++) {
        const cryptoPrice = schema.exchange.get(world.crypto[i].id.toString());
        const id = world.crypto[i].id;
        const newCrypto = {
          cryptoID: id,
          name: `${world.crypto[i].shortcode}`,
          image: `https://chisel.gotchiminer.rocks/storage/${world.crypto[i].wallet_image}`,
          crystal: `https://chisel.gotchiminer.rocks/storage/${world.crypto[i].soil_image}`,
          price: (cryptoPrice? cryptoPrice.usd_value : 1)
        }
        cryptoRecord[newCrypto.cryptoID]= newCrypto;
      }
      setCryptoRecord({...cryptoRecord});
    }
    
    Client.getInstance().phaserGame.events.on( gameEvents.room.JOINED, fetchWorldCrypto )

    return () => {
        Client.getInstance().phaserGame.events.off( gameEvents.room.JOINED, fetchWorldCrypto )
    }
    
  // eslint-disable-next-line react-hooks/exhaustive-deps
  },[schema.exchange,world.crypto])

  return [ cryptoRecord ]

}

export default useWorldCrypto