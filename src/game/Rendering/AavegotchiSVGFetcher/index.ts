import Web3 from "web3";
import { AbiItem } from "web3-utils/types";
import { Contract } from "web3-eth-contract";
import diamondABI from "../../../web3/abi/diamond.json";
import Config from "config";
import { Tuple } from "types";

export default class AavegotchiSVGFetcher {
  constructor() {
    //Initialize web3 using polygon rpc
    this.web3 = new Web3("https://rpc.ankr.com/polygon");
    //Load our smart contract
    const diamondAddress = "0x86935F11C86623deC8a25696E1C19a8659CbF95d";
    this.aavegotchiFacet = new this.web3.eth.Contract(
      diamondABI as AbiItem[],
      diamondAddress
    );
  }

  public async frontWithoutBackground(aavegotchiID: number): Promise<string> {
    let svg: string = '';
    try {
      svg = await this.aavegotchiFacet.methods
        .getAavegotchiSvg(aavegotchiID)
        .call();
    } catch (error) {
      console.log(error);
    }
    svg = svg.replace(
      "<style>",
      "<style>.gotchi-bg,.wearable-bg{display: none}"
    );
    return svg.replace(
      "<svg",
      `<svg height="${Config.blockHeight}" width="${Config.blockWidth}" `
    );
  }

  public async getSideviews(aavegotchiID: number): Promise<Tuple<string, 4>> {
    let svg: Tuple<string, 4> = [ '', '', '', '' ];
    try {
     svg = await this.aavegotchiFacet.methods
      .getAavegotchiSideSvgs(aavegotchiID)
      .call();
    } catch (error) {
      console.log(error);
    }
    return svg;
  }

  private web3: Web3;
  private aavegotchiFacet: Contract;
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
