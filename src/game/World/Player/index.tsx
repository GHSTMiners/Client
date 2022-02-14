import * as Schema from "matchmaking/Schemas";
import * as Phaser from "phaser";
import { DataChange } from "@colyseus/schema";
import Config from "config";
import { PlayerState } from "matchmaking/Schemas";
import { time } from "console";

export class Player extends Phaser.GameObjects.Container {
  constructor(scene: Phaser.Scene, player: Schema.Player) {
    super(scene, player.playerState.x, player.playerState.y);
    this.setDepth(40);
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
    //Add messages
    this.playerMessage = this.scene.add.text(0, 0, "Hallo");
    this.playerMessage.setDepth(50)
    this.playerMessage.setFontSize(25)
    this.playerMessage.setFontFamily("Karmatic Arcade")
    this.playerMessage.setShadow(5, 5, '#000', 15)
    this.playerMessage.setVisible(false);
    this.add(this.playerMessage)
    this.playerMessageTimer = scene.time.addEvent({});
    //Create particle emitter
    var particles = this.scene.add.particles("dirtParticle");
    particles.setDepth(30);
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
    // enabling physics to act as a natural interpolator
    this.scene.physics.add.existing(this);
    this.scene.physics.world.enable(this);
  }


  public displayMessage(message : string, timeout : number) {
    this.playerMessage.setText(message)
    this.playerMessage.setVisible(true)
    this.playerMessage.setPosition(-this.playerMessage.width/2, -this.playerSprite.height+this.playerMessage.height)
    var self = this;
    this.playerMessageTimer.reset( {
      delay: timeout,                // ms
      callback: function () { self.playerMessage.setVisible(false) },
      callbackScope: this,
      loop: false
    })
  }

  public hideMessage() {
    this.playerMessage.setVisible(false)
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
  public playerSprite: Phaser.GameObjects.Sprite;
  private playerSchema: Schema.Player;
  private xVelocity: number;
  private yVelocity: number;
  private alphaRefresh: number;

  update(time: number, delta: number): void {
    //Drilling update stuff

    let playerState: PlayerState = this.playerSchema.playerState;

    if (
      playerState.movementState != Schema.MovementState.Drilling &&
      this.dirtParticleEmitter.on
    ) {this.dirtParticleEmitter.stop();}
    else if (
      playerState.movementState == Schema.MovementState.Drilling &&
      !this.dirtParticleEmitter.on
    ) {this.dirtParticleEmitter.start();}

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

      if(this.playerSchema.playerState.movementState != Schema.MovementState.Drilling) this.setPosition(xSmooth, ySmooth);
      else this.setPosition(this.playerSchema.playerState.x, this.playerSchema.playerState.y)
    }
  }
  private playerMessageTimer : Phaser.Time.TimerEvent
  private playerMessage: Phaser.GameObjects.Text;
}
