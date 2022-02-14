import { Client } from "colyseus.js";
import Config from "config";
import MovementManager from "game/Management/MovementManager";
import ExcavationManager from "game/Management/ExcavationManager";
import GlobalRenderer from "game/Rendering/GlobalRenderer";
import * as Phaser from "phaser";

var controls;

export default class MainScene extends Phaser.Scene {
  constructor() {
    super({ key: "MainScene" });
  }

  create() {
    this.globalRenderer = new GlobalRenderer(this);
    this.movementManager = new MovementManager(this);
    this.excavationManager = new ExcavationManager(this)
    this.game.events.emit("mainscene_ready");
  }

  update(time: number, delta: number): void {
    //Configure camera bounds
    this.globalRenderer?.update(time, delta);
    // console.log(this.game.loop.actualFps); // for debuggin purposes, looking into the interpolation issue
  }

  private globalRenderer?: GlobalRenderer;
  private movementManager?: MovementManager;
  private excavationManager?: ExcavationManager
}
