import * as Schema from "matchmaking/Schemas";
import * as Phaser from "phaser";
import { DataChange } from "@colyseus/schema";
import Config from "config";

export class Player extends Phaser.GameObjects.Container {
  constructor(scene: Phaser.Scene, player: Schema.Player) {
    super(scene, player.playerState.x, player.playerState.y);
    this.setDepth(3);
    this.playerSchema = player;
    this.playerSprite = this.scene.add.sprite(
      0,
      0,
      `gotchi_${player.gotchiID}`
    );
    this.playerSprite.setSize(Config.blockWidth, Config.blockHeight);
    this.add(this.playerSprite);
    this.setSize(Config.blockWidth, Config.blockHeight);
    //Create particle emitter
    var particles = this.scene.add.particles("dirtParticle");
    particles.setDepth(2);
    this.dirtParticleEmitter = particles.createEmitter({
      active: true,
      angle: { min: 247.5, max: 292.5 },
      speed: { min: 800, max: 1000 },
      scale: { start: 1, end: 0 },
      frequency: 12,
      bounce: 0.9,
      gravityY: 2500,
      collideTop: false,
      collideBottom: false,
      lifespan: 1500,
      blendMode: "COLOR",
    });
    this.dirtParticleEmitter.stop();
    this.dirtParticleEmitter.startFollow(this);

    player.playerState.onChange = this.stateChanged.bind(this);
  }
  private stateChanged(change: DataChange<any>[]) {
    change.forEach((value) => {
      if (value.field == "x") this.setX(value.value);
      else if (value.field == "y") this.setY(value.value);
      else if (this.body instanceof Phaser.Physics.Arcade.Body) {
        if (value.field == "velocityX") this.body.setVelocityX(value.value);
        else if (value.field == "velocityY")
          this.body.setVelocityY(value.value);
      }
    });
    if (
      this.playerSchema.playerState.movementState !=
        Schema.MovementState.Drilling &&
      this.dirtParticleEmitter.on
    )
      this.dirtParticleEmitter.stop();
    else if (
      this.playerSchema.playerState.movementState ==
        Schema.MovementState.Drilling &&
      !this.dirtParticleEmitter.on
    )
      this.dirtParticleEmitter.start();
  }
  private dirtParticleEmitter: Phaser.GameObjects.Particles.ParticleEmitter;
  private playerSprite: Phaser.GameObjects.Sprite;
  private playerSchema: Schema.Player;
}
