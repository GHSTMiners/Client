import styles from "./styles.module.css";
import Client from "matchmaking/Client";

const renderPlayerMessage = (id: number, text: string) => {
    let messageColor = '#ffffff';
    let user = '';
    const gameMode = true; // TO DO change if dual style is required

    if (gameMode){
     if ( Client.getInstance().colyseusRoom){
       Client.getInstance().colyseusRoom.state.players.forEach( player => {
         if (player.gotchiID === id){
          messageColor = player.chatColor;
          user = player.name;
          return;
         }
       })
     }
    } else{
     if ( Client.getInstance().lobbyRoom){
       Client.getInstance().lobbyRoom.state.player_seats.forEach( player => {
         if (player.gotchi_id === id){
           player.ready? messageColor='#00ff00' : messageColor='#ffffff';
          user = `${player.gotchi_id}`;
          return;
         }
       })
     }
    }

   return (
     <div className={styles.chatMessage} key={Date.now()} >
       <span className={styles.chatUser} style={{color: messageColor}}> [{user}] </span> : {text}
     </div>
   );
 };

    export default renderPlayerMessage