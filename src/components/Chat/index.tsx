import styles from "./styles.module.css";
import gameStyle from "./game.module.css";
import lobbySyle from "./lobby.module.css";
import Client from "matchmaking/Client";
import React, { useEffect, useRef, useState } from "react";
import * as Protocol from "gotchiminer-multiplayer-protocol"
import gameEvents from "game/helpers/gameEvents";
import renderPlayerMessage from "./renderPlayerMessage"
import renderSystemMessage from "./renderSystemMessage"
import submitMessage from "./submitMessage";
import useVisible from "hooks/useVisible";
import { useGlobalStore } from "store";

interface Props {
  gameMode?: boolean;
}

const Chat : React.FC<Props> = ({ gameMode=true }) => {
  const [chatMessage, setChatMessage] = useState<string>("");
  const [chatHistory, setChatHistory] = useState<JSX.Element[]>([]);
  const chatVisibility = useVisible('chat', false); 
  const inputRef = useRef<any>(null);

  useEffect(()=>{
    const printMessage = (notification: Protocol.MessageFromServer) => {
      setChatHistory([renderPlayerMessage(notification.gotchiId,notification.msg)].concat(chatHistory));
    }
    const printAnnouncement = (notification: Protocol.MessageFromServer)=>{
      if (notification.msg)   setChatHistory([renderSystemMessage(notification.msg)].concat(chatHistory));
    }
    const printDeadMessage = (message: Protocol.NotifyPlayerDied)=>{
      const formattedMessage = renderDeadMessage(message);
      setChatHistory([formattedMessage].concat(chatHistory));
    }
    if (gameMode) {
        Client.getInstance().phaserGame.events.on( gameEvents.chat.MESSAGE, printMessage )
        Client.getInstance().phaserGame.events.on( gameEvents.chat.ANNOUNCEMENT, printAnnouncement )
        Client.getInstance().phaserGame.events.on( gameEvents.chat.PLAYERDEAD , printDeadMessage )
    }
    
    return () =>{
      Client.getInstance().phaserGame.events.off( gameEvents.chat.MESSAGE, printMessage)
      Client.getInstance().phaserGame.events.off( gameEvents.chat.ANNOUNCEMENT,printAnnouncement)
      Client.getInstance().phaserGame.events.off( gameEvents.chat.PLAYERDEAD , printDeadMessage )
    }
  },[chatHistory,gameMode]);

  function renderDeadMessage (message: Protocol.NotifyPlayerDied):JSX.Element{
    const players= useGlobalStore.getState().players;
    const deadPlayerColor = players[message.gotchiId]?.chatColor;
    const killerPlayerColor = players[message.perpetratorGotchiId]?.chatColor;
    const deathReason = Protocol.DeathReason[message.reason];
    console.log(message)
    switch (+deathReason){
      case Protocol.DeathReason.Exploded:
          return(
            <span key={Date.now()}>
              💀<span style={{color: deadPlayerColor, fontWeight: 'bold'}}>{players[message.gotchiId]?.name} </span> was blown up 
              {message.perpetratorGotchiId? ' by 😈':''}<span style={{color: killerPlayerColor, fontWeight: 'bold'}}>{message.perpetratorGotchiId? players[message.perpetratorGotchiId].name:''}</span>
              {message.lostCargo? ` loosing ${message.lostCargo} crystals`:''} 
            </span>
          )
      case Protocol.DeathReason.Collision:
        return(
          <span key={Date.now()}>
            💀<span style={{color: deadPlayerColor, fontWeight: 'bold'}}>{players[message.gotchiId]?.name}</span> died smashed against the ground 
            {message.lostCargo? ` loosing ${message.lostCargo} crystals`:''} 
          </span>
        )
      case Protocol.DeathReason.OutOfFuel:
        return(
          <span key={Date.now()}>
            💀<span style={{color: deadPlayerColor, fontWeight: 'bold'}}>{players[message.gotchiId]?.name}</span> run out of fueld and died
            {message.lostCargo? ` loosing ${message.lostCargo} crystals`:''} 
          </span>
        )
      default:
          return(
            <span key={Date.now()}>
              💀<span style={{color: deadPlayerColor, fontWeight: 'bold'}}>{players[message.gotchiId]?.name}</span> died 
              {message.lostCargo? ` loosing ${message.lostCargo} crystals`:''} 
            </span>
          )
    }
  }

  function handleClick (event:any) {
    const divID = event.target.getAttribute('id');

    if ((divID === 'chat' || divID === 'chat-history' || divID === 'chat-textbox') && Client.getInstance().phaserGame){
      Client.getInstance().phaserGame.events.emit( gameEvents.chat.SHOW );
    }
  }

  useEffect(()=>{
    chatVisibility.state? inputRef.current?.focus() : inputRef.current?.blur();
  },[chatVisibility.state])

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
            ref={inputRef}
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

export default React.memo(Chat)