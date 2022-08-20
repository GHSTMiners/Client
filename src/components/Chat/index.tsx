import styles from "./styles.module.css";
import gameStyle from "./game.module.css";
import lobbySyle from "./lobby.module.css";
import Client from "matchmaking/Client";
import React, { useEffect, useState } from "react";
import * as Protocol from "gotchiminer-multiplayer-protocol"
import gameEvents from "game/helpers/gameEvents";
import renderPlayerMessage from "./renderPlayerMessage"
import renderSystemMessage from "./renderSystemMessage"
import submitMessage from "./submitMessage";
import useVisible from "hooks/useVisible";

interface Props {
  gameMode: boolean;
}

export const Chat : React.FC<Props> = ({ gameMode=true }) => {
  const [chatMessage, setChatMessage] = useState<string>("");
  const [chatHistory, setChatHistory] = useState<JSX.Element[]>([]);
  const chatVisibility = useVisible('chat', false); 

  useEffect(()=>{
    const printMessage = (notification: Protocol.MessageFromServer) => {
      setChatHistory([renderPlayerMessage(notification.gotchiId,notification.msg)].concat(chatHistory));
    }
    const printAnnouncement = (notification: Protocol.MessageFromServer)=>{
      if (notification.msg)   setChatHistory([renderSystemMessage(notification.msg)].concat(chatHistory));
    }
    if (gameMode) {
        Client.getInstance().phaserGame.events.on( gameEvents.chat.MESSAGE, printMessage)
        Client.getInstance().phaserGame.events.on( gameEvents.chat.ANNOUNCEMENT,printAnnouncement)
    }
    
    return () =>{
      Client.getInstance().phaserGame.events.off( gameEvents.chat.MESSAGE, printMessage)
      Client.getInstance().phaserGame.events.off( gameEvents.chat.ANNOUNCEMENT,printAnnouncement)
    }
  },[chatHistory,gameMode]);

  function handleClick (event:any ) {
    const divID = event.target.getAttribute('id');
    if ((divID === 'chat' || divID === 'chat-history' || divID === 'chat-textbox') && Client.getInstance().phaserGame){
      Client.getInstance().phaserGame.events.emit( gameEvents.chat.SHOW );
    }
  }

  return (
    <div  id="chat" 
          className={`${ gameMode? gameStyle.chatContainer: lobbySyle.chatContainer }
                     ${chatVisibility.state? (gameMode? gameStyle.largeContainer: '') : (gameMode? gameStyle.smallContainer: '') }`}
           onClick={(e)=>handleClick(e)}>
      
      <div  id="chat-history"
            className={`${ gameMode? gameStyle.chatHistory: lobbySyle.chatHistory }
                     ${chatVisibility.state? (gameMode? gameStyle.largeHistory: ''):(gameMode? gameStyle.smallHistory : '') }`}>
                       {chatHistory}
      </div>
      
      <div className={ gameMode? gameStyle.textBoxContainer: lobbySyle.textBoxContainer  }>
        <form className={gameMode? '': lobbySyle.formContainer }
          onSubmit={(event) => { 
            submitMessage(event,chatMessage);
            setChatMessage(''); }}>
          <input
            id="chat-textbox"
            className={styles.textBox}
            type="text"
            placeholder="Type here..."
            autoComplete="off"
            onChange={(e) => setChatMessage(e.target.value)}
            value={chatMessage}
          ></input>
        </form>
      </div>
    </div>
  );
};