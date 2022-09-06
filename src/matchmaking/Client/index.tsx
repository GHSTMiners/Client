import * as Chisel from "chisel-api-interface";
import * as Colyseus from "colyseus.js";
import Config from "config";
import { World } from "matchmaking/Schemas/World";
import * as Protocol from "gotchiminer-multiplayer-protocol";
import Phaser from "phaser";
import * as Schema from "matchmaking/Schemas";
import Authenticator from "matchmaking/Authenticator";
import { Lobby } from "matchmaking/Schemas/Lobby";
import ServerLocator from "matchmaking/ServerLocator";

export default class Client {
  private static instance: Client;
  public colyseusClient: Colyseus.Client = new Colyseus.Client(
    Config.colyseusURL
  );
  public apiInterface: Chisel.APIInterface = new Chisel.APIInterface(
    Config.apiURL
  );
  public serverLocator : ServerLocator
  public lobbyRoom!: Colyseus.Room<Lobby>;
  public colyseusRoom!: Colyseus.Room<World>;
  public chiselWorld!: Chisel.DetailedWorld;
  public authenticationInfo: Protocol.AuthenticationInfo;
  public messageRouter : Protocol.MessageRouter
  public lobbyMessageRouter : Protocol.MessageRouter
  public authenticator : Authenticator
  public phaserGame!: Phaser.Game;
  public ownPlayer!: Schema.Player;
  /**
   * The Singleton's constructor should always be private to prevent direct
   * construction calls with the `new` operator.
   */
  private constructor() {
    this.serverLocator = new ServerLocator(this.apiInterface)
    this.authenticator = new Authenticator();
    this.authenticationInfo = new Protocol.AuthenticationInfo();
    this.messageRouter = new Protocol.MessageRouter()
    this.lobbyMessageRouter
     = new Protocol.MessageRouter()
  }

  /**
   * The static method that controls the access to the singleton instance.
   *
   * This implementation let you subclass the Singleton class while keeping
   * just one instance of each subclass around.
   */
  public static getInstance(): Client {
    if (!Client.instance) {
      Client.instance = new Client();
    }

    return Client.instance;
  }
}
