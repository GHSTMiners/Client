import styles from "./styles.module.css";

const renderSystemMessage = (text: string) => {
  //${styles.rainbow} ${styles.rainbow_text_animated} 
  //const formattedText = new DOMParser().parseFromString(text, "text/html");
  //console.log(formattedText.firstElementChild?.innerHTML)
  return (
     <div className={`${styles.chatMessage} ${styles.rainbow} ${styles.rainbow_text_animated}`} key={Date.now()}> {text} </div>
   );
 };

 export default renderSystemMessage

// alternative div with timestamp
//import { format } from 'fecha';
//<div className={`${styles.chatMessage} ${styles.rainbow} ${styles.rainbow_text_animated}`}> 
// [{format(new Date(), 'shortTime')}] {text} </div>