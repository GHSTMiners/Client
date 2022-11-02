import { convertInlineSVGToBlobURL, CustomiseOptions, customiseSvg } from "helpers/aavegotchi"
import gotchiLoading from "assets/gifs/loadingBW.gif";
import React, { useEffect, useState } from "react"
import AavegotchiSVGFetcher from "game/Rendering/AavegotchiSVGFetcher";
import { LazyLoadImage } from "react-lazy-load-image-component";

interface Props {
    tokenId: string;
    lazyLoading?: boolean;
    options?: CustomiseOptions;
  }

const GotchiPreview = ( { tokenId , lazyLoading = true , options} : Props ) => {
    const [gotchiSVG , setGotchiSVG] =useState<string|undefined>(undefined);

    useEffect(()=>{
        if (+tokenId !== undefined && tokenId !== 'undefined' ){
            const aavegotchiSVGFetcher = new AavegotchiSVGFetcher();
            aavegotchiSVGFetcher.frontWithoutBackground(+tokenId ).then((svg) => {
                let styledSvg = svg;
                if (options){
                    styledSvg = customiseSvg(svg,options)
                }
                setGotchiSVG(convertInlineSVGToBlobURL(styledSvg))
            });
        }    
    },[tokenId])
    
    return(
        <LazyLoadImage src={gotchiSVG ? gotchiSVG : gotchiLoading}
            height="100%"
            width="100%"
            alt={`Gotchi_${tokenId}`} 
            loading= {lazyLoading? 'lazy' : 'eager'}/>
    )
}

export default React.memo(GotchiPreview)