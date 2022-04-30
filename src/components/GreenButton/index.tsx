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

const GreenButton: React.FC<Props> = ({
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
      disabled={disabled}
    >
      <div className={styles.buttonText} style={{ width: width, fontSize: fontSize}}>{children}</div>
    </button>
  );
};

export default GreenButton;
