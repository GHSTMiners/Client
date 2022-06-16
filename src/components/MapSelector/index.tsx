import React, { useEffect, useState } from "react";
import styles from "./styles.module.css";
import { Arrow } from "assets";
import desertImage from "assets/images/desert_thumbnail.png";
import forestImage from "assets/images/forest_thumbnail.png";
import * as Chisel from "chisel-api-interface";
import * as Protocol from "gotchiminer-multiplayer-protocol"

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
    let message : Protocol.ChangeMapVote = new Protocol.ChangeMapVote();
    message.worldId = worldArray[0].id
    let serializedMessage : Protocol.Message = Protocol.MessageSerializer.serialize(message)
    if ( Client.getInstance().lobbyRoom){
      Client.getInstance().lobbyRoom.send(serializedMessage.name, serializedMessage.data)
    }
  })



  useEffect(() => {
    if(worldArray.length > 0) {
      let message : Protocol.ChangeMapVote = new Protocol.ChangeMapVote();
      message.worldId = worldArray[mapSelection].id
      let serializedMessage : Protocol.Message = Protocol.MessageSerializer.serialize(message)
      if ( Client.getInstance().lobbyRoom){
        Client.getInstance().lobbyRoom.send(serializedMessage.name, serializedMessage.data)
      }
    }
  }, [mapSelection])

  // temporary solution to include thumbnail images. TO DO: get from Chisel
  const emptyThumbnails: string[] = [];
  const [worldThumbnails,setWorldThumbnails] = useState(emptyThumbnails);
  useEffect(()=>{
    worldThumbnails.push(forestImage);
    worldThumbnails.push(desertImage);
  },[]);

  const handleArrowClick = (positionShift : number)=>{
    const newPosition = mapSelection + positionShift;
    if ( newPosition >= 0 && newPosition < worldThumbnails.length){
      setMapSelection(newPosition);
    }
  }

  const thumbnailGallery = worldThumbnails.map(function (image,index) {
    return(
      <div key={`mapThumbnail${index}`}>
        <img src={image} className={`${styles.thumbnailGalleryitem} ${(index==mapSelection)? styles.selectedThumbnail :''}`} 
             
             onClick={()=>setMapSelection(index)}/>
      </div>
    );
  });

  
  return (
    <>
      <img src={worldArray[0]? worldThumbnails[mapSelection] : ''} className={styles.mapThumbnail} />
      <Arrow width={'4rem'} className={`${styles.arrowLeft} ${mapSelection==0? styles.disabledIcon: ''}`} onClick={()=>handleArrowClick(-1)}/>
      <div className={styles.mapTitle}>{worldArray[0]? worldArray[mapSelection].name : 'Loading...'}</div>
      <Arrow width={'4rem'} className={`${styles.arrowRight} ${mapSelection==1? styles.disabledIcon: ''}`} onClick={()=>handleArrowClick(+1)}/>
      <div className={styles.thumbnailGallery}>
        {thumbnailGallery}
      </div>
    </>
  );
};

export default MapSelector;
