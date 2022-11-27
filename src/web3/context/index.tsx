import React, { createContext, useContext, useReducer } from "react";
import { ethers } from "ethers";
import { Action, reducer } from "./reducer";
import { initialState, State } from "./initialState";
import { callSubgraph } from "web3/actions";
import {
  AavegotchisOfOwner,
  getAllAavegotchisOfOwner,
} from "web3/actions/queries";
import Client from "matchmaking/Client";
import { useGlobalStore } from "store";


export const Web3Context = createContext<{
  state: State;
  dispatch: React.Dispatch<Action>;
}>({ state: initialState, dispatch: () => null });

declare global {
  interface Window {
    ethereum: any;
  }
}

interface Props {
  children: React.ReactNode;
}

const updateAavegotchis = async (
  dispatch: React.Dispatch<Action>,
  owner: string
) => {
  try {
    const res = await callSubgraph<AavegotchisOfOwner>(
      getAllAavegotchisOfOwner(owner)
    )
    useGlobalStore.getState().setUsersAavegotchis(res.aavegotchis);
    useGlobalStore.getState().setIsWalletLoaded(true);
    dispatch({
      type: "SET_USERS_AAVEGOTCHIS",
      usersAavegotchis: res.aavegotchis,
    });
  } catch (err) {
    dispatch({
      type: "SET_ERROR",
      error: err,
    });
  }
};

const getAavegotchis = async ( owner: string) => {
  try {
    const res = await callSubgraph<AavegotchisOfOwner>(
      getAllAavegotchisOfOwner(owner)
    )
    useGlobalStore.getState().setUsersAavegotchis(res.aavegotchis);
    useGlobalStore.getState().setIsWalletLoaded(true);
  } catch (err) {
    console.log(err)
  }
};

const connectToNetwork = async (dispatch: React.Dispatch<Action>, eth: any) => {
  if (process.env.REACT_APP_OFFCHAIN) return;

  dispatch({ type: "START_ASYNC" });
  try {
    await eth.enable();

    const provider = new ethers.providers.Web3Provider(eth);
    dispatch({ type: "SET_PROVIDER", provider });
    useGlobalStore.getState().setUsersProvider(provider);

    const { chainId } = await provider.getNetwork();
    dispatch({ type: "SET_NETWORK_ID", networkId: chainId });
    useGlobalStore.getState().setUsersChainId(chainId);

    // This was commented to use ETH address directly from the stored walled in the cookie
    const address = await provider.getSigner().getAddress();
    Client.getInstance().authenticationInfo.walletAddress = address
    dispatch({ type: "SET_ADDRESS", address });
    useGlobalStore.getState().setUsersWalletAddress(address);

    dispatch({ type: "END_ASYNC" });
  } catch (error) {
    dispatch({ type: "SET_ERROR", error });
  }
};



const Web3ContextProvider = ({ children }: Props) => {
  const [state, dispatch] = useReducer(reducer, initialState);
  const value = { state, dispatch };
  return <Web3Context.Provider value={value}>{children}</Web3Context.Provider>;
};

const useWeb3 = () => useContext(Web3Context);

export default Web3ContextProvider;
export { useWeb3, connectToNetwork, updateAavegotchis, getAavegotchis };
