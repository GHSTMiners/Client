import styles from "./styles.module.css";
import SquareButton from "components/SquareButton";
import { BUTTONWIDTH } from "helpers/vars"

const Artifacts = () => {
  const artifactList = [];

  for (let i = 1; i < 5; i++) {
    artifactList.push(<SquareButton size={BUTTONWIDTH} quantity={-1} key={`artifact${i}`}></SquareButton>);
  }

  return (
    <div className={styles.artifactsContainer}>
      <div className={styles.sectionTitle}>ARTIFACTS</div>
      <div className={styles.artifactItems}>{artifactList}</div>
    </div>
  );
};

export default Artifacts;
