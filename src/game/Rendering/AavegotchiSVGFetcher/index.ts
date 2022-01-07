import Web3 from 'web3';
import { AbiItem } from 'web3-utils/types'
import { Contract } from 'web3-eth-contract';
import diamondABI from '../../../web3/abi/diamond.json'

export default class AavegotchiSVGFetcher {
    constructor(aavegotchiID : number) {
        //Initialize web3 using polygon rpc
        this.web3 = new Web3("https://polygon-rpc.com/")
        this.aavegotchiID = aavegotchiID
        //Load our smart contract
        const diamondAddress = '0x86935F11C86623deC8a25696E1C19a8659CbF95d';
        this.aavegotchiFacet = new this.web3.eth.Contract(diamondABI as AbiItem[], diamondAddress);
    }


    public async frontWithoutBackground() : Promise<string> {
        let svg : string = await this.aavegotchiFacet.methods.getAavegotchiSvg(this.aavegotchiID).call()
        return svg.replace(
            "<style>",
            "<style>.gotchi-bg,.wearable-bg{display: none}"
          );
    }

    
    private web3 : Web3
    private aavegotchiFacet : Contract 
    public readonly aavegotchiID : number
}