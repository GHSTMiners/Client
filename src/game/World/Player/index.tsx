import * as Schema from "matchmaking/Schemas";
import * as Phaser from "phaser";
import Config from "config";
import { PlayerState } from "matchmaking/Schemas";
import * as Protocol from "gotchiminer-multiplayer-protocol"
import Client from "matchmaking/Client";
import Jetpack from "../Jetpack";
import Jackhammer from "../Jackhammer";
import gameEvents from "game/helpers/gameEvents";
import MainScene from "game/Scenes/MainScene";

export class Player extends Phaser.GameObjects.Container {
  constructor(scene: MainScene, player: Schema.Player) {
    super(scene, player.playerState.x, player.playerState.y);
    this.setDepth(40);
    this.soundFXManager = scene.soundFXManager;

    //Add jetpack
    this.playerJetpack = new Jetpack(scene, this);
    this.add(this.playerJetpack);

    //Add player
    this.playerSchema = player;
    this.playerSprite = this.scene.add.sprite( 0, 0, `gotchi_${player.gotchiID}`);
    this.playerSprite.setSize(Config.blockWidth, Config.blockHeight);
    this.add(this.playerSprite);
    this.setSize(Config.blockWidth, Config.blockHeight);
    this.xVelocity = 0;
    this.yVelocity = 0;
    this.alphaRefresh = 0.4;
    //this.suspended = false;

    //Add jackhammer
    this.playerJackhammer = new Jackhammer(scene, this);
    this.add(this.playerJackhammer)

    //Add messages
    this.playerMessage = this.scene.add.text(0, 0, "Hallo");
    this.playerMessage.setDepth(50)
    this.playerMessage.setFontSize(25)
    this.playerMessage.setFontFamily("Rocks")
    this.playerMessage.setShadow(3, 3, '#000', 1)
    this.playerMessage.setVisible(false);
    this.add(this.playerMessage)
    this.currentBuilding = '';
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
    //Add sound
    this.jackHammerSound = this.soundFXManager.add("jackHammer")
    this.dirtParticleEmitter.stop()
    this.dirtParticleEmitter.startFollow(this);
    // enabling physics to act as a natural interpolator
    this.scene.physics.add.existing(this);
    this.scene.physics.world.enable(this);
    //Message handlers
    Client.getInstance().messageRouter.addRoute(Protocol.NotifyPlayerCollision, this.handleCollision.bind(this))
    Client.getInstance().messageRouter.addRoute(Protocol.NotifyPlayerMinedLava, this.handleLavaMined.bind(this))
    Client.getInstance().messageRouter.addRoute(Protocol.NotifyPlayerRespawned, this.handleRespawn.bind(this))
    Client.getInstance().phaserGame.events.on( gameEvents.game.DEAD, this.handleDead.bind(this) )
    //Add animations
    this.createAnimations();
  }

  public createAnimations = ()=>{
    const spriteKey =  `gotchi_${this.playerSchema.gotchiID}`;

    this.playerSprite.anims.create({
      key: 'happy',
      frames: this.playerSprite.anims.generateFrameNumbers( spriteKey || '', { start: 0, end: 1 }),
      frameRate: 2,
      repeat: -1,
    });
    this.playerSprite.anims.create({
      key: 'idle',
      frames: this.playerSprite.anims.generateFrameNumbers( spriteKey || '', { frames: [ 0 ]}),
    });
    this.playerSprite.anims.create({
      key: 'left',
      frames: this.playerSprite.anims.generateFrameNumbers( spriteKey || '', { frames: [ 2 ]}),
    });
    this.playerSprite.anims.create({
      key: 'right',
      frames: this.playerSprite.anims.generateFrameNumbers( spriteKey || '', { frames: [ 4 ]}),
    });
    this.playerSprite.anims.create({
      key: 'up',
      frames: this.playerSprite.anims.generateFrameNumbers( spriteKey || '', { frames: [ 6 ]}),
    }); 
    this.playerSprite.anims.create({
        key: 'flying',
        frames: this.playerSprite.anims.generateFrameNumbers( spriteKey || '', { frames: [8] }),
    });
    this.playerSprite.anims.create({
        key: 'drilling',
        frames: this.playerSprite.anims.generateFrameNumbers( spriteKey || '', { frames: [9] }),
    });
    this.playerSprite.anims.create({
        key: 'falling',
        frames: this.playerSprite.anims.generateFrameNumbers( spriteKey || '', { frames: [ 8, 9] }),
        frameRate: 8,
        repeat: -1,
    });
    this.playerSprite.anims.create({
      key: 'sad',
      frames: this.playerSprite.anims.generateFrameNumbers( spriteKey || '', { frames: [ 10] }),
      frameRate: 8,
      repeat: -1,
  });
  }

  public setPlayerAtBuilding( buildingName : string) {
    this.currentBuilding = buildingName;
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
    this.scene?.game.events.emit( gameEvents.buildings.EXIT,this.currentBuilding) // to close shop window automatically
    this.currentBuilding = '';
  }

  private handleCollision(message : Protocol.NotifyPlayerCollision) {
    if (message.gotchiId === Client.getInstance().ownPlayer?.gotchiID){
      this.soundFXManager.play(`metalThud`)
      this.scene.cameras.main.flash();
    }
  }

  private handleLavaMined(message : Protocol.NotifyPlayerMinedLava) {
    if (message.gotchiId === Client.getInstance().ownPlayer?.gotchiID){
      this.soundFXManager.play(`metalThud`)
      this.scene.cameras.main.flash(250, 255, 0, 0, true);
    }
  }

  private handleDead(message : Protocol.NotifyPlayerDied) {
    if (message.gotchiId === Client.getInstance().ownPlayer?.gotchiID){
      this.soundFXManager.play(`dead`)
      this.scene?.cameras.main.flash(1000, 255, 0, 0, true);
    }
  }

  private handleRespawn() {
    /* Add respawn animation and respawn sound */
  }

  private smoothMove(
    targetPosition: number,
    currentPosition: number,
    delta: number,
    velocity: number
  ): [number, number] {
    let newPosition = currentPosition;
    let newVelocity = velocity;

    if (targetPosition !== currentPosition) {
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
  public playerSchema: Schema.Player;
  private xVelocity: number;
  private yVelocity: number;
  private alphaRefresh: number;

  update(time: number, delta: number): void {
    //Update jetpack
    this.playerJetpack.process();
    this.playerJackhammer.process();

    //Drilling update stuff
    let playerState: PlayerState = this.playerSchema.playerState;

    //Process sound
    if ((playerState.movementState === Schema.MovementState.Drilling) !== this.jackHammerSound.isPlaying) {
      if((playerState.movementState === Schema.MovementState.Drilling)) this.soundFXManager.playAtLocation(this.jackHammerSound,this.playerSchema.playerState.x,this.playerSchema.playerState.y)
      else this.jackHammerSound.pause()
    }

    //Process drilling particles
    if (
      playerState.movementState !== Schema.MovementState.Drilling &&
      this.dirtParticleEmitter.on
    ) {this.dirtParticleEmitter.stop();}
    else if (
      playerState.movementState === Schema.MovementState.Drilling &&
      !this.dirtParticleEmitter.on
    ) {this.dirtParticleEmitter.start();}

    if (playerState.x !== this.x || playerState.y !== this.y) {
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
      
      switch(playerState.movementState) {
        case Schema.MovementState.Stationary:
          this.playerSprite.anims.play('idle', true);
        break;
        case Schema.MovementState.Drilling:
          switch(playerState.movementDirection) {
            case Schema.MovementDirection.Left:
              this.playerSprite.anims.play('left',true);
            break;
            case Schema.MovementDirection.Right:
              this.playerSprite.anims.play('right', true)
            break;
            default: 
              this.playerSprite.anims.play('drilling', true);
          }
        break;
        case Schema.MovementState.Flying:
          switch(playerState.movementDirection) {
            case Schema.MovementDirection.Left:
              this.playerSprite.anims.play('left',true);
            break;
            case Schema.MovementDirection.Right:
              this.playerSprite.anims.play('right', true)
            break;
            default: 
              this.playerSprite.anims.play('flying', true);
          }
        break;
        default:
          switch(playerState.movementDirection) {
            case Schema.MovementDirection.Left:
              this.playerSprite.anims.play('left',true);
            break;
            case Schema.MovementDirection.Right:
              this.playerSprite.anims.play('right', true)
            break;
            default: 
              this.playerSprite.anims.play('idle', true);
          }
      }
      
      if (this.playerSchema.playerState.movementState !== Schema.MovementState.Drilling) this.setPosition(xSmooth, ySmooth);
      else this.setPosition(this.playerSchema.playerState.x, this.playerSchema.playerState.y)
    }

    if (playerState.healthState === Schema.HealthState.Deceased) {
      this.playerSprite.setAngle(60)
      this.playerJetpack.setAngle(60)
      this.playerSprite.anims.play('sad', true)
    } else {
      this.playerSprite.setAngle(0)
      this.playerJetpack.setAngle(0)
    }
  }
  private soundFXManager 
  private jackHammerSound : Phaser.Sound.BaseSound
  private playerMessageTimer : Phaser.Time.TimerEvent
  private playerMessage: Phaser.GameObjects.Text;
  private playerJetpack: Jetpack;
  private playerJackhammer : Jackhammer
  private currentBuilding: string;
}
