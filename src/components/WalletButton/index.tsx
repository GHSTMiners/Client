import { smartTrim } from "helpers/functions";
import { networkIdToName, AuthenticatorState } from "helpers/vars";
import styles from "./styles.module.css";
import Client from "matchmaking/Client";
import { useGlobalStore } from "store";
import { useEffect } from "react";

const WalletButton = () => {
    const networkId = useGlobalStore(state => state.usersChainId)
    const address = useGlobalStore( state => state.usersWalletAddress)
    const authenticatorState = useGlobalStore( state => state.authenticatorState)
   
    const handleWalletClick = () => {
        switch (authenticatorState){
            case AuthenticatorState.Disconnected:
                Client.getInstance().authenticator.authenticate()
                break;
            case AuthenticatorState.Authenticated:
                Client.getInstance().authenticator.signOut()
                break;
            default:
              break;
        }
    };

    useEffect(() => {
      const changeAccount = () => Client.getInstance().authenticator.authenticate()
      const changeChain = () => Client.getInstance().authenticator.authenticate()
      window.ethereum.on("accountsChanged", changeAccount);
      window.ethereum.on("chainChanged", changeChain );
  
      return () => {
        window.ethereum.off("accountsChanged", changeAccount);
        window.ethereum.off("chainChanged", changeChain );
      }
  
    }, []);

    const renderWalletButton = () => {
        switch (authenticatorState){
            case AuthenticatorState.Disconnected:
                return('Connect')
            case AuthenticatorState.Authenticated:
                return(
                <div className={styles.walletAddress}>
                  <div className={styles.connectedDetails}>
                    <p>{networkId ? networkIdToName[networkId] : ""}</p>
                    <p>{address? smartTrim(address, 8):''}</p>
                  </div>
                </div>)
            default:
              console.log(`Render wallet reading state: ${authenticatorState}`)
              return('Loading...')
        }
    }  

    return (
      <button className={styles.walletContainer} onClick={handleWalletClick} hidden={false} >
        {renderWalletButton()}
      </button>
    );
  };

  export default WalletButton