import styles from "./styles.module.css";
import { Header } from "components";
import SmokeyIm from "assets/images/smokeytheybandit.png";
import FabioIm from "assets/images/corleone.jpg";
import MacheteIm from "assets/images/machete.jpg";
import GotchinomicsIm from "assets/images/gotchinomics.png";
import { FlipCard } from "components";

const About = (): JSX.Element => {
  return (
    <>
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
    </>
  );
};

export default About;
