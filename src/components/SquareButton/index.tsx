import React from "react";
import styles from "./styles.module.css";

interface Props {
  quantity?: number;
  children?: React.ReactNode;
  onClick?: () => void;
  size?: string;
  disabled?: boolean;
}

const SquareButton: React.FC<Props> = ({
  quantity=0 ,
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
      <div className={`${styles.buttonText} ${quantity<1? styles.disabled: '' }`} style={{ width: size, height: size }}>
        {children}
      </div>
      <div className={styles.quantity}>
        { quantity>=0 ? `x  ${quantity}` : ''}
      </div>
    </button>
  );
};

export default SquareButton;
