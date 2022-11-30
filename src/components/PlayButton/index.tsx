import React from "react";
import styles from "./styles.module.css";


interface Props {
  textLabel?: string;
  children?: React.ReactNode;
  onClick?: () => void;
  width?: string;
  fontSize?: string;
  disabled?: boolean;
}

const PlayButton: React.FC<Props> = ({
  children,
  onClick,
  width='8rem',
  fontSize='1.2rem',
  disabled,
}) => {

  return (
    <button
      onClick={onClick}
      className={styles.greenButton}
      disabled={disabled}>
      <div className={styles.buttonText} style={{ width: width, fontSize: fontSize}}>
        PLAY
      </div>
    </button>
  );
};

export default PlayButton;
