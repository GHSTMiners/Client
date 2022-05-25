import styles from "./styles.module.css";
import gameStyle from "./game.module.css";
import lobbySyle from "./lobby.module.css";
import Client from "matchmaking/Client";
import React, { useEffect, useState } from "react";
import * as Protocol from "gotchiminer-multiplayer-protocol"
//import { format } from 'fecha';


interface Props {
  disabled?: boolean;
  gameMode: boolean;
}

const Chat : React.FC<Props> = ({ disabled, gameMode=true }) => {
  const [chatMessage, setChatMessage] = useState<string>("");
  const [chatHistory, setChatHistory] = useState<JSX.Element[]>([]);

  const renderMessage = (id: number, text: string) => {
     let messageColor = '#ffffff';
     let user = '';

     if ( Client.getInstance().colyseusRoom){
      Client.getInstance().colyseusRoom.state.players.forEach( player => {
        if (player.gotchiID === id){
         messageColor = player.chatColor;
         user = player.name;
         return;
        }
      })
    }

    return (
      <div className={styles.chatMessage}>
        <span className={styles.chatUser} style={{color: messageColor}}> [{user}] </span> : {text}
      </div>
    );
  };

  const renderSystemMessage = (text: string) => {
    // alternative div with timestamp
    //<div className={`${styles.chatMessage} ${styles.rainbow} ${styles.rainbow_text_animated}`}> 
    // [{format(new Date(), 'shortTime')}] {text} </div>
   return (
     <div className={`${styles.chatMessage} ${styles.rainbow} ${styles.rainbow_text_animated}`}> {text} </div>
   );
 };

  const submitMessage = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault(); // prevent the page from reloading
    //const playerName = Client.getInstance().ownPlayer.name;
    setChatMessage("");
    //Create message and send
    let message : Protocol.MessageToServer = new Protocol.MessageToServer();
    message.msg = chatMessage;
    let serializedMessage : Protocol.Message = Protocol.MessageSerializer.serialize(message)
    if ( Client.getInstance().colyseusRoom){
      Client.getInstance().colyseusRoom.send(serializedMessage.name, serializedMessage.data)
    }
  };

  function handleClick (event:any ) {
    // if the user clicks on the background, all open dialogs are closed
    const divID = event.target.getAttribute('id');
    if (divID === 'chat' || divID === 'chat-history' || divID === 'chat-textbox'){
      if (Client.getInstance().phaserGame){
        Client.getInstance().phaserGame.events.emit("open_chat");
      }
    }
  }

  useEffect(()=>{
    if (gameMode) {
        Client.getInstance().phaserGame.events.on('chat_message',(notification: Protocol.MessageFromServer)=>{
          setChatHistory([renderMessage(notification.gotchiId,notification.msg)].concat(chatHistory));
        })
        Client.getInstance().phaserGame.events.on('system_message',(notification: Protocol.MessageFromServer)=>{
          if (notification.msg) {
            setChatHistory([renderSystemMessage(notification.msg)].concat(chatHistory));
          }
        })
    }
  },[chatHistory]);


  return (
    <div  id="chat" 
          className={`${ gameMode? gameStyle.chatContainer: lobbySyle.chatContainer }
                     ${disabled? (gameMode? gameStyle.smallContainer: ''): (gameMode? gameStyle.largeContainer: '') }`}
           onClick={(e)=>handleClick(e)}>
      <div  id="chat-history"
            className={`${ gameMode? gameStyle.chatHistory: lobbySyle.chatHistory }
                     ${disabled? (gameMode? gameStyle.smallHistory : ''): (gameMode? gameStyle.largeHistory: '') }`}>
                       {chatHistory}</div>
      <div className={ gameMode? gameStyle.textBoxContainer: lobbySyle.textBoxContainer  }>
        <form onSubmit={submitMessage} className={gameMode? '': lobbySyle.formContainer }>
          <input
            id="chat-textbox"
            className={styles.textBox}
            type="text"
            placeholder="Write your message here..."
            onChange={(e) => setChatMessage(e.target.value)}
            value={chatMessage}
          ></input>
          <button type="submit" className={gameMode? gameStyle.chatButton: lobbySyle.chatButton}>
            SEND
          </button>
        </form>
      </div>
    </div>
  );
};

export default Chat;
