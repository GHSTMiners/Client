import * as Phaser from "phaser";
import Client from "matchmaking/Client";
import * as Chisel from "chisel-api-interface";


export default class LoadingScene extends Phaser.Scene {
  graphics!: Phaser.GameObjects.Graphics;
  newGraphics!: Phaser.GameObjects.Graphics;

  constructor() {
    super({ key: "LoadingScene" });
  }

  preload() {
    // Create loading elements
    this.graphics = this.add.graphics();
    this.newGraphics = this.add.graphics();

    var loadingText = this.add.text(
      this.cameras.main.width / 2 - 190,
      this.cameras.main.height / 2 - 20,
      "Loading: ",
      { fontSize: "32px" }
    );
      
    this.load.on("progress", this.updateBar, {
      newGraphics: this.newGraphics,
      loadingText: loadingText,
      self: this,
    });
    this.load.on("complete", this.complete, { scene: this.scene });

    //Static images and audio files
    this.load.image("dirtParticle", "assets/images/stone.png");
    this.load.audio("jackHammer", "assets/audio/jackHammer.wav");
    this.load.audio("thrusters", "assets/audio/thrusters.wav");
    this.load.audio("metalThud", "assets/audio/metalThud.wav");
    this.load.audio("explosion", "assets/audio/explosion.mp3");
    this.load.audio("fuse", "assets/audio/fuse.wav");
    this.load.spritesheet("explosionAnimation", "assets/images/explosionSprite.png", {frameHeight: 128, frameWidth: 128, startFrame:0, endFrame: 15})
    this.load.spritesheet("jetpackAnimationRear", "assets/sprites/jetpackRear.png", {frameHeight: 337, frameWidth: 296, startFrame:0, endFrame: 24})
    this.load.spritesheet("jetpackAnimationSide", "assets/sprites/jetpackSide.png", {frameHeight: 283, frameWidth: 103, startFrame:0, endFrame: 24})

    let world: Chisel.DetailedWorld | undefined =
      Client.getInstance().chiselWorld;

    world.music.forEach(music=> {
      this.load.audio(`music_${music.name}`, 
      `https://chisel.gotchiminer.rocks/storage/${music.audio}`)
    })
    world.backgrounds.forEach((background) => {
      this.load.image(
        `background_${background.id}`,
        `https://chisel.gotchiminer.rocks/storage/${background.image}`
      );
    });
    world.crypto.forEach((crypto) => {
      this.load.audio(
        `crypto_${crypto.id}`,
        `https://chisel.gotchiminer.rocks/storage/${crypto.mining_sound}`
      );
      this.load.image(
        `crypto_soil_${crypto.id}`,
        `https://chisel.gotchiminer.rocks/storage/${crypto.soil_image}`
      );
      this.load.image(
        `crypto_wallet_${crypto.id}`,
        `https://chisel.gotchiminer.rocks/storage/${crypto.soil_image}`
      );
    });
    world.buildings.forEach((building) => {
      this.load.video(
        `building_${building.id}`,
        `https://chisel.gotchiminer.rocks/storage/${building.video}`,
        undefined, true, true
      );
      this.load.audio(`building_activation_${building.id}`,
      `https://chisel.gotchiminer.rocks/storage/${building.activation_sound}`
      )
    });
    world.soil.forEach((soil) => {
      this.load.image(
        `soil_top_${soil.id}`,
        `https://chisel.gotchiminer.rocks/storage/${soil.top_image}`
      );
      this.load.image(
        `soil_middle_${soil.id}`,
        `https://chisel.gotchiminer.rocks/storage/${soil.middle_image}`
      );
      this.load.image(
        `soil_bottom_${soil.id}`,
        `https://chisel.gotchiminer.rocks/storage/${soil.bottom_image}`
      );
    });
    world.rocks.forEach((rock) => {
      this.load.image(
        `rock_${rock.id}`,
        `https://chisel.gotchiminer.rocks/storage/${rock.image}`
      );
    });
    world.explosives.forEach((explosive) => {
      this.load.audio(
        `explosive_${explosive.id}`,
        `https://chisel.gotchiminer.rocks/storage/${explosive.explosion_sound}`
      );
      this.load.image(
        `explosive_soil_${explosive.id}`,
        `https://chisel.gotchiminer.rocks/storage/${explosive.soil_image}`
      );
      this.load.image(
        `explosive_drop_${explosive.id}`,
        `https://chisel.gotchiminer.rocks/storage/${explosive.drop_image}`
      );
      this.load.image(
        `explosive_inventory_${explosive.id}`,
        `https://chisel.gotchiminer.rocks/storage/${explosive.inventory_image}`
      );
    });
  }

  updateBar(percentage: number) {
    percentage = percentage * 100;
    Client.getInstance().phaserGame.events.emit("loading",percentage.toFixed(2));
  }

  complete() {
    console.log("Loading assets complete!");
    this.scene.start("MainScene");
  }
}
