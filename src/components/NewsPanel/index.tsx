import { render } from "@testing-library/react";
import styles from "./styles.module.css";


export const NewsPanel = () => {

  type newsEntry = { title: string, content: string};

   // Temporary events, replace hard-coded news and fetch from Chissel
   const newsArray: newsEntry[]= [];
   newsArray.push({
     title: "06/05/2022 - Stress Test",
     content: "GotchiMiner is almost ready for launch! Come and join us on the 6th May to stress test the game. Cooperate with your frens or compite to mine all the precious crypto crystals, the choice is yours!"
   });
   newsArray.push({
    title: "COMING SOON - XP EVENT!",
    content: "After of a LOT of hard work, we are getting ready for the first official Aavegotchi XP event of GotchiMiner. Specific details of the event will be published shortly after the stress is concluded."
  });
 
   const renderNewsEntry = ( news : newsEntry) => {
     return(
       <div>
          <div className={styles.newsTitle}>
            {news.title}
          </div>
          <div className={styles.newsDescription}>
            {news.content}
          </div>
       </div>
     )
   }

   const renderedNews = newsArray.map( function(entry) {
     return renderNewsEntry(entry)
   })

    return (
      <div className={styles.newsPanel}>
        {renderedNews}
      </div>
    );
  };
  