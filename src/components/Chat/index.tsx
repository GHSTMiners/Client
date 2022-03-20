import styles from "./styles.module.css";
import Client from "matchmaking/Client";
import React, { useState } from "react";


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

  return (
    <div className={`${styles.chatContainer}
                     ${disabled? styles.smallContainer: styles.largeContainer }`}>
      <div className={`${styles.chatHistory}
                     ${disabled? styles.smallHistory : styles.largeHistory }`}>
                       {chatHistory}</div>
      <div className={styles.textBoxContainer}>
        <form onSubmit={submitMessage}>
          <input
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
