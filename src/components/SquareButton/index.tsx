import React from "react";
import styles from "./styles.module.css";

interface Props {
  quantitiy?: number;
  children?: React.ReactNode;
  onClick?: () => void;
  size?: string;
  disabled?: boolean;
}

const SquareButton: React.FC<Props> = ({
  quantitiy=0 ,
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
      <div className={`${styles.buttonText} ${quantitiy<1? styles.disabled: '' }`} style={{ width: size, height: size }}>
        {children}
      </div>
      <div className={styles.quantity}>
        { quantitiy>=0 ? `x  ${quantitiy}` : ''}
      </div>
    </button>
  );
};

export default SquareButton;
