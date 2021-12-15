import { AavegotchiObject } from "types";
import { Web3Provider } from "@ethersproject/providers";

export interface State {
  address?: string;
  provider?: Web3Provider;
  usersAavegotchis?: Array<AavegotchiObject>;
  selectedAavegotchiId?: string;
  loading: boolean;
  error?: Error | unknown;
  networkId?: number;
}

export const initialState: State = {
  loading: false,
  address: "0xE88632728Ed377f556cB964e6F670f6017d497e4",
};
