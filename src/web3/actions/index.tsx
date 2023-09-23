import { request, ClientError } from "graphql-request";
import { addresses } from "helpers/vars";
import diamondAbi from "../abi/diamond.json";
import { ethers } from "ethers";
import { Tuple } from "types";
import { CodeError } from "web3/CodeError"
import Config from "config"

export const callSubgraph = async <T extends unknown>(
  query: string,
  uri?: string
): Promise<T> => {
  try {
    const data = await request<T>(uri || Config.graphURL, query);
    return data;
  } catch (err: unknown) {
    throw Object.assign(
      new CodeError(400,'Subgraph Error', err instanceof ClientError
      ? err.response.errors
        ? err.response.errors[0].message
        : "Unknown error"
      : "Unknown error"))
  }
};

type DiamondCallMethods =
  | { name: "currentHaunt"; parameters?: undefined }
  | { name: "getAavegotchiSvg"; parameters: [string] }
  | {
      name: "previewAavegotchi";
      parameters: [string, string, Tuple<number, 6>, Tuple<number, 16>];
    }
  | {
      name: "getAavegotchiSideSvgs";
      parameters: [string];
    }
  | {
      name: "previewSideAavegotchi";
      parameters: [string, string, Tuple<number, 6>, Tuple<number, 16>];
    };

export const callDiamond = async <R extends unknown>(
  provider: ethers.Signer | ethers.providers.Provider,
  method: DiamondCallMethods
): Promise<R> => {
  const contract = new ethers.Contract(addresses.diamond, diamondAbi, provider);
  try {
    const { name, parameters } = method;
    const res = await (parameters
      ? contract[name](...parameters)
      : contract[name]());
    return res;
  } catch (err: any) {
    throw Object.assign( new CodeError(400,'Diamond contract error', err.message, err.stack))
  }
};