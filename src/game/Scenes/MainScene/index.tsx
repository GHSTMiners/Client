import Config from "config";
import MovementManager from "game/Management/MovementManager";
import ExcavationManager from "game/Management/ExcavationManager";
import GlobalRenderer from "game/Rendering/GlobalRenderer";
import * as Phaser from "phaser";
import Client from "matchmaking/Client";
import MusicManager from "game/Management/MusicManager";
import ChatManager from "game/Management/ChatManager";
import SoundFXManager from "game/Management/SoundFXManager";

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
    this.chatManager = new ChatManager(this);
    this.musicManager = new MusicManager(this);
    this.globalRenderer = new GlobalRenderer(this);
    this.movementManager = new MovementManager(this);
    this.excavationManager = new ExcavationManager(this);
    this.soundFXManager = new SoundFXManager(this);
    this.game.events.emit("mainscene_ready");
    this.sound.pauseOnBlur = false
    this.cameras.main.zoom = 0.75
  }

  update(time: number, delta: number): void {
    //Configure camera bounds
    this.globalRenderer?.update(time, delta);
    // console.log(this.game.loop.actualFps); // for debuggin purposes, looking into the interpolation issue
  }
  private chatManager? : ChatManager
  private musicManager?: MusicManager;
  private soundFXManager?: SoundFXManager;
  private globalRenderer?: GlobalRenderer;
  private movementManager?: MovementManager;
  private excavationManager?: ExcavationManager;
}
