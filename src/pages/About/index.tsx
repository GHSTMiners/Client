import styles from "./styles.module.css";
import { Header } from "components";
import SmokeyIm from "assets/images/smokeytheybandit.png";
import FabioIm from "assets/images/corleone.jpg";
import MacheteIm from "assets/images/machete.jpg";
import GotchinomicsIm from "assets/images/gotchinomics.png";
import { FlipCard } from "components";
import { FaTwitter } from "react-icons/fa";
import { FaDiscord } from "react-icons/fa";

const About = (): JSX.Element => {

  const renderGotchiCard = (twitter:string,discord:string) =>{
    return(
      <>
        <div>
          <FaTwitter /> {twitter}
        </div>
        <div>
          <FaDiscord /> {discord}
        </div>
      </>
    )
  }

  return (
    <>
    <div className={styles.basicGrid}>

      <div className={`${styles.gridTile} ${styles.gaameJaam}`}>
        <div className={styles.tileTitle}>Gaame Jaam</div>
        <div>
           A demo version of this game was developed for the first Aavegotchi
          Gaame Jaam by the team GHSTMiners, winning the first prize in the
          competition. PixelCraft further sponsored the development of the first
          server-secured version of the game.
        </div>
      </div>
      <div className={`${styles.gridTile} ${styles.ghostSquad}`}>
        <div className={styles.tileTitle}>Ghost Squad</div>
        <div>
          We are the founders of the Ghost Squad, an active community of Gotchiverse addicts, game developers and content creators. 
        </div>
      </div>
      <div className={`${styles.gridTile} ${styles.gotchiTile} ${styles.smokey}`}>
        <div className={styles.tileTitle}>Smokey The Bandit</div>
        {renderGotchiCard('smokeyZheBandit','smokeythebandit#9941')}
      </div>
      <div className={`${styles.gridTile} ${styles.gotchiTile} ${styles.gotchinomics}`}>
        <div className={styles.tileTitle}>Gotchinomics</div>
        {renderGotchiCard('Gotchinomics','Gotchinomics#4936')}
      </div>
      <div className={`${styles.gridTile} ${styles.gotchiTile} ${styles.fabio}`}>
        <div className={styles.tileTitle}>ItsaMeFabio</div>
        {renderGotchiCard('Itsamefabio94','ItsaMeFabio#4252')}
      </div>
      <div className={`${styles.gridTile} ${styles.gotchiTile} ${styles.machete}`}>
        <div className={styles.tileTitle}>Machete</div>
        {renderGotchiCard('Crypto_Toupa','Machete#9873')}
      </div>

    </div>
      
    </>
  );
};

export default About;

/*
<div className={styles.backgroundContainer}>

        <div className={styles.about}>
          A demo version of this game was developed for the first Aavegotchi
          Gaame Jaam by the team GHSTMiners, winning the first prize in the
          competition. PixelCraft further sponsored the development of the first
          server-secured version of the game. The team is composed of the
          following members:
          <div className={styles.container}>
            <FlipCard
              imageURL={SmokeyIm}
              title="Smokeythebandit"
              description="Lead Full-Stack Developer"
              twitter="smokeyZheBandit"
              discord="smokeythebandit#9941"
            />
            <FlipCard
              imageURL={FabioIm}
              title="ItsaMeFabio"
              description="Lead Multi-Media Designer"
              twitter="Itsamefabio94"
              discord="ItsaMeFabio#4252"
            />
            <FlipCard
              imageURL={GotchinomicsIm}
              title="Gotchinomics"
              description="Front-End Developer"
              twitter="Gotchinomics"
              discord="Gotchinomics#4936"
            />
            <FlipCard
              imageURL={MacheteIm}
              title="Machete"
              description="Sound Design &amp; Tester"
              twitter="Crypto_Toupa"
              discord="Machete#9873"
            />
          </div>
        </div>
        </div>
 */
