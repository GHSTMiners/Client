import Web3 from "web3";
import Portis from "@portis/web3";
import Web3Modal from "web3modal";
import WalletConnectProvider from "@walletconnect/web3-provider";
import $ from "jquery";
import Cookies from 'js-cookie'
import { useGlobalStore } from "store";
import { AuthenticatorState, WalletApps } from "helpers/vars";

export default class Authenticator {
    constructor() {
      this.m_web3 = new Web3()
      this.m_web3Modal = new Web3Modal();
      this.m_chainId = 0;
      this.m_challenge = ""
      this.m_currentAccount = ""
      this.m_signedChallenge = ""
      this.m_token = ""
      this.runStateMachine()
    }

    public authenticate() {
        try{
          useGlobalStore.getState().setAuthenticatorState( AuthenticatorState.Start );
          this.runStateMachine()
        } catch(error) {
          console.log(error)
        }
    }

    public token() : string {
      return this.m_token;
    }

    public chainId() : number {
      return this.m_chainId;
    }

    public currentAccount() : string {
      return this.m_currentAccount;
    }

    public state() : AuthenticatorState {
      return useGlobalStore.getState().authenticatorState;
    }

    public signOut() {
      if( useGlobalStore.getState().authenticatorState === AuthenticatorState.Authenticated) {
        this.m_web3Modal.clearCachedProvider();
        useGlobalStore.getState().clearUserWeb3Data();
        Cookies.remove(`token_${this.m_chainId}_${this.m_currentAccount}`)
        useGlobalStore.getState().setAuthenticatorState( AuthenticatorState.Disconnected );
      } else {
        console.log('You need to be authenticated to sign out')
        useGlobalStore.getState().setAuthenticatorState( AuthenticatorState.Disconnected )
      }
    }

    private runStateMachine() {
      console.log(`Authentication state: ${useGlobalStore.getState().authenticatorState}`)
      switch( useGlobalStore.getState().authenticatorState ) {
        case AuthenticatorState.Start:
          this.connectToWallet();
          break;
        case AuthenticatorState.WalletConnected:
          //Fetch token from cookies
          let cookieToken : string | undefined = Cookies.get(`token_${this.m_chainId}_${this.m_currentAccount}`)
          if(cookieToken) {
            this.m_token = cookieToken
            useGlobalStore.getState().setAuthenticatorState( AuthenticatorState.ValidatingToken )
            this.runStateMachine();
          } else this.fetchChallenge();
          break;
        case AuthenticatorState.AwaitingSignature:
          this.requestSignature();
          break;
        case AuthenticatorState.ValidatingSignature:
          this.validateSignature();
          break;
        case AuthenticatorState.ValidatingToken:
          this.validateToken();
          break;
        case AuthenticatorState.Authenticated:
          useGlobalStore.getState().setAuthenticatorState(AuthenticatorState.Authenticated)
          useGlobalStore.getState().setIsWalletLoaded(true);
          break;
      }
    }

    private async validateToken() {
      $.post( "https://chisel.gotchiminer.rocks/api/token/validate", { wallet_address: this.m_currentAccount, token: this.m_token } , async (data, succes) => {
        if(succes) {
          if(data['success']) {
            useGlobalStore.getState().setAuthenticatorState( AuthenticatorState.Authenticated )
            this.runStateMachine();
          } else {
            Cookies.remove(`token_${this.m_chainId}_${this.m_currentAccount}`)
            useGlobalStore.getState().setAuthenticatorState( AuthenticatorState.Disconnected )
            alert("Server rejected your token!")
          }
        } else {
          useGlobalStore.getState().setAuthenticatorState( AuthenticatorState.Disconnected )
          alert("Server refused your request!")
        }
      });
    }

    private async validateSignature() {
      $.post( "https://chisel.gotchiminer.rocks/api/wallet/validate", { wallet_address: this.m_currentAccount, chain_id: this.m_chainId, challenge: this.m_challenge, signature: this.m_signedChallenge } , async ( data, succes ) => {
        if(succes) {
          Cookies.set(`token_${this.m_chainId}_${this.m_currentAccount}`, data.token, {expires : 356})
          this.m_token = data.token
          useGlobalStore.getState().setAuthenticatorState( AuthenticatorState.ValidatingToken )
          this.runStateMachine();
        } else {
          useGlobalStore.getState().setAuthenticatorState( AuthenticatorState.Disconnected )
          alert("Server refused your request!")
        }
      });
    }

    private async requestSignature() {
      this.m_web3.eth.personal.sign(this.m_challenge, this.m_currentAccount, "", (error: Error, signature: string) => {
        if(error) {
          useGlobalStore.getState().setAuthenticatorState( AuthenticatorState.Disconnected )
          alert('You need to sign the challenge in order to validate your wallet ownership');
        } else {
          this.m_signedChallenge = signature
          useGlobalStore.getState().setAuthenticatorState( AuthenticatorState.ValidatingSignature )
          this.runStateMachine()
        }
      });
    }

    private async fetchChallenge() {
      //Fetch challenge from server
        $.post( "https://chisel.gotchiminer.rocks/api/wallet/challenge", { wallet_address: this.m_currentAccount, chain_id: this.m_chainId } , async (data, succes) => {
          if(succes) {
            this.m_challenge = data.challenge;
            useGlobalStore.getState().setAuthenticatorState( AuthenticatorState.AwaitingSignature )
            this.runStateMachine()
          } else {
            useGlobalStore.getState().setAuthenticatorState( AuthenticatorState.Disconnected )
            alert("Could not fetch challenge from server, maybe we're having server issues?")
          }
      });
    }

    private async connectToWallet() {
      const providerOptions = {
        // Example with WalletConnect provider
        walletconnect: {
          display: {
            description: "Scan qrcode with your mobile wallet"
          },
          package: WalletConnectProvider,
          options: {
            infuraId: "INFURA_ID", // required
            rpc: {
              137: "https://rpc-mainnet.matic.network",
            }
          }
        },
        portis: {
          package: Portis, // required
          options: {
            id: "08b3b594-a3c3-4e3d-a3be-733ca27bffaf" // required
          }
        }
      };

      this.m_web3Modal = new Web3Modal({
        network: "matic", // optional
        theme: "dark",
        cacheProvider: true, // optional
        providerOptions // required
      });

      //Connect to wallet
      try {
        const provider = await this.m_web3Modal.connect();
        if(provider) {
            // black magic to bypass the proxy handler and access otherwise unreachable properties
            const provider_target =  Object.assign({}, provider);
            if (provider_target.wc) useGlobalStore.getState().setWalletProviderApp( WalletApps.WalletConnect );
            if (provider_target.isMetaMask) useGlobalStore.getState().setWalletProviderApp( WalletApps.Metamask );
            if (provider_target.isFrame) useGlobalStore.getState().setWalletProviderApp( WalletApps.Frame );
            useGlobalStore.getState().setUsersProvider(provider);
            this.m_web3 = new Web3(provider);
            //Check if we are on the right chain (Polygon or Ethereum)
            const chainId = await this.m_web3.eth.getChainId();
            this.m_chainId = chainId;
            useGlobalStore.getState().setUsersChainId(chainId);

            if (!(this.m_chainId === 137)) {
              alert('This game only works with Aavegotchis on the Polygon network.' )
              return;
            }
            //Get accounts and sign message using first account
            this.m_web3.eth.getAccounts(async (error: Error, accounts: string[]) => {
              if (accounts.length > 1) alert('There are multiple wallet accounts connected to this site, we will use the first one by default. Please disconnect uncessary accounts from this site using your wallet application.')
              //Assign current account
              this.m_currentAccount = accounts[0];
              useGlobalStore.getState().setAuthenticatorState( AuthenticatorState.WalletConnected )
              this.runStateMachine()
              useGlobalStore.getState().setUsersWalletAddress(accounts[0]);
            });
        } else {
          console.log(`Failed to connect to wallet`)
          useGlobalStore.getState().setAuthenticatorState( AuthenticatorState.Disconnected )
        }
      } catch (e) {
        console.log("Could not get a wallet connection", e);
        useGlobalStore.getState().setAuthenticatorState( AuthenticatorState.Disconnected )
        return;
      }
    }
    public  m_web3: Web3
    private m_web3Modal: Web3Modal
    private m_token : string
    private m_chainId : number
    private m_challenge : string
    private m_signedChallenge : string
    private m_currentAccount : string
}



