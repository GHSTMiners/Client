import styles from "./styles.module.css";
import { GotchiSVG, InfoPanel, TraitsPanel, TraitsTile } from "components";
import { useCallback, useEffect, useState } from "react";
import { updateAavegotchis, useWeb3 } from "web3/context";
import { GotchiSelectorVertical } from "components";
import gotchiLoading from "assets/gifs/loadingBW.gif";
import { Button } from "react-bootstrap";
import { AavegotchiObject } from "types";
import mapImage from "assets/images/desert_thumbnail.png";
import { PlayerCounter } from "components/PlayerCounter";
import Chat from "components/Chat";
import Countdown from 'react-countdown';
import MapSelector from "components/MapSelector";
import * as Chisel from "chisel-api-interface";
import * as Colyseus from "colyseus.js";
import Config from "config";
import Client from "matchmaking/Client";
import * as Schema from "matchmaking/Schemas";



const Lobby = (): JSX.Element => {
  const {
    state: { usersAavegotchis, address, selectedAavegotchiId, networkId },
    dispatch,
  } = useWeb3();

  const emptyGotchi = {} as AavegotchiObject;
  const [selectedGotchi,setSelectedGotchi]=useState(emptyGotchi);
  const [playerReady,setPlayerReady]= useState(false);

  /**
   * Updates global state with selected gotchi
   */
  const handleSelect = useCallback(
    (gotchiId: string) => {    
      dispatch({
        type: "SET_SELECTED_AAVEGOTCHI",
        selectedAavegotchiId: gotchiId,
      });
    },
    [dispatch]
  );


  /**
   * 
   */
  useEffect(() => {
    try{
      Client.getInstance().colyseusClient.joinOrCreate<Schema.Lobby>("Lobby").then(room => {
          Client.getInstance().lobbyRoom = room 
      }).catch(exception => {
        alert('Failed to create a lobby, maybe we\'re having server issues?')
      })
    } catch(exception : any) {
      alert('Failed to create a lobby, maybe we\'re having server issues?')
    }
  }, []);


  // Updating the current selected aavegotchi
  useEffect(()=>{
    if (usersAavegotchis){
      const gotchiSelected = usersAavegotchis.find( (gotchi) => gotchi.id === selectedAavegotchiId );
      if (gotchiSelected) setSelectedGotchi(gotchiSelected)
    }
  },[selectedAavegotchiId])

  const [gotchiSide, setGotchiSide] = useState<0 | 1 | 2 | 3>(0);
  const rotateGotchi = () => {
    const currentPos = gotchiSide;
    switch (currentPos) {
      case 0: setGotchiSide(1);  break;
      case 1: setGotchiSide(3);  break;
      case 2: setGotchiSide(0);  break;
      case 3: setGotchiSide(2);  break;
      default: setGotchiSide(0); break;
    }
  };

  useEffect(() => {
    if (address) {
      const prevGotchis = usersAavegotchis || [];
      if (
        prevGotchis.find(
          (gotchi) => gotchi.owner.id.toLowerCase() === address.toLowerCase()
        )
      )
        return;

      dispatch({
        type: "SET_SELECTED_AAVEGOTCHI",
        selectedAavegotchiId: undefined,
      });
      updateAavegotchis(dispatch, address);
    }
  }, [address]);

  return (
    <>
      <div className={styles.basicGrid}>
        <div className={`${styles.gotchiSelection} ${styles.gridTile}`}>
          <div className={styles.gotchiSelectionBar}>
            <GotchiSelectorVertical
                  initialGotchiId={selectedAavegotchiId}
                  gotchis={usersAavegotchis}
                  selectGotchi={handleSelect}
                />
          </div>
          <div className={styles.gotchiPreview}>
            <div className={styles.gotchiName}>
              {selectedGotchi ? `${selectedGotchi?.name}` : "..."}
            </div>
            <div className={styles.gotchiContainer} onClick={rotateGotchi}>
                  {selectedAavegotchiId ? (
                    <GotchiSVG
                      side={gotchiSide}
                      tokenId={selectedAavegotchiId}
                      options={{ animate: true, removeBg: true }}
                    />
                  ) : (
                    <img src={gotchiLoading} alt="Loading Aavegotchi" />
                  )}
                </div>
          </div>
          <div className={styles.gotchiTraitsContainer}>
            <TraitsTile
                    selectedGotchi={usersAavegotchis?.find(
                      (gotchi) => gotchi.id === selectedAavegotchiId
                    )} />
          </div>
          <div className={styles.countdownContainer}>
            { (playerReady)? <Countdown date={Date.now() + 300000} daysInHours={true} />: ''}
          </div>

          <div className={styles.readyUpContainer}>
            <Button className={styles.readyUpButton} onClick={()=>{ setPlayerReady(true) }}>SELECT</Button>
          </div>
        </div>
        <div className={`${styles.mapSelection} ${styles.gridTile}`}  > {/*style={{ backgroundImage: `url(${mapImage})` }}*/} 
          <div className={styles.mapSelectionContainer}>
            <MapSelector />
          </div>
        </div>
        <div className={`${styles.gridTile} ${styles.availablePlayers}`}>
          <div className={styles.tileTitle}>Room Frens</div>
          <PlayerCounter playersInRoom={4} totalPlayers={5} playersReady={0} />
        </div>
        
         
        <div className={`${styles.gridTile} ${styles.chat}`}>
          <div className={styles.tileTitle}>Lobby Chat</div>
          <Chat  disabled={false} gameMode={false}/>
        </div>
                    
      </div>
    </>
  );
};

export default Lobby;

