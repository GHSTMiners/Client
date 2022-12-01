import { AuthenticatorState } from "helpers/vars";
import styles from "./styles.module.css";
import Client from "matchmaking/Client";
import { useGlobalStore } from "store";
import { useEffect } from "react";
import globalStyles from "theme/globalStyles.module.css";
import renderWalletIcon from "./renderWalletIcon";
import renderWalletButton from "./renderWalletButton";
import ReactTooltip from "react-tooltip";

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
                const answer = window.confirm("You are about to DISCONECT your wallet from this website, are you sure?");
                if (answer) Client.getInstance().authenticator.signOut()
                break;
            default:
              break;
        }
    };

    useEffect(() => {
      const changeAccount = () => Client.getInstance().authenticator.authenticate()
      const changeChain = () => Client.getInstance().authenticator.authenticate()
      window.ethereum?.on("accountsChanged", changeAccount);
      window.ethereum?.on("chainChanged", changeChain );
      return () => {
        window.ethereum?.off("accountsChanged", changeAccount);
        window.ethereum?.off("chainChanged", changeChain );
      }
    }, []);

    return (
      <div className={`${globalStyles.gridTile} ${styles.walletContainer} ${(authenticatorState===AuthenticatorState.Disconnected)? styles.pulsatingGlow : null}` }>
        <button className={styles.walletButton} onClick={handleWalletClick} hidden={false} data-tip={'Click to DISCONNECT'} >
          <ReactTooltip  effect="solid" disable={(authenticatorState!==AuthenticatorState.Authenticated)}/>
          {renderWalletButton(authenticatorState,address)}
        </button>
        <div className={styles.walletAppIcon}>
          {renderWalletIcon(walletProviderApp)}
        </div>
      </div>
    );
  };

  export default WalletButton