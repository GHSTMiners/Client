import Web3 from "web3";
import Portis from "@portis/web3";
import Web3Modal from "web3modal";
import { ethers } from "ethers";
import WalletConnectProvider from "@walletconnect/web3-provider";
import $ from "jquery";
import Cookies from 'js-cookie'
import { Action } from "web3/context/reducer";

export default class Authenticator {
    constructor() {
      this.m_web3 = new Web3()
      this.m_state = AuthenticatorState.Start
      this.m_chainId = 0;
      this.m_challenge = ""
      this.m_currentAccount = ""
      this.m_signedChallenge = ""
      this.m_token = ""
    }

    public authenticate(dispatch?: React.Dispatch<Action>) {
      if(this.m_state == AuthenticatorState.Start) {
        try{
          this.m_dispatch = dispatch
          this.runStateMachine()
        } catch(error) {
          if(dispatch) dispatch({ type: "SET_ERROR", error} )
        }
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
      return this.m_state;
    }

    public signOut() {
      if(this.m_state == AuthenticatorState.Authenticated) {
        Cookies.remove(`token_${this.m_chainId}_${this.m_currentAccount}`)
      } else console.log('You need to be authenticated to sign out')
    }

    private runStateMachine() {
      console.log(`Authentication state: ${this.m_state}`)
      switch(this.m_state)
      {
          case AuthenticatorState.Start:
            if(this.m_dispatch) this.m_dispatch({ type: "START_ASYNC" });
            this.connectToWallet();
          break;
          case AuthenticatorState.WalletConnected:
          //Fetch token from cookies
          let cookieToken : string | undefined = Cookies.get(`token_${this.m_chainId}_${this.m_currentAccount}`)
          if(cookieToken) {
            this.m_token = cookieToken
            this.m_state = AuthenticatorState.ValidatingToken;
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
            const chainId = this.m_chainId;
            const address = this.m_currentAccount;
            const provider = new ethers.providers.Web3Provider(this.m_web3.currentProvider as any);
            if(this.m_dispatch) {
              this.m_dispatch({ type: "SET_PROVIDER", provider})
              this.m_dispatch({ type: "SET_NETWORK_ID", networkId: chainId });
              this.m_dispatch({ type: "SET_ADDRESS", address });
              this.m_dispatch({ type: "END_ASYNC" });
            }
          break;
      }
    }

    private async validateToken() {
      var self = this;
      $.post( "https://chisel.gotchiminer.rocks/api/token/validate", { wallet_address: this.m_currentAccount, token: this.m_token } , async function(data, succes ) {
        if(succes) {
          if(data['success']) {
            self.m_state = AuthenticatorState.Authenticated
            self.runStateMachine();
          } else {
            Cookies.remove(`token_${self.m_chainId}_${self.m_currentAccount}`)
            self.m_state = AuthenticatorState.Start
            alert("Server rejected your token!")
          }
        } else {
          alert("Server refused your request!")
        }
      });
    }

    private async validateSignature() {
      var self = this;
      var jqxhr = $.post( "https://chisel.gotchiminer.rocks/api/wallet/validate", { wallet_address: this.m_currentAccount, chain_id: this.m_chainId, challenge: this.m_challenge, signature: this.m_signedChallenge } , async function(data, succes ) {
        if(succes) {
          Cookies.set(`token_${self.m_chainId}_${self.m_currentAccount}`, data.token, {expires : 356})
          self.m_token = data.token
          self.m_state = AuthenticatorState.ValidatingToken
          self.runStateMachine();
        } else {
          self.m_state = AuthenticatorState.Start
          alert("Server refused your request!")
        }
      });
    }

    private async requestSignature() {
      var self = this;
      this.m_web3.eth.personal.sign(this.m_challenge, this.m_currentAccount, "", function(error: Error, signature: string) {
        if(error) {
          alert('You need to sign the challenge in order to validate your wallet ownership!');
        } else {
          self.m_signedChallenge = signature
          self.m_state = AuthenticatorState.ValidatingSignature
          self.runStateMachine()
        }
      });
    }

    private async fetchChallenge() {
      var self = this;
      //Fetch challenge from server
        $.post( "https://chisel.gotchiminer.rocks/api/wallet/challenge", { wallet_address: this.m_currentAccount, chain_id: this.m_chainId } , async function(data, succes) {
          if(succes) {
            self.m_challenge = data.challenge;
            self.m_state = AuthenticatorState.AwaitingSignature
            self.runStateMachine()
          } else {
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

      const web3Modal = new Web3Modal({
        network: "matic", // optional
        theme: "dark",
        cacheProvider: true, // optional
        providerOptions // required
      });

      //Connect to wallet
      const provider = await web3Modal.connect();
      if(provider) {
        var self = this;
        this.m_web3 = new Web3(provider);
        //Check if we are on the right chain (Polygon or Ethereum)
        this.m_chainId = await this.m_web3.eth.getChainId();
        if (!(this.m_chainId === 137)) {
          alert('This game only works with Aavegotchis on the Polygon network.' )
          return;
        }
        //Get accounts and sign message using first account
        this.m_web3.eth.getAccounts(async function(error: Error, accounts: string[]) {
          //Assign current account
          self.m_currentAccount = accounts[0];
          self.m_state = AuthenticatorState.WalletConnected
          self.runStateMachine()
        });
      } else {
        console.log(`Failed to connect to wallet`)
      }
    }

    private m_web3: Web3
    private m_token : string
    private m_chainId : number
    private m_state : AuthenticatorState
    private m_challenge : string
    private m_signedChallenge : string
    private m_currentAccount : string
    private m_dispatch?: React.Dispatch<Action>
}

export enum AuthenticatorState{
    Start = "Start",
    WalletConnected = "WalletConnected",
    AwaitingSignature = "AwaitingSignature",
    ValidatingSignature = "ValidatingSignature",
    ValidatingToken = "ValidatingToken",
    Authenticated = "Authenticated"
}

