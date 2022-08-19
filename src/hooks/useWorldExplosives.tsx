import * as Chisel from "chisel-api-interface"
import gameEvents from "game/helpers/gameEvents";
import Client from "matchmaking/Client";
import { useEffect, useState } from "react";
import { ExplosiveItem, InventoryExplosives } from "types";

const useWorldExplosives = () => {

    const[ worldExplosives, setWorldExplosives] = useState({} as InventoryExplosives);
    
    const loadWorldExplosives = () => {
      const world: Chisel.DetailedWorld | undefined =   Client.getInstance().chiselWorld;
      world.explosives.forEach((explosive)=>{
        let newItem : ExplosiveItem = { 
          id: explosive.id,
          name: explosive.name,
          image: `https://chisel.gotchiminer.rocks/storage/${explosive.drop_image}`,
          pattern: explosive.explosion_coordinates,
          price: explosive.price, 
          type: 'explosive',
          quantity: 0    
        };
        setWorldExplosives( state => { state[explosive.id] = newItem; return( state ) })
      })
    }

    useEffect(()=>{
      Client.getInstance().phaserGame.events.on( gameEvents.room.JOINED, loadWorldExplosives )
      
      return () => {
          Client.getInstance().phaserGame.events.off( gameEvents.room.JOINED, loadWorldExplosives )
      }
    },[])

    
    return { worldExplosives }
}

export default useWorldExplosives