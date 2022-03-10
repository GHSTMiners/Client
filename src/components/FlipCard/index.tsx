import styles from "./styles.module.css";
import { FaTwitter } from "react-icons/fa";
import { FaDiscord } from "react-icons/fa";

interface Props {
  imageURL?: string;
  title?: string;
  description?: string;
  twitter?: string;
  discord?: string;
}

export const FlipCard = ({
  imageURL,
  title,
  description,
  twitter,
  discord,
}: Props) => {
  return (
    <div className={styles.flipCard}>
      <div className={styles.flipCardInner}>
        <div className={styles.flipCardFront}>
          <img src={imageURL} className={styles.cardImage} alt={title} />
        </div>
        <div className={styles.flipCardBack}>
          <div className={styles.cardText}>
            <h2>{title}</h2>
            <p>{description}</p>
            <div>
              <FaTwitter /> {twitter}
            </div>
            <div>
              <FaDiscord /> {discord}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
