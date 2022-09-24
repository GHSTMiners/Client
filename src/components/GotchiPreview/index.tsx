import { convertInlineSVGToBlobURL } from "helpers/aavegotchi"
import gotchiLoading from "assets/gifs/loadingBW.gif";
import React, { useEffect, useState } from "react"
import AavegotchiSVGFetcher from "game/Rendering/AavegotchiSVGFetcher";
import { LazyLoadImage } from "react-lazy-load-image-component";

interface Props {
    tokenId: string;
  }

const GotchiPreview = ( { tokenId } : Props ) => {
    const [gotchiSVG , setGotchiSVG] =useState('');

    useEffect(()=>{
        const aavegotchiSVGFetcher = new AavegotchiSVGFetcher( +tokenId );
        aavegotchiSVGFetcher.frontWithoutBackground().then((svg) => {
            setGotchiSVG(convertInlineSVGToBlobURL(svg))
        });    
    },[tokenId])
    
    return(
        <LazyLoadImage src={gotchiSVG ? gotchiSVG : gotchiLoading}
            height="100%"
            width="100%"
            alt={`Gotchi_${tokenId}`} 
            loading='lazy'/>
    )
}

export default React.memo(GotchiPreview)