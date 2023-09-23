//import CountdownTimer from "components/CountdownTimer";
import { maintenanceTimeOFF, maintenanceTimeON } from "helpers/vars";
import styles from "./styles.module.css";


export const NewsPanel = () => {
  let serversOnline = !((maintenanceTimeON - new Date().getTime())<0 && (maintenanceTimeOFF - new Date().getTime())>0) ;//(process.env.NODE_ENV === 'development') ? true: false;

  /*
  const eventNews = () =>{
    return(
      <>
      <div className={styles.newsTitle}>
            🎮🔥 The first XP competition is now LIVE!
          </div>
          <div className={styles.newsDescription}>
          Are you ready to embark on an exciting adventure in the world of GotchiMiner? We're thrilled to invite you to our first-ever public XP tournament running until April 4th at 2PM UTC. Take on the challenge and climb your way up the leaderboard for a chance to win some amazing rewards! 
          </div>
          <div className={styles.countdown}>
            <CountdownTimer targetDate={ new Date('April 04, 2023 14:00:00 UTC') }/>
          </div>
      </>
    )
  } 

  const maintenanceNews = () =>{
    return(
      <>
        <div className={styles.newsTitle}>
          🎮❌ Daily maintenance
        </div>
        <div className={styles.newsDescription}>
            {`We are running regular maintenance work in the infrastructure, we will be back at ${new Date(maintenanceTimeOFF)}. We apologize for the inconvenience, see you soon frens!`}
        </div>
      </>
    )
  }
  */

  const developmentNews = () =>{
    return(
      <>
      <div className={styles.newsTitle}>
          🚧 Work in Progress 🔥
          </div>
          <div className={styles.newsDescription}>
          Welcome back fren! We are working on implementing new updates requested by the community. Before we are ready for another event, feel free to join the world of GotchiMiner for the fun of it! ⛏️👻
          </div>
      </>
    )
  } 

  
  const closingEventNews = () =>{
    return(
      <>
        <div className={styles.newsTitle}>
        🏅 The XP competition is over🥳
        </div>
        <div className={styles.newsDescription}>
            <div>
              We are thrilled to announce that the GotchiMiner XP event has now officially come to an end.
              For those of you who didn't manage to secure a top position on the leaderboard, 
              don't worry - you still have a chance to win a miner helmet! 
              Simply fill out our feedback form using the following link:
            </div> 
            <a href={'https://forms.gle/C6TFNsDpt5XTUdJ39'}>📝FEEDBACK FORM</a>
            <div>
              Thank you again for your support and enthusiasm for our game. We look forward to bringing you more exciting adventures in the future!
            </div>
            
        </div>
      </>
    )
  }

    return (
      <div className={styles.newsPanel}>
        <div className={styles.newsEntry}>
          {serversOnline? developmentNews() : closingEventNews()}
       </div>
      </div>
    );
  };