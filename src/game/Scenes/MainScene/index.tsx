import KeyboardInputManager from "game/Management/KeyboardInputManager";
import GamePadInputManager from "game/Management/GamePadInputManager";
import ExcavationManager from "game/Management/ExcavationManager";
import GlobalRenderer from "game/Rendering/GlobalRenderer";
import * as Phaser from "phaser";
import MusicManager from "game/Management/MusicManager";
import ChatManager from "game/Management/ChatManager";
import SoundFXManager from "game/Management/SoundFXManager";
import DiagnosticsManager from "game/Management/DiagnosticsManager";
import RespawnManager from "game/Management/RespawnManager";
import LifeCycleManager from "game/Management/LifeCycleManager";
import { useGlobalStore } from "store";

export default class MainScene extends Phaser.Scene {
  constructor() {
    super({ key: "MainScene" });
  }

  create() {
    this.soundFXManager = new SoundFXManager(this);
    this.chatManager = new ChatManager(this);
    this.musicManager = new MusicManager(this);
    this.globalRenderer = new GlobalRenderer(this);
    this.gamePadInputManager = new GamePadInputManager(this);
    this.keyboardInputManager = new KeyboardInputManager(this);
    this.excavationManager = new ExcavationManager(this);
    this.respawnManager = new RespawnManager(this);
    this.diagnosticsManager = new DiagnosticsManager(this);
    this.lifeCycleManager = new LifeCycleManager(this);
    this.sound.pauseOnBlur = false
    this.cameras.main.zoom = 0.75
    useGlobalStore.getState().setIsGameLoaded(true);
    
    setInterval(() => {
      this.diagnosticsManager?.requestPong()
    }, 2000)
  }

  update(time: number, delta: number): void {
    //Configure camera bounds
    this.globalRenderer?.update(time, delta);
    // console.log(this.game.loop.actualFps); // for debuggin purposes, looking into the interpolation issue
  }

  shutdown(){
    this.sound.stopAll();
    this.musicManager?.shutdown();
    this.keyboardInputManager?.clearKeys();
  }

  public soundFXManager!: SoundFXManager;
  public lifeCycleManager?: LifeCycleManager
  private chatManager? : ChatManager
  public musicManager?: MusicManager;
  public globalRenderer?: GlobalRenderer;
  public keyboardInputManager?: KeyboardInputManager;
  public gamePadInputManager? : GamePadInputManager
  public diagnosticsManager? : DiagnosticsManager
  private excavationManager?: ExcavationManager;
  private respawnManager?: RespawnManager;
}
