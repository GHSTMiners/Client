import styles from "./styles.module.css";
import SquareButton from "components/SquareButton";

const Artifacts = () => {
  const smallButton = "3.3rem";
  const artifactList = [];

  for (let i = 1; i < 5; i++) {
    artifactList.push(<SquareButton size={smallButton}>ITEM {i}</SquareButton>);
  }

  return (
    <div className={styles.artifactsContainer}>
      <div className={styles.sectionTitle}>ARTIFACTS</div>
      <div className={styles.artifactItems}>{artifactList}</div>
    </div>
  );
};

export default Artifacts;