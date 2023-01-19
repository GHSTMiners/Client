import { useCallback, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { TraitsTile , GotchiSelector, MapSelector } from "./components";
import { updateAavegotchis, useWeb3 } from "web3/context";
import { AavegotchiObject, IndexedArray, IndexedBooleanArray } from "types";
import { PlayerCounter } from "pages/Lobby/components/PlayerCounter";
import Client from "matchmaking/Client";
import * as Schema from "matchmaking/Schemas";
import * as Protocol from "gotchiminer-multiplayer-protocol"
import gotchiLoading from "assets/gifs/loadingBW.gif";
import GotchiPreview from "components/GotchiPreview";
import { useGlobalStore } from "store";
import LobbyCountdown from "./components/LobbyCountdown";
import styles from "./styles.module.css";
import globalStyles from "theme/globalStyles.module.css"
import MainScene from "game/Scenes/MainScene";


const Lobby = (): JSX.Element => {
  const {
    state: { selectedAavegotchiId },
    dispatch,
  } = useWeb3();
  const usersWalletAddress = useGlobalStore( state => state.usersWalletAddress);
  const usersAavegotchis = useGlobalStore( state => state.usersAavegotchis)

  const emptyGotchi = {} as AavegotchiObject;
  const [selectedGotchi,setSelectedGotchi]=useState(emptyGotchi);
  const [playerReady,setPlayerReady]= useState(false);
  const [playerSeats,setPlayerSeats]= useState<IndexedBooleanArray>({});
  const [mapVoting,setMapVoting]= useState<IndexedArray>({});
  const navigate = useNavigate();
  const setCountdown = useGlobalStore(store => store.setCountdown)
  useGlobalStore.getState().setIsGameLoaded(false);

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
          if(!Client.getInstance().lobbyRoom) {
            navigate("/");
            return;
          }
          
          //Register message handlers
          Client.getInstance().lobbyRoom.onMessage("*", (type, message) => {
            Client.getInstance().lobbyMessageRouter.processRawMessage( type as string, message);
          });

          Client.getInstance().lobbyRoom.state.player_seats.onAdd = ( seat ) =>{
            seat.onChange = updatePlayerSeats
            seat.onRemove = updatePlayerSeats
          }

          Client.getInstance().lobbyRoom.state.onChange = (dataChange) => { 

            const countDownChange = dataChange.find( entry => entry.field === 'countdown') ;
            if ( countDownChange )  setCountdown(countDownChange.value)
            
            if(Client.getInstance().lobbyRoom.state.state === Schema.LobbyState.Started) {  
              Client.getInstance().apiInterface.world(Client.getInstance().lobbyRoom.state.map_id).then(world =>{
                Client.getInstance().chiselWorld = world;
                Client.getInstance().authenticationInfo.password = Client.getInstance().lobbyRoom.state.password;
                Client.getInstance().authenticationInfo.chainId = Client.getInstance().authenticator.chainId().toString()
                Client.getInstance().authenticationInfo.walletAddress = Client.getInstance().authenticator.currentAccount()
                Client.getInstance().authenticationInfo.authenticationToken = Client.getInstance().authenticator.token()

                Client.getInstance().colyseusClient.joinById<Schema.World>(Client.getInstance().lobbyRoom.state.game_id, Client.getInstance().authenticationInfo).then(room => {
                    room.onError( (code:number, message?:string) => {
                      alert(`😔Sorry fren, unfortunately an unexpected error just happened and you cannot longer continue playing this game. This was likely caused by a connection interruption (code:${code}).`)
                      console.error(`💩 A wild error appeared in the Room...#${code}: ${message}`)
                      try{
                        (Client.getInstance().phaserGame?.scene.getScene('MainScene') as MainScene)?.lifeCycleManager?.handleGameEnded();
                      } catch{
                        console.error('Unable to route the client to the endgame page')
                        navigate("/", {replace: false});
                      }
                    })
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

        const updatePlayerSeats = () => {
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
    if (usersWalletAddress) {
      const prevGotchis = usersAavegotchis || [];
      if (
        prevGotchis.find(
          (gotchi) => gotchi.owner.id.toLowerCase() === usersWalletAddress.toLowerCase()
        )
      )
        return;

      dispatch({
        type: "SET_SELECTED_AAVEGOTCHI",
        selectedAavegotchiId: undefined,
      });
      updateAavegotchis(dispatch, usersWalletAddress);
    }
  }, [usersWalletAddress,usersAavegotchis, dispatch]);

  const handlePlayerReady = ()=>{
    // sending message to server    
    let readyUpMessage : Protocol.ChangePlayerReady = new Protocol.ChangePlayerReady();
    readyUpMessage.ready = !playerReady;
    const serializedMessage = Protocol.MessageSerializer.serialize(readyUpMessage);
    Client.getInstance().lobbyRoom.send(serializedMessage.name,serializedMessage.data);
  }

  return (
    <>
      <div className={styles.basicGrid}>
        <div className={`${styles.gotchiSelection} ${globalStyles.gridTile}`}>
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
                    <GotchiPreview tokenId={selectedAavegotchiId} />
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

        <div className={`${styles.mapSelection} ${globalStyles.gridTile}`}  > {/*style={{ backgroundImage: `url(${mapImage})` }}*/} 
          <div className={styles.mapSelectionContainer}>
            <MapSelector mapVotes={mapVoting} disabled={playerReady}/>
          </div>
        </div>

        <div className={`${globalStyles.gridTile} ${styles.timeCounter}`}>
          <div className={styles.readyUpContainer} >
            <button className={`${styles.readyUpButton} `} onClick={ handlePlayerReady }>
              {playerReady? 'UNREADY' : 'READY'}
            </button>
            <LobbyCountdown />
          </div>
        </div>

        <div className={`${globalStyles.gridTile} ${styles.availablePlayers}`}>
          <PlayerCounter playerSeats={playerSeats} totalPlayers={5} />
        </div>
                    
      </div>
    </>
  );
};

export default Lobby;

