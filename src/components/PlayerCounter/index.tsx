import styles from "./styles.module.css";
import InactiveFrensIcon from "assets/icons/inactive_frens.svg"
import { IndexedBooleanArray } from "types";
import { useEffect, useState } from "react";
import { GotchiSVG } from "components/GotchiSVG";

interface Props {
  playerSeats: IndexedBooleanArray;
  totalPlayers: number;
}

export const PlayerCounter = ({
    playerSeats,
    totalPlayers
  }: Props) => {   

    const [playerArray, setPlayerArray] = useState<(number|undefined)[]>([]);

    useEffect(()=>{
      let currentPlayers = [];
      const playerIds = Object.keys(playerSeats);
      for (let i = 0; i<totalPlayers ; i++) {
        (i<playerIds.length)? currentPlayers.push(+playerIds[i]) : currentPlayers.push(undefined);
      }
      setPlayerArray(currentPlayers)
    },[playerSeats])
    
    const renderPlayerArray = playerArray.map( function (id,index) {
      return( 
        <div className={styles.playerElement} key={`playerIndex${index}`}>
          { (id)? 
              <>
              <div className={styles.gotchiPreviewContainer}>
                <GotchiSVG
                        side={0}
                        tokenId={id.toString()}
                        options={{ animate: false, removeBg: true }}
                      />
                </div>
                {(playerSeats[id])? 'READY' : ''}    
              </> 
            : <img src={InactiveFrensIcon} className={styles.playerIcon}></img> 
          }
        </div>
      )
    })

    return (
      <div className={styles.playerCounter} key={'playerCounter'}>
        {renderPlayerArray}
      </div>
    );
  };
  