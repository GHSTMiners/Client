import MovementManager from "game/Management/MovementManager";
import ExcavationManager from "game/Management/ExcavationManager";
import GlobalRenderer from "game/Rendering/GlobalRenderer";
import * as Phaser from "phaser";
import Client from "matchmaking/Client";
import MusicManager from "game/Management/MusicManager";
import ChatManager from "game/Management/ChatManager";
import SoundFXManager from "game/Management/SoundFXManager";
import DiagnosticsManager from "game/Management/DiagnosticsManager";
import gameEvents from "game/helpers/gameEvents";
import RespawnManager from "game/Management/RespawnManager";
import LifeCycleManager from "game/Management/LifeCycleManager";

export default class MainScene extends Phaser.Scene {
  constructor() {
    super({ key: "MainScene" });
  }

  create() {
    //Register message handlers
    Client.getInstance().colyseusRoom.onMessage("*", (type, message) => {
      Client.getInstance().messageRouter.processRawMessage( type as string, message);
    });
    this.soundFXManager = new SoundFXManager(this);
    this.chatManager = new ChatManager(this);
    this.musicManager = new MusicManager(this);
    this.globalRenderer = new GlobalRenderer(this);
    this.movementManager = new MovementManager(this);
    this.excavationManager = new ExcavationManager(this);
    this.respawnManager = new RespawnManager(this);
    this.diagnosticsManager = new DiagnosticsManager(this);
    this.lifeCycleManager = new LifeCycleManager(this);
    this.game.events.emit( gameEvents.phaser.MAINSCENE);
    this.sound.pauseOnBlur = false
    this.cameras.main.zoom = 0.75

    setInterval(() => {
      this.diagnosticsManager?.requestPong()
    }, 2000)
  }

  update(time: number, delta: number): void {
    //Configure camera bounds
    this.globalRenderer?.update(time, delta);
    // console.log(this.game.loop.actualFps); // for debuggin purposes, looking into the interpolation issue
  }
  private lifeCycleManager?: LifeCycleManager
  private chatManager? : ChatManager
  public musicManager?: MusicManager;
  public soundFXManager?: SoundFXManager;
  public globalRenderer?: GlobalRenderer;
  private movementManager?: MovementManager;
  public diagnosticsManager? : DiagnosticsManager
  private excavationManager?: ExcavationManager;
  private respawnManager?: RespawnManager;
}
