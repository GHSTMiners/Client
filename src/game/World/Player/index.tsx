import * as Schema from "matchmaking/Schemas";
import * as Phaser from "phaser";
import { DataChange } from "@colyseus/schema";
import Config from "config";
import { PlayerState } from "matchmaking/Schemas";
import { time } from "console";

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
    this.xVelocity = 0;
    this.yVelocity = 0;
    this.alphaRefresh = 0.4;
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
    // enabling physics to act as a natural interpolator
    this.scene.physics.add.existing(this);
    this.scene.physics.world.enable(this);
  }

  private stateChanged(change: DataChange<any>[]) {
    //console.log(change);
    let playerState: PlayerState = this.playerSchema.playerState;

    if (
      playerState.movementState != Schema.MovementState.Drilling &&
      this.dirtParticleEmitter.on
    )
      this.dirtParticleEmitter.stop();
    else if (
      playerState.movementState == Schema.MovementState.Drilling &&
      !this.dirtParticleEmitter.on
    )
      this.dirtParticleEmitter.start();
  }

  private smoothMove(
    targetPosition: number,
    currentPosition: number,
    delta: number,
    velocity: number
  ): [number, number] {
    let newPosition = currentPosition;
    let newVelocity = velocity;

    if (targetPosition != currentPosition) {
      const diffPosition = targetPosition - currentPosition;
      newVelocity =
        (1 - this.alphaRefresh) * velocity +
        (this.alphaRefresh * diffPosition) / delta;
      newPosition =
        (1 - this.alphaRefresh) * currentPosition +
        this.alphaRefresh * (newVelocity * delta + currentPosition);
    }

    return [newPosition, newVelocity];
  }

  private dirtParticleEmitter: Phaser.GameObjects.Particles.ParticleEmitter;
  private playerSprite: Phaser.GameObjects.Sprite;
  private playerSchema: Schema.Player;
  private xVelocity: number;
  private yVelocity: number;
  private alphaRefresh: number;

  update(time: number, delta: number): void {
    let playerState: PlayerState = this.playerSchema.playerState;

    if (playerState.x != this.x || playerState.y != this.y) {
      let [xSmooth, vxSmooth] = this.smoothMove(
        playerState.x,
        this.x,
        delta,
        this.xVelocity
      );
      this.xVelocity = vxSmooth;

      let [ySmooth, vySmooth] = this.smoothMove(
        playerState.y,
        this.y,
        delta,
        this.yVelocity
      );
      this.yVelocity = vySmooth;

      this.setPosition(xSmooth, ySmooth);
    }
  }
}
