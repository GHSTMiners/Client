import styles from "./styles.module.css";

const renderSystemMessage = (text: string) => {
   return (
     <div className={`${styles.chatMessage} ${styles.rainbow} ${styles.rainbow_text_animated}`} key={Date.now()}> {text} </div>
   );
 };

 export default renderSystemMessage

// alternative div with timestamp
//import { format } from 'fecha';
//<div className={`${styles.chatMessage} ${styles.rainbow} ${styles.rainbow_text_animated}`}> 
// [{format(new Date(), 'shortTime')}] {text} </div>