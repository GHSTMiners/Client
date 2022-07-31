import { useCallback, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { GotchiSVG, Chat} from "components";
import { TraitsTile , GotchiSelector, MapSelector } from "./components";
import { updateAavegotchis, useWeb3 } from "web3/context";
import { ProgressBar } from "react-bootstrap";
import { AavegotchiObject, IndexedArray, IndexedBooleanArray } from "types";
import { PlayerCounter } from "pages/Lobby/components/PlayerCounter";
import Client from "matchmaking/Client";
import * as Schema from "matchmaking/Schemas";
import * as Protocol from "gotchiminer-multiplayer-protocol"
import gotchiLoading from "assets/gifs/loadingBW.gif";
import styles from "./styles.module.css";



const Lobby = (): JSX.Element => {
  const {
    state: { usersAavegotchis, address, selectedAavegotchiId },
    dispatch,
  } = useWeb3();

  const emptyGotchi = {} as AavegotchiObject;
  const [selectedGotchi,setSelectedGotchi]=useState(emptyGotchi);
  const [playerReady,setPlayerReady]= useState(false);
  const [playersInLobby,setPlayersInLobby] = useState(0);
  const [lobbyCountdown,setLobbyCountdown]= useState(0);
  const [playerSeats,setPlayerSeats]= useState<IndexedBooleanArray>({});
  const [mapVoting,setMapVoting]= useState<IndexedArray>({});
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

  useEffect(() => {

    try{
           //Register message handlers
          Client.getInstance().lobbyRoom.onMessage("*", (type, message) => {
            Client.getInstance().lobbyMessageRouter.processRawMessage( type as string, message);
          });

          Client.getInstance().lobbyRoom.state.onChange = () => { 
            
            // updating player counter
            if (Client.getInstance().lobbyRoom.state.player_seats.length !== playersInLobby){
              setPlayersInLobby(Client.getInstance().lobbyRoom.state.player_seats.length)              
            }

            // updating player seats
            let currentPlayers= {} as IndexedBooleanArray;
            let currentMapVotes = {} as IndexedArray;
            Client.getInstance().lobbyRoom.state.player_seats.forEach( seat => {
              currentPlayers[seat.gotchi_id] = seat.ready;
              if (seat.map_vote>0){
                let newVotedMap = Object.hasOwn( currentMapVotes, seat.map_vote);
                (newVotedMap)? currentMapVotes[seat.map_vote] += 1 : currentMapVotes[seat.map_vote]=1; 
              }
            })            
            setPlayerSeats(currentPlayers)
            setMapVoting(currentMapVotes)
            setLobbyCountdown(Client.getInstance().lobbyRoom.state.countdown)
            
            if(Client.getInstance().lobbyRoom.state.state === Schema.LobbyState.Started) {  
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
      alert(`Failed to create a lobby, maybe we are having server issues?, ${exception}`)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Updating player ready state 
  useEffect(()=>{
    if (selectedAavegotchiId){
      setPlayerReady(playerSeats[selectedAavegotchiId]);
    }
  },[playerSeats,selectedAavegotchiId])


  // Updating the current selected aavegotchi
  useEffect(()=>{
    if (usersAavegotchis){
      const gotchiSelected = usersAavegotchis.find( (gotchi) => gotchi.id === selectedAavegotchiId );
      if (gotchiSelected) setSelectedGotchi(gotchiSelected)
    }
  },[selectedAavegotchiId,usersAavegotchis])

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
  }, [address,usersAavegotchis, dispatch]);

  const handlePlayerReady = ()=>{
    // sending message to server    
    let readyUpMessage : Protocol.ChangePlayerReady = new Protocol.ChangePlayerReady();
    readyUpMessage.ready = !playerReady;
    const serializedMessage = Protocol.MessageSerializer.serialize(readyUpMessage);
    Client.getInstance().lobbyRoom.send(serializedMessage.name,serializedMessage.data);
  }

  const renderCountdown = (time:number)=>{
    const minutes = Math.floor(time/60);
    const seconds = time - (minutes*60);
    return(
      <>
        {minutes} : {(seconds<10)? `0${seconds}`: seconds}
      </>
    )
  }

  return (
    <>
      <div className={styles.basicGrid}>
        <div className={`${styles.gotchiSelection} ${styles.gridTile}`}>
          <div className={styles.gotchiSelectionBar}>
            <GotchiSelector
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
            <MapSelector mapVotes={mapVoting} disabled={playerReady}/>
          </div>
        </div>

        <div className={`${styles.gridTile} ${styles.timeCounter}`}>
          <div className={styles.readyUpContainer} >
            <button className={`${styles.readyUpButton} `} onClick={ handlePlayerReady }>
              {playerReady? 'UNREADY' : 'READY'}
            </button>
            <div className={`${styles.countdownContainer} ${(lobbyCountdown<15 && lobbyCountdown>0)?styles.countdownLocked:''} `}>
              {/*lobbyCountdown>0? `${lobbyCountdown}s` : '' */}
              <div className={styles.progressBarContainer}>
                <ProgressBar className={styles.progressBar} variant="danger" animated now={lobbyCountdown/300*100}/>
                <div className={styles.progressBarLabel}>
                  {renderCountdown(lobbyCountdown)}
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className={`${styles.gridTile} ${styles.availablePlayers}`}>
          <PlayerCounter playerSeats={playerSeats} totalPlayers={5} />
        </div>
        
         
        <div className={`${styles.gridTile} ${styles.chat}`}>
          <Chat  disabled={false} gameMode={false}/>
        </div>
                    
      </div>
    </>
  );
};

export default Lobby;

