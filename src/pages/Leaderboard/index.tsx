import styles from "./styles.module.css";
import { Header } from "components";

const About = (): JSX.Element => {
  return (
    <>
      <div className={styles.backgroundContainer}>
      <Header />
          <p>THE LEADERBOARD IS COMING....</p>
      </div>
    </>
  );
};

export default About;
