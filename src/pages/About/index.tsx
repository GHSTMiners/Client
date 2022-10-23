import TwitterIcon from "assets/icons/twitter.svg"
import DiscordIcon from "assets/icons/discord.svg"
import YoutubeIcon from "assets/icons/youtube.svg"
import { ICONHEIGHT } from "helpers/vars";
import GotchiPreview from "components/GotchiPreview";
import styles from "./styles.module.css";
import globalStyles from 'theme/globalStyles.module.css';

const About = (): JSX.Element => {

  const renderGotchiTile = (name: string, twitter:string, discord:string, role:string, gotchiID:string , aboutme:string ,description?:string) =>{
    //side={0}  options={{ animate: true, removeBg: true }} 
    return(
      <div className={styles.gotchiTileContainer} key={name}>
        <div className={styles.gotchiTileHeader}>
          <div className={styles.gotchiTitle}>{name}</div>
          <div>{role}</div>
        </div>
        <div className={styles.socialMedia}>
          <span><img src={TwitterIcon} style={{ height: ICONHEIGHT }} alt={'Twitter'}/> {twitter}</span>
          <span><img src={DiscordIcon} style={{ height: ICONHEIGHT }} alt={'Discord'}/> {discord}</span>
        </div>
        <div> 
          {aboutme}
        </div>
        <div className={styles.gotchiPreview}>          
          <GotchiPreview tokenId={gotchiID} />
          {description}
        </div>
      </div>
    )
  }

  return (
    <>
    <div className={styles.basicGrid}>

      <div className={`${globalStyles.gridTile} ${styles.gaameJaam}`}>
        <div className={globalStyles.tileTitle}>Gaame Jaam</div>
        <div className={globalStyles.tileContent}>
           A demo version of this game was developed for the first Aavegotchi
          Gaame Jaam, winning the first prize in the competition. PixelCraft further sponsored the development of the first
          server-secured version of the game.
        </div>
      </div>
      <div className={`${globalStyles.gridTile} ${styles.ghostSquad}`}>
        <div className={globalStyles.tileTitle}>Ghost Squad</div>
        <div className={styles.guildTile}>
          <div className={globalStyles.tileContent}>
            We manage the Ghost Squad, an active community of Gotchiverse addicts, game developers and content creators who like to hang around in district 40 with their frens. Interested? Join us!
          </div>
          <div className={styles.guildMediaContainer}>
          <div className={styles.socialMedia}>
            <span> 
              <img src={TwitterIcon} style={{ height: ICONHEIGHT }} alt={'Twitter'}/> 
              <a href="https://twitter.com/gotchighstsquad" rel="noreferrer"> TWITTER </a> 
              </span>
            <span> 
              <img src={DiscordIcon} style={{ height: ICONHEIGHT }} alt={'Discord'}/> 
              <a href="https://discord.gg/HA6qkpDPCY" rel="noreferrer"> DISCORD </a> 
              </span>
            <span> 
              <img src={YoutubeIcon} style={{ height: ICONHEIGHT }} alt={'YouTube'}/> 
              <a href="https://www.youtube.com/channel/UCcL-0-x85GiDRl7_udQaQhg" rel="noreferrer"> YOUTUBE </a> 
            </span>
          </div>
          </div>
        </div>
      </div>
      <div className={`${globalStyles.gridTile} ${styles.donations}`}>
        <div className={globalStyles.tileTitle}>Donations</div>
        <div className={globalStyles.tileContent}>
          <span>
            If you would like to support this game, feel free to send a donation {` `}
            <a href="https://polygonscan.com/address/0x3B9b1E6aD616faEAa9957Ebd2a05B3b50C83efCA" rel="noreferrer">here </a>
          </span>
        </div>
      </div>
      <div className={`${globalStyles.gridTile} ${styles.gotchiTile} ${styles.smokey}`}>
        {renderGotchiTile('SmokeyTheBandit',
                          '@smokeyZheBandit',
                          'smokeythebandit#9941',
                          'Full Stack Developer',
                          '22536',
                          'Security speciallist, embedded software developer and full-stack beast. Computers fear him, he has been coding since he was 8, has not stopped since',
                          'VOYAGER was carefully named after a product created by Smokey in real life.')}
      </div>
      <div className={`${globalStyles.gridTile} ${styles.gotchiTile} ${styles.gotchinomics}`}>
        {renderGotchiTile('Gotchinomics',
                          '@gotchinomics',
                          'Gotchinomics#4936',
                          'Front-End Developer',
                          '3934',
                          'Data scientist fascinated by Aavegotchi and the Gotchiverse Realm. He went from MatLab and spreadsheets, to web3 development after doing an [aawesome] Aavegotchi mini-game tutorial.',
                          'YODA is a gotchi politician, involved in several DAO proposals.')}
      </div>
      <div className={`${globalStyles.gridTile} ${styles.gotchiTile} ${styles.fabio}`}>
        {renderGotchiTile('ItsaMeFabio',
                          '@itsamefabio94',
                          'ItsaMeFabio#4252',
                          'Multi-Media Designer',
                          '21223',
                          'Multimedia specialist (game) designer and animator. Blessed by the VRF gods, he has proven to be able to defy unlikely odds in every raffle.',
                          'CORLEONE was born as a result of the profits achieved from Baazaar trading, GMB auctions and Raffles.')}
      </div>
      <div className={`${globalStyles.gridTile} ${styles.gotchiTile} ${styles.machete}`}>
        {renderGotchiTile('Machete',
                          '@crypto_Toupa',
                          'Machete#9873',
                          'Sound Designer & Tester',
                          '23492',
                          'Machete, aka KEK Lord, outperforms smart contracts and bots by perfectioning the art of a well-timed F5 press.',
                          'MACHETE is one of the strongest gotchis of the Ghost Squad, always ready to protect his frens.')}
      </div>

    </div>
      
    </>
  );
};

export default About;