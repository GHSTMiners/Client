import styles from "./styles.module.css";
import Client from "matchmaking/Client";
import React, { useEffect, useState } from "react";
import * as Protocol from "gotchiminer-multiplayer-protocol"
//import { format } from 'fecha';


interface Props {
  disabled?: boolean;
}

const Chat : React.FC<Props> = ({ disabled }) => {
  const [chatMessage, setChatMessage] = useState<string>("");
  const [chatHistory, setChatHistory] = useState<JSX.Element[]>([]);
  const myPhaserGame = Client.getInstance().phaserGame;
  const myColyseusRoom = Client.getInstance().colyseusRoom;

  const renderMessage = (id: number, text: string) => {
     let messageColor = '#ffffff';
     let user = '';

     if (myColyseusRoom){
       myColyseusRoom.state.players.forEach( player => {
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
    if (myColyseusRoom){
      myColyseusRoom.send(serializedMessage.name, serializedMessage.data)
    }
  };

  function handleClick (event:any ) {
    // if the user clicks on the background, all open dialogs are closed
    const divID = event.target.getAttribute('id');
    if (divID === 'chat' || divID === 'chat-history' || divID === 'chat-textbox'){
      if (myPhaserGame){
        myPhaserGame.events.emit("open_chat");
      }
    }
  }

  useEffect(()=>{
    if (myPhaserGame) {
       //Wait until the player was admitted to the server
       myPhaserGame.events.on("joined_game", () => {
        myPhaserGame.events.once('chat_message',(notification: Protocol.MessageFromServer)=>{
          setChatHistory([renderMessage(notification.gotchiId,notification.msg)].concat(chatHistory));
        })
        myPhaserGame.events.once('system_message',(notification: Protocol.MessageFromServer)=>{
          if (notification.msg) {
            setChatHistory([renderSystemMessage(notification.msg)].concat(chatHistory));
          }
        })
      });
    }
  },[chatHistory]);

  return (
    <div  id="chat" 
          className={`${styles.chatContainer}
                     ${disabled? styles.smallContainer: styles.largeContainer }`}
           onClick={(e)=>handleClick(e)}>
      <div  id="chat-history"
            className={`${styles.chatHistory}
                     ${disabled? styles.smallHistory : styles.largeHistory }`}>
                       {chatHistory}</div>
      <div className={styles.textBoxContainer}>
        <form onSubmit={submitMessage}>
          <input
            id="chat-textbox"
            className={styles.textBox}
            type="text"
            placeholder="Write your message here..."
            onChange={(e) => setChatMessage(e.target.value)}
            value={chatMessage}
          ></input>
          <button type="submit" className={styles.chatButton}>
            SEND
          </button>
        </form>
      </div>
    </div>
  );
};

export default Chat;
