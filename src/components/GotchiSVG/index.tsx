import { useWeb3 } from "web3/context";
import { useEffect, useState } from "react";
import { callDiamond } from "web3/actions";
import gotchiLoading from "assets/gifs/loadingBW.gif";
import { Web3Provider } from "@ethersproject/providers";
import {
  convertInlineSVGToBlobURL,
  customiseSvg,
  CustomiseOptions,
} from "helpers/aavegotchi";
import { Tuple } from "types";

interface Props {
  tokenId: string;
  options?: CustomiseOptions;
  lazyloadIn?: boolean;
  side?: 0 | 1 | 2 | 3;
}

export const GotchiSVG = ({
  tokenId,
  options,
  lazyloadIn,
  side = 0,
}: Props) => {
  const {
    state: { usersAavegotchis, provider },
    dispatch,
  } = useWeb3();
  const [svg, setSvg] = useState<string>();
 

  useEffect(() => {
    let mounted = true;

    const fetchGotchiSvg = async (
      id: string,
      isOwner: boolean,
      provider: Web3Provider
    ) => {
      try {
        const res = await callDiamond<Tuple<string, 4>>(provider, {
          name: "getAavegotchiSideSvgs",
          parameters: [id],
        });
        if (mounted){
          if (isOwner) {
            dispatch({
              type: "UPDATE_AAVEGOTCHI_SVG",
              tokenId: id,
              svg: res,
            });
          } else {
            setSvg(options ? customiseSvg(res[0], options) : res[0]);
          }
        }
      } catch (error) {
        dispatch({
          type: "SET_ERROR",
          error,
        });
      }
    };

    if (usersAavegotchis && (lazyloadIn === undefined || lazyloadIn)) {
      const gotchis = [...usersAavegotchis];
      const selectedGotchi = gotchis.find((gotchi) => gotchi.id === tokenId);
      if (selectedGotchi?.svg) {
        setSvg(
          options
            ? customiseSvg(
                selectedGotchi.svg[side],
                options,
                selectedGotchi.equippedWearables
              )
            : selectedGotchi.svg[side]
        );
      } else if (provider) {
        fetchGotchiSvg(tokenId, !!selectedGotchi, provider);
      }
    } 
    
    return () => {mounted=false}
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [usersAavegotchis, tokenId, lazyloadIn, side, provider, options]);

  return (
    <img
      src={svg ? convertInlineSVGToBlobURL(svg) : gotchiLoading}
      height="100%"
      width="100%"
      alt={`Gotchi_${tokenId}`}
    />
  );
};
