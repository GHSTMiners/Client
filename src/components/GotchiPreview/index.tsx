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
        let mounted = true;
        if (+tokenId !== undefined && tokenId !== 'undefined' && +tokenId > 0 ){
            const aavegotchiSVGFetcher = new AavegotchiSVGFetcher();
            //console.log(`Fetching gotchi ID#${+tokenId}`)
            aavegotchiSVGFetcher.frontWithoutBackground(+tokenId ).then((svg) => {
                if (mounted){
                    let styledSvg = svg;
                    if (options){
                        styledSvg = customiseSvg(svg,options)
                    }
                    setGotchiSVG(convertInlineSVGToBlobURL(styledSvg))
                }
            });
        }
        return () => {mounted = false}    
    },[tokenId,options])
    
    return(
        <LazyLoadImage src={gotchiSVG ? gotchiSVG : gotchiLoading}
            height="100%"
            width="100%"
            alt={`Gotchi_${tokenId}`} 
            loading= {lazyLoading? 'lazy' : 'eager'}/>
    )
}

export default React.memo(GotchiPreview)