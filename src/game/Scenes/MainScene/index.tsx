import { Client } from "colyseus.js";
import Config from "config";
import MovementManager from "game/Management/MovementManager";
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
  }

  update(time: number, delta: number): void {
    //Configure camera bounds
    this.globalRenderer?.update(time, delta);
    // console.log(this.game.loop.actualFps); // for debuggin purposes, looking into the interpolation issue
  }

  private globalRenderer?: GlobalRenderer;
  private movementManager?: MovementManager;
}
