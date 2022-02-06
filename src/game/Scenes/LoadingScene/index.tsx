import * as Phaser from "phaser";
import Client from "matchmaking/Client";
import * as Chisel from "chisel-api-interface";
import AavegotchiSVGFetcher from "game/Rendering/AavegotchiSVGFetcher";

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
    var progressBar = new Phaser.Geom.Rectangle(
      this.cameras.main.width / 2 - 210,
      this.cameras.main.height / 2 - 32,
      400,
      50
    );
    var progressBarFill = new Phaser.Geom.Rectangle(
      this.cameras.main.width / 2 - 195,
      this.cameras.main.height / 2 - 20,
      290,
      40
    );

    this.graphics.fillStyle(0xffffff, 1);
    this.graphics.fillRectShape(progressBar);

    this.newGraphics.fillStyle(0x3587e2, 1);
    this.newGraphics.fillRectShape(progressBarFill);
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

    //Static images
    this.load.image("dirtParticle", "assets/images/stone.png");
    let world: Chisel.DetailedWorld | undefined =
      Client.getInstance().chiselWorld;
    //this.load.image('aavegotchi', "https://play.gotchiminer.rocks/VOYAGER.png");
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
    this.newGraphics.clear();
    this.newGraphics.fillStyle(0x3587e2, 1);
    // @ts-expect-error: Let's ignore a compile error like this unreachable code
    // prettier-ignore
    this.newGraphics.fillRectShape( new Phaser.Geom.Rectangle(this.self.cameras.main.width / 2 - 195,this.self.cameras.main.height / 2 - 20,  percentage * 390,   40  ) );

    percentage = percentage * 100;
    // @ts-expect-error: Let's ignore a compile error like this unreachable code
    this.loadingText.setText("Loading: " + percentage.toFixed(2) + "%");
  }

  complete() {
    console.log("Loading assets complete!");
    this.scene.start("MainScene");
  }
}
