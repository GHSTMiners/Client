import styles from "./styles.module.css";


export const NewsPanel = () => {

  type newsEntry = { title: string, content: string};

   // Temporary events, replace hard-coded news and fetch from Chissel
   const newsArray: newsEntry[]= [];
   newsArray.push({
     title: "🥳 Successful Stress Test",
     content: "GotchiMiner successfully finished its first public stress test! At the moment all the servers are temporarily closed so we can work on improving the game and adding moaar fun stuff. Feel free to check out the current stastistics and leaderboards."
   });
   newsArray.push({
    title: "🚀 AAVEGOTCHI XP EVENT!",
    content: "The first official Aavegotchi XP event of GotchiMiner is being planned. Specific details of the event will be publised via Twitter, don't forget to follow the GhostSquad guild!"
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
  