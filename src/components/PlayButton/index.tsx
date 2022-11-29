import React from "react";
import { useGlobalStore } from "store";
import styles from "./styles.module.css";
import { SpinnerDotted } from 'spinners-react';
import { AuthenticatorState } from "helpers/vars";


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
  const authenticatorState = useGlobalStore( state => state.authenticatorState )
  
  const renderPlayButton = () => {
    switch (authenticatorState){
        case AuthenticatorState.Disconnected:
            return(
              <></>
              )
        case AuthenticatorState.Authenticated:
            return(
              'PLAY')
        default:
          return( <SpinnerDotted color={'2a2a2acc'} />)
    }
  }

  return (
    <button
      onClick={onClick}
      className={`${styles.greenButton} ${(authenticatorState === AuthenticatorState.Disconnected)? styles.noWallet : null }`}
      disabled={ disabled}
    >
      <div className={styles.buttonText} style={{ width: width, fontSize: fontSize}}>
        {renderPlayButton()}
      </div>
    </button>
  );
};

export default PlayButton;
