import { AuthenticatorState } from "helpers/vars"
import styles from "./styles.module.css"
import walletIcon from "assets/icons/wallet.svg"
import { smartTrim } from "helpers/functions"
import Blockies from 'react-blockies'

function renderWalletButton (authenticatorState: AuthenticatorState, address: string | undefined) {
    switch (authenticatorState){
        case AuthenticatorState.Disconnected:
            return(
              <>
                <img src={walletIcon} className={styles.walletIcon} alt={'Web3 Wallet'}/>
                CONNECT
              </>
              )
        case AuthenticatorState.Authenticated:
            return(
            <div className={styles.walletWrapper}>
              <img src={walletIcon} className={styles.walletIcon} alt={'Web3 Wallet'}/>
              
              <div className={styles.connectedDetails}>
                {address? smartTrim(address, 8):''}
              </div>

              <Blockies
                    seed={address? address.toLowerCase(): ''}
                    size={8}
                    scale={4}
                    className={styles.blocky}
                />
            </div>)
        default:
          return('Connecting...')
    }
} 

export default renderWalletButton