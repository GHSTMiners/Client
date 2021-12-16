export default class Config {

    public static colyseusURL : string = 'wss://server.gotchiminer.rocks'
    public static apiURL : string = 'https://chisel.gotchiminer.rocks/api'
    public static blockWidth : number = 128
    public static blockHeight : number = 128
    public static skyLayers : number = 68
    public static skyHeight : number = Config.blockHeight * Config.skyLayers
    public static blockWidthOffset = Config.blockWidth / 2
    public static blockHeightOffset = Config.blockHeight / 2

}