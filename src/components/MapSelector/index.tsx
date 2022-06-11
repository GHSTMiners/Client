import React, { useEffect, useState } from "react";
import styles from "./styles.module.css";
import { Arrow } from "assets";
import desertImage from "assets/images/desert_thumbnail.png";
import forestImage from "assets/images/forest_thumbnail.png";
import * as Chisel from "chisel-api-interface";
import Client from "matchmaking/Client";

interface Props {
  children?: React.ReactNode;
  onClick?: () => void;
  disabled?: boolean;
}

const MapSelector: React.FC<Props> = ({
  children,
  onClick,
  disabled,
}) => {

  // state variables to handle user map selection
  const emptyWorlds: Chisel.World[] = [] ;
  const [worldArray,setWorldArray] = useState(emptyWorlds);
  const [mapSelection,setMapSelection]=useState(0);

  // fetching map info from Chisel
  const rawWorlds = Client.getInstance().apiInterface.worlds();
  rawWorlds.then( worlds => {
         worlds.forEach( world => worldArray.push(world));
  })

  // temporary solution to include thumbnail images. TO DO: get from Chisel
  const emptyThumbnails: string[] = [];
  const [worldThumbnails,setWorldThumbnails] = useState(emptyThumbnails);
  worldThumbnails.push(forestImage);
  worldThumbnails.push(desertImage);

  return (
    <>
      <img src={worldArray[0]? worldThumbnails[mapSelection] : ''} className={styles.mapThumbnail} />
      <Arrow width={'4rem'} className={`${styles.arrowLeft} ${mapSelection==0? styles.disabledIcon: ''}`} onClick={()=>setMapSelection(0)}/>
      <div className={styles.mapTitle}>{worldArray[0]? worldArray[mapSelection].name : 'Loading...'}</div>
      <Arrow width={'4rem'} className={`${styles.arrowRight} ${mapSelection==1? styles.disabledIcon: ''}`} onClick={()=>setMapSelection(1)}/>
    </>
  );
};

export default MapSelector;
