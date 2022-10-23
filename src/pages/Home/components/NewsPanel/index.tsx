import styles from "./styles.module.css";


export const NewsPanel = () => {

  type newsEntry = { title: string, content: string};

   // Temporary events, replace hard-coded news and fetch from Chissel
   const newsArray: newsEntry[]= [];
   newsArray.push({
     title: "🔥 Stress Test",
     content: "GotchiMiner is almost ready for launch! Come and join us during November in the first stress test of the game. Cooperate with your frens or compite to mine all the precious crypto crystals, the choice is yours!"
   });
   newsArray.push({
    title: "🚀 AAVEGOTCHI XP EVENT!",
    content: "After of a LOT of hard work, we are getting ready for the first official Aavegotchi XP event of GotchiMiner. Specific details of the event will be published shortly after the stress is concluded."
  });
 
   const renderNewsEntry = ( news : newsEntry) => {
     return(
       <div className={styles.newsEntry} key={news.title}>
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
        {/*<div className={styles.tileHeader}>
          <div className={styles.infoTitle}> News </div>
          <img src={TopPlayersIcon2} className={styles.tileIcon}/> 
        </div>*/}
        {renderedNews}
      </div>
    );
  };
  