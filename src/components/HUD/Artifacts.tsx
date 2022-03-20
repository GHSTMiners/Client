import styles from "./styles.module.css";
import SquareButton from "components/SquareButton";
import { smallButton } from ".";

const Artifacts = () => {
  const artifactList = [];

  for (let i = 1; i < 5; i++) {
    artifactList.push(<SquareButton size={smallButton} quantity={-1} ></SquareButton>);
  }

  return (
    <div className={styles.artifactsContainer}>
      <div className={styles.sectionTitle}>ARTIFACTS</div>
      <div className={styles.artifactItems}>{artifactList}</div>
    </div>
  );
};

export default Artifacts;
