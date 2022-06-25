import styles from "./styles.module.css";
import { GotchiSVG, TraitsTile } from "components";
import { useCallback, useEffect, useState } from "react";
import { updateAavegotchis, useWeb3 } from "web3/context";
import { GotchiSelectorVertical } from "components";
import gotchiLoading from "assets/gifs/loadingBW.gif";
import { Button } from "react-bootstrap";
import { AavegotchiObject } from "types";
import { PlayerCounter } from "components/PlayerCounter";
import Chat from "components/Chat";
import MapSelector from "components/MapSelector";
import Client from "matchmaking/Client";
import * as Schema from "matchmaking/Schemas";
import { useNavigate } from "react-router-dom";
import * as Protocol from "gotchiminer-multiplayer-protocol"



const Lobby = (): JSX.Element => {
  const {
    state: { usersAavegotchis, address, selectedAavegotchiId, networkId },
    dispatch,
  } = useWeb3();

  type IndexedArray = {[key: string]: boolean};

  const emptyGotchi = {} as AavegotchiObject;
  const [selectedGotchi,setSelectedGotchi]=useState(emptyGotchi);
  const [playerReady,setPlayerReady]= useState(false);
  const [playersInLobby,setPlayersInLobby] = useState(0);
  const [lobbyCountdown,setLobbyCountdown]= useState(0);
  const [playerSeats,setPlayerSeats]= useState<IndexedArray>({});
  const navigate = useNavigate();

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
           //Register message handlers
          Client.getInstance().lobbyRoom.onMessage("*", (type, message) => {
            //prettier-ignore
            Client.getInstance().lobbyMessageRouter.processRawMessage( type as string, message);
          });

          Client.getInstance().lobbyRoom.state.onChange = () => { 
            
            // updating player counter
            if (Client.getInstance().lobbyRoom.state.player_seats.length!=playersInLobby){
              setPlayersInLobby(Client.getInstance().lobbyRoom.state.player_seats.length)              
            }

            // updating player seats
            Client.getInstance().lobbyRoom.state.player_seats.forEach( seat => {
              playerSeats[seat.gotchi_id] = seat.ready;
            })            
            setPlayerSeats({...playerSeats})
            setLobbyCountdown(Client.getInstance().lobbyRoom.state.countdown)
            
            if(Client.getInstance().lobbyRoom.state.state == Schema.LobbyState.Started) {  
              Client.getInstance().apiInterface.world(Client.getInstance().lobbyRoom.state.map_id).then(world =>{
                Client.getInstance().chiselWorld = world;
                Client.getInstance().authenticationInfo.password = Client.getInstance().lobbyRoom.state.password;
                Client.getInstance().authenticationInfo.chainId = Client.getInstance().authenticator.chainId().toString()
                Client.getInstance().authenticationInfo.walletAddress = Client.getInstance().authenticator.currentAccount()
                Client.getInstance().authenticationInfo.authenticationToken = Client.getInstance().authenticator.token()

                Client.getInstance().colyseusClient.joinById<Schema.World>(Client.getInstance().lobbyRoom.state.game_id, Client.getInstance().authenticationInfo).then(room => {
                    room.onStateChange.once((state) => {

                        Client.getInstance().colyseusRoom = room;
                        Client.getInstance().lobbyRoom.connection.close()
                        navigate("/play", {replace: false});
                    });
                }).catch(e =>{
                    alert(`Failed to create game! Reason: ${e.message}`)
                })
            })
          }
          }
    } catch(exception : any) {
      alert(`Failed to create a lobby, maybe we\'re having server issues?, ${exception}`)
    }
  }, []);

  // Updating player ready state 
  useEffect(()=>{
    if (selectedAavegotchiId){
      if (playerSeats[selectedAavegotchiId]){
        setPlayerReady(true);
      }
    }
  },[playerSeats])


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

  const handlePlayerReady = ()=>{
    // sending message to server    
    let readyUpMessage : Protocol.ChangePlayerReady = new Protocol.ChangePlayerReady;
    readyUpMessage.ready = true;
    const serializedMessage = Protocol.MessageSerializer.serialize(readyUpMessage);
    Client.getInstance().lobbyRoom.send(serializedMessage.name,serializedMessage.data);
  }

  return (
    <>
      <div className={styles.basicGrid}>
        <div className={`${styles.gotchiSelection} ${styles.gridTile}`}>
          <div className={styles.gotchiSelectionBar}>
            <GotchiSelectorVertical
                  initialGotchiId={selectedAavegotchiId}
                  gotchis={usersAavegotchis}
                  selectGotchi={handleSelect}
                  hidden={playerReady}
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
        </div>

        <div className={`${styles.mapSelection} ${styles.gridTile}`}  > {/*style={{ backgroundImage: `url(${mapImage})` }}*/} 
          <div className={styles.mapSelectionContainer}>
            <MapSelector />
          </div>
        </div>

        <div className={`${styles.gridTile} ${styles.timeCounter}`}>
          <div className={`${styles.countdownContainer} ${(lobbyCountdown<15 && lobbyCountdown>0)?styles.countdownLocked:''} `}>
            {lobbyCountdown>0? `${lobbyCountdown}s` : 'HERE WE GO FRENS!' }
          </div>
          <div className={styles.readyUpContainer}>
            <Button className={styles.readyUpButton} onClick={ handlePlayerReady }>READY</Button>
          </div>
        </div>

        <div className={`${styles.gridTile} ${styles.availablePlayers}`}>
          <div className={styles.tileTitle}>Room Frens</div>
          <PlayerCounter playersInRoom={playersInLobby} totalPlayers={5} playersReady={1} />
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

