import React from "react";
import styles from "./styles.module.css";

interface Props {
  textLabel?: string;
  children?: React.ReactNode;
  onClick?: () => void;
  width?: string;
  disabled?: boolean;
}

const GreenButton: React.FC<Props> = ({
  children,
  onClick,
  width,
  disabled,
}) => {
  return (
    <button
      onClick={onClick}
      className={styles.greenButton}
      disabled={disabled}
    >
      <div className={styles.buttonText}>{children}</div>
    </button>
  );
};

export default GreenButton;
