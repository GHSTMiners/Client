import styles from "./styles.module.css";
import { GotchiSVG, Header } from "components";
import SmokeyIm from "assets/images/smokeytheybandit.png";
import FabioIm from "assets/images/corleone.jpg";
import MacheteIm from "assets/images/machete.jpg";
import GotchinomicsIm from "assets/images/gotchinomics.png";
import { FlipCard } from "components";
import { FaTwitter, FaYoutube } from "react-icons/fa";
import { FaDiscord } from "react-icons/fa";

const About = (): JSX.Element => {

  const renderGotchiTile = (name: string, twitter:string, discord:string, role:string, gotchiID:string , aboutme:string ,description?:string) =>{
    return(
      <div className={styles.gotchiTileContainer} key={name}>
        <div className={styles.gotchiTileHeader}>
          <div className={styles.gotchiTitle}>{name}</div>
          <div>{role}</div>
        </div>
        <div className={styles.socialMedia}>
          <span><FaTwitter /> {twitter}</span>
          <span><FaDiscord /> {discord}</span>
        </div>
        <div>
          {aboutme}
        </div>
        <div className={styles.gotchiPreview}>          
          <GotchiSVG side={0}  tokenId={gotchiID} options={{ animate: true, removeBg: true }} />
          {description}
        </div>
      </div>
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
        <div className={styles.guildTile}>
          <div>
            We manage the Ghost Squad, an active community of Gotchiverse addicts, game developers and content creators who like to hang around in district 40 with their frens. Interested? Join us!
          </div>
          <div className={styles.guildMediaContainer}>
          <div className={styles.socialMedia}>
            <span> <FaTwitter /> <a href="https://twitter.com/gotchighstsquad" rel="noreferrer"> TWITTER </a> </span>
            <span> <FaDiscord /> <a href="https://discord.gg/HA6qkpDPCY" rel="noreferrer"> DISCORD </a> </span>
            <span> <FaYoutube /> <a href="https://www.youtube.com/channel/UCcL-0-x85GiDRl7_udQaQhg" rel="noreferrer"> YOUTUBE </a> </span>
          </div>
          </div>
        </div>
      </div>
      <div className={`${styles.gridTile} ${styles.gotchiTile} ${styles.smokey}`}>
        {renderGotchiTile('SmokeyTheBandit',
                          '@smokeyZheBandit',
                          'smokeythebandit#9941',
                          'Full Stack Developer',
                          '22536',
                          '[Personal description goes here]',
                          'VOYAGER was carefully named after a product created by Smokey in real life.')}
      </div>
      <div className={`${styles.gridTile} ${styles.gotchiTile} ${styles.gotchinomics}`}>
        {renderGotchiTile('Gotchinomics',
                          '@gotchinomics',
                          'Gotchinomics#4936',
                          'Front-End Developer',
                          '3934',
                          'Data scientist fascinated by Aavegotchi and the Gotchiverse Realm. Felt down the rabbit hole of web3 development after doing an [aawesome] Aavegotchi mini-game tutorial.',
                          'YODA is one of the first gotchis ever summoned')}
      </div>
      <div className={`${styles.gridTile} ${styles.gotchiTile} ${styles.fabio}`}>
        {renderGotchiTile('ItsaMeFabio',
                          '@itsamefabio94',
                          'ItsaMeFabio#4252',
                          'Multi-Media Designer',
                          '21223',
                          '[Personal description goes here]',
                          'CORLEONE was borned as a result of the profits achieved from Baazaar trading, GMB auctions and Raffles.')}
      </div>
      <div className={`${styles.gridTile} ${styles.gotchiTile} ${styles.machete}`}>
        {renderGotchiTile('Machete',
                          '@crypto_Toupa',
                          'Machete#9873',
                          'Sound Designer & Tester',
                          '23492',
                          '[Personal description goes here]',
                          'MACHETE is one of the strongest gotchis of the Ghost Squad, always ready to protect his frens.')}
      </div>

    </div>
      
    </>
  );
};

export default About;