import AavegotchiSVGFetcher from "game/Rendering/AavegotchiSVGFetcher";
import Client from "matchmaking/Client";
import { useEffect, useState } from "react";
import { convertInlineSVGToBlobURL } from "helpers/aavegotchi";

const usePlayerGotchi = () => {
  const [playerGotchi,setplayerGotchi]=useState('');
  
  useEffect(()=>{
    const aavegotchiSVGFetcher = new AavegotchiSVGFetcher( Client.getInstance().ownPlayer.gotchiID );
    aavegotchiSVGFetcher.frontWithoutBackground()
      .then((svg) => {setplayerGotchi(convertInlineSVGToBlobURL(svg))});
  },[]);

  return { playerGotchi }
}

export default usePlayerGotchi