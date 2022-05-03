import { AavegotchiObject } from "types";
import styles from "./styles.module.css";
import ActiveFrensIcon from "assets/icons/active_frens.svg"
import InactiveFrensIcon from "assets/icons/inactive_frens.svg"

interface Props {
  playersInRoom: number;
  playersReady: number;
  totalPlayers: number;
  players?: AavegotchiObject[];
}

export const PlayerCounter = ({
    playersInRoom,
    playersReady,
    totalPlayers
  }: Props) => {

    // Dirty logic to play around, to be fetch from Chisel properly
    type LobbyPlayer = { id: number, inRoom : boolean, ready: boolean };
    let playerArray : LobbyPlayer[] = []; 
    let isInRoom = false;
    let isReady = false;
    for (let i = 0; i<totalPlayers ; i++) {
      (i<playersInRoom)? isInRoom=true : isInRoom=false;
      (i<playersReady)? isReady=true : isReady=false;
      playerArray.push({id:i,inRoom:isInRoom,ready:isReady});
    }
    
    const renderPlayerArray = playerArray.map( function (player) {
      return( 
        <div className={styles.playerElement}>
          { (player.inRoom)? 
              <img src={ActiveFrensIcon} className={styles.playerIcon}></img> 
            : <img src={InactiveFrensIcon} className={styles.playerIcon}></img> 
          }
        </div>
      )
    })

    return (
      <div className={styles.playerCounter}>
        {renderPlayerArray}
      </div>
    );
  };
  