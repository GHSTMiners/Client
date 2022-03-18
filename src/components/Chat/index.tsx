import styles from "./styles.module.css";
import Client from "matchmaking/Client";
import React, { useState } from "react";
import ReactDOM from "react-dom";


interface Props {
  disabled?: boolean;
}

const Chat : React.FC<Props> = ({ disabled }) => {
  const [chatMessage, setChatMessage] = useState<string>("");
  const [chatHistory, setChatHistory] = useState<JSX.Element[]>([]);

  const renderMessage = (user: string, text: string) => {
    return (
      <div className={styles.chatMessage}>
        <span className={styles.chatUser}> [{user}] </span> : {text}
      </div>
    );
  };

  const submitMessage = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault(); // prevent the page from reloading
    const playerName = Client.getInstance().ownPlayer.name;
    const newText = renderMessage(playerName.toString(), chatMessage);
    setChatHistory([newText].concat(chatHistory));
    setChatMessage("");
  };

  function handleClick (event:any ) {
    // if the user clicks on the background, all open dialogs are closed
    const divID = event.target.getAttribute('id');
    if (divID == 'chat' || divID == 'chat-history' || divID == 'chat-textbox'){
      Client.getInstance().phaserGame.events.emit("open_chat");
    }
  }

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
