import Web3 from "web3";
import { AbiItem } from "web3-utils/types";
import { Contract } from "web3-eth-contract";
import diamondABI from "../../../web3/abi/diamond.json";
import Config from "config";
import { Tuple } from "types";

export default class AavegotchiSVGFetcher {
  constructor(aavegotchiID: number) {
    //Initialize web3 using polygon rpc
    this.web3 = new Web3("https://rpc.ankr.com/polygon");
    this.aavegotchiID = aavegotchiID;
    //Load our smart contract
    const diamondAddress = "0x86935F11C86623deC8a25696E1C19a8659CbF95d";
    this.aavegotchiFacet = new this.web3.eth.Contract(
      diamondABI as AbiItem[],
      diamondAddress
    );
  }

  public async frontWithoutBackground(): Promise<string> {
    let svg: string = await this.aavegotchiFacet.methods
      .getAavegotchiSvg(this.aavegotchiID)
      .call();
    svg = svg.replace(
      "<style>",
      "<style>.gotchi-bg,.wearable-bg{display: none}"
    );
    return svg.replace(
      "<svg",
      `<svg height="${Config.blockHeight}" width="${Config.blockWidth}" `
    );
  }

  public async getSideviews(): Promise<Tuple<string, 4>> {
    let svg: Tuple<string, 4> = await this.aavegotchiFacet.methods
      .getAavegotchiSideSvgs(this.aavegotchiID)
      .call();
    return svg;
  }

  private web3: Web3;
  private aavegotchiFacet: Contract;
  public readonly aavegotchiID: number;
}

/*
    // from Coyote, an example found on his Github
    // Given tokenId, return Aavegotchi sideviews   
    const getAavegotchiSideview = async (
        tokenId: string,
        contract: ethers.Contract
      ) => {
        try {
          // Returns an array of SVGs corresponding to each side of the Aavegotchi
          const res = await contract.getAavegotchiSideSvgs(tokenId);
          setSelectedGotchiSideviews(res);
        } catch (error) {
          console.log(error);
        }
      };
*/
