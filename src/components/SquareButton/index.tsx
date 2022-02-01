import React from "react";
import styles from "./styles.module.css";

interface Props {
  textLabel?: string;
  children?: React.ReactNode;
  onClick?: () => void;
  size?: string;
  disabled?: boolean;
}

const SquareButton: React.FC<Props> = ({
  children,
  onClick,
  size,
  disabled,
}) => {
  return (
    <button
      onClick={onClick}
      className={styles.squareButton}
      disabled={disabled}
    >
      <div className={styles.buttonText} style={{ width: size, height: size }}>
        {children}
      </div>
    </button>
  );
};

export default SquareButton;
