import Config from "config";
import MovementManager from "game/Management/MovementManager";
import ExcavationManager from "game/Management/ExcavationManager";
import GlobalRenderer from "game/Rendering/GlobalRenderer";
import * as Phaser from "phaser";
import Client from "matchmaking/Client";
import MusicManager from "game/Management/MusicManager";

var controls;

export default class MainScene extends Phaser.Scene {
  constructor() {
    super({ key: "MainScene" });
  }

  create() {
    //Register message handlers
    Client.getInstance().colyseusRoom.onMessage("*", (type, message) => {
      //prettier-ignore
      Client.getInstance().messageRouter.processRawMessage( type as string, message);
    });
    this.musicManager = new MusicManager(this);
    this.globalRenderer = new GlobalRenderer(this);
    this.movementManager = new MovementManager(this);
    this.excavationManager = new ExcavationManager(this);
    this.game.events.emit("mainscene_ready");
    this.sound.pauseOnBlur = false
  }

  update(time: number, delta: number): void {
    //Configure camera bounds
    this.globalRenderer?.update(time, delta);
    // console.log(this.game.loop.actualFps); // for debuggin purposes, looking into the interpolation issue
  }
  private musicManager?: MusicManager;
  private globalRenderer?: GlobalRenderer;
  private movementManager?: MovementManager;
  private excavationManager?: ExcavationManager;
}
