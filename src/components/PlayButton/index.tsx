import React from "react";
import { useGlobalStore } from "store";
import styles from "./styles.module.css";
import { SpinnerDotted } from 'spinners-react';


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
  const isWalletLoaded = useGlobalStore( state => state.isWalletLoaded )
  return (
    <button
      onClick={onClick}
      className={styles.greenButton}
      disabled={ disabled}
    >
      <div className={styles.buttonText} style={{ width: width, fontSize: fontSize}}>
        {isWalletLoaded? children : <SpinnerDotted color={'2a2a2acc'} />  }
      </div>
    </button>
  );
};

export default PlayButton;
