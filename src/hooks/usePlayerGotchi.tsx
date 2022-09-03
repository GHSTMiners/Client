import AavegotchiSVGFetcher from "game/Rendering/AavegotchiSVGFetcher";
import Client from "matchmaking/Client";
import { useEffect, useState } from "react";
import { convertInlineSVGToBlobURL } from "helpers/aavegotchi";
import gameEvents from "game/helpers/gameEvents";

const usePlayerGotchi = () => {
  const [playerGotchi,setplayerGotchi]=useState('');
  
  useEffect(()=>{
    const getPlayerGotchi = () => {
      const aavegotchiSVGFetcher = new AavegotchiSVGFetcher( Client.getInstance().ownPlayer.gotchiID );
      aavegotchiSVGFetcher.frontWithoutBackground()
      .then((svg) => {setplayerGotchi(convertInlineSVGToBlobURL(svg))});
    }

    Client.getInstance().phaserGame.events.on( gameEvents.room.JOINED, getPlayerGotchi);
  
    return () => {
      Client.getInstance().phaserGame.events.off( gameEvents.room.JOINED , getPlayerGotchi);
    }
  },[]);

  return { playerGotchi }
}

export default usePlayerGotchi