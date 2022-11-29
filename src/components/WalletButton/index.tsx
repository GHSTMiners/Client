import { smartTrim } from "helpers/functions";
import { AuthenticatorState, WalletApps } from "helpers/vars";
import styles from "./styles.module.css";
import Client from "matchmaking/Client";
import { useGlobalStore } from "store";
import { useEffect } from "react";
import globalStyles from "theme/globalStyles.module.css";
import walletConnect from "assets/icons/wallet.svg"
import metaMaskIcon from "assets/icons/metamask.svg"

const WalletButton = () => {
    const address = useGlobalStore( state => state.usersWalletAddress)
    const authenticatorState = useGlobalStore( state => state.authenticatorState)
    const walletProviderApp = useGlobalStore( state => state.walletProviderApp)
   
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

    const renderWalletAppIcon = () => {
      switch (walletProviderApp){
        case WalletApps.Metamask:
          return(<img src={metaMaskIcon} alt={'MetaMask Wallet'}/>)
        default:
          break;
      }  
    }

    const renderWalletButton = () => {
        switch (authenticatorState){
            case AuthenticatorState.Disconnected:
                return(
                  <>CONNECT</>
                  )
            case AuthenticatorState.Authenticated:
              console.log(walletProviderApp)
                return(
                <div className={styles.walletWrapper}>
                  <img src={walletConnect} className={styles.walletIcon} alt={'Web3 Wallet'}/>
                  <div className={styles.connectedDetails}>
                    {address? smartTrim(address, 8):''}
                  </div>
                </div>)
            default:
              return('Loading...')
        }
    }  

    return (
      <div className={`${globalStyles.gridTile} ${styles.walletContainer}` }>
        <button className={styles.walletButton} onClick={handleWalletClick} hidden={false} >
          {renderWalletButton()}
        </button>
        <div className={styles.walletAppIcon}>
          {renderWalletAppIcon()}
        </div>
      </div>
    );
  };

  export default WalletButton