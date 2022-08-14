import gameEvents from "game/helpers/gameEvents";
import Client from "matchmaking/Client";
import { useEffect, useState } from "react";

const usePlayerVitals = () => {

    const [ fuel, setFuel ] = useState(100);
    const [ health , setHealth ] = useState(100);
    const [ cargo, setCargo ] = useState(0);

    useEffect(() => {

        const vitalsListeners = () =>{
          Client.getInstance().ownPlayer.vitals.forEach((vital) => {
            if (vital.name === "Fuel") {
              vital.onChange = () => {
                const myFuel = vital.currentValue / vital.filledValue * 100;
                setFuel( myFuel );
              };
            } else if (vital.name === "Health") {
              vital.onChange = () => {
                const myHealth = vital.currentValue / vital.filledValue * 100;
                setHealth( myHealth );
              };
            } else if (vital.name === "Cargo") {
              vital.onChange = () => {
                const myCargo = Math.round((1 - vital.currentValue / vital.filledValue) * 100);
                setCargo( myCargo );
              };
            };
         })
        }

        Client.getInstance().phaserGame.events.on( gameEvents.room.JOINED, vitalsListeners )

        return () => {
            Client.getInstance().phaserGame.events.off( gameEvents.room.JOINED, vitalsListeners )
        }
    },[])

    return { fuel , cargo, health }
}

export default usePlayerVitals