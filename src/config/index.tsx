export default class Config {
  public static colyseusURL: string = (process.env.NODE_ENV === 'production') ? "wss://server.gotchiminer.rocks" : "ws://localhost:2567";
  public static apiURL: string = "https://chisel.gotchiminer.rocks/api";
  public static storageURL: string = "https://chisel.gotchiminer.rocks/storage";
  public static graphURL: string = "https://subgraph.satsuma-prod.com/tWYl5n5y04oz/aavegotchi/aavegotchi-core-matic/api";
  public static defaultRPC: string = "https://rpc.ankr.com/polygon";
  public static blockWidth: number = 128;
  public static blockHeight: number = 128;
  public static skyLayers: number = 68;
  public static skyHeight: number = Config.blockHeight * Config.skyLayers;
  public static blockWidthOffset = Config.blockWidth / 2;
  public static blockHeightOffset = Config.blockHeight / 2;
}

// https://api.thegraph.com/subgraphs/name/aavegotchi/aavegotchi-core-matic // default graphURL temporarilly broken