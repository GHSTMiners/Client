import metaMaskIcon from "assets/icons/metamask.svg"
import frameIcon from "assets/icons/frame.svg"
import walletconnectIcon from "assets/icons/walletconnect.svg"
import { WalletApps } from "helpers/vars"

function renderWalletIcon (walletProviderApp : WalletApps) {
    switch (walletProviderApp){
      case WalletApps.Metamask:
        return(<img src={metaMaskIcon} alt={'MetaMask Wallet'}/>)
      case WalletApps.Frame:
        return(<img src={frameIcon} alt={'Frame Wallet'}/>)
      case WalletApps.WalletConnect:
        return(<img src={walletconnectIcon} alt={'WalletConnect Wallet'}/>)
      default:
        break;
    }  
}

  export default renderWalletIcon