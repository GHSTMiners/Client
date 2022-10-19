import * as Phaser from "phaser";
import Client from "matchmaking/Client";
import * as Chisel from "chisel-api-interface";
import gameEvents from "game/helpers/gameEvents";
import * as Schema from "matchmaking/Schemas"
import { ExplosiveItem, IndexedCrypto, InventoryExplosives } from "types"
import { useGlobalStore } from "store"

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
    this.load.on("complete", this.complete.bind(this), { scene: this.scene });

    //Static images and audio files
    this.load.image("dirtParticle", "assets/images/stone.png");
    this.load.image("flare", "assets/images/flare.png");
    this.load.audio("jackHammer", "assets/audio/jackHammer.webm");
    this.load.audio("metalThud", "assets/audio/metalThud.wav");
    this.load.audio("explosion", "assets/audio/explosion.mp3");
    this.load.audio("fuse", "assets/audio/fuse.mp3");
    this.load.audio("thrusters", "assets/audio/thrusters.mp3");
    this.load.audio("upgraded", "assets/audio/upgraded.mp3");
    this.load.audio("dead", "assets/audio/dead.mp3");
    this.load.audio("lowFuelWarning","assets/audio/lowFuelWarning.mp3")
    this.load.spritesheet("explosionAnimation", "assets/images/explosionSprite.png", {frameHeight: 128, frameWidth: 128, startFrame:0, endFrame: 15})
    this.load.spritesheet("jetpackAnimationRear", "assets/sprites/jetpackRear.png", {frameHeight: 337, frameWidth: 296, startFrame:0, endFrame: 24})
    this.load.spritesheet("jetpackAnimationSide", "assets/sprites/jetpackSide.png", {frameHeight: 283, frameWidth: 103, startFrame:0, endFrame: 24})
    this.load.spritesheet("jackhammerAnimation", "assets/sprites/jackhammer.png", {frameHeight: 83, frameWidth: 112, startFrame:0, endFrame: 10})

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
        `https://chisel.gotchiminer.rocks/storage/${crypto.wallet_image}`
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

  storeWorldCrypto(){
    const world =  Client.getInstance().chiselWorld;
    const schema: Schema.World = Client.getInstance().colyseusRoom.state;
    let cryptoRecord : IndexedCrypto ={};
    world.crypto.forEach( (crypto) => {
      const cryptoPrice = schema.exchange.get(`${crypto.id}`);
      const newCrypto = {
        cryptoID: crypto.id,
        name: `${crypto.shortcode}`,
        image: `https://chisel.gotchiminer.rocks/storage/${crypto.wallet_image}`,
        crystal: `https://chisel.gotchiminer.rocks/storage/${crypto.soil_image}`,
        price: (cryptoPrice? cryptoPrice.usd_value : 1)
      }
      cryptoRecord[newCrypto.cryptoID]= newCrypto;
    })
    useGlobalStore.getState().setWorldCrypto(cryptoRecord);
  }

   storeWorldExplosives(){
    const world =   Client.getInstance().chiselWorld;
    let explosivesRecord : InventoryExplosives ={};
    world.explosives.forEach((explosive)=>{
      let newItem : ExplosiveItem = { 
        id: explosive.id,
        name: explosive.name,
        image: `https://chisel.gotchiminer.rocks/storage/${explosive.drop_image}`,
        pattern: explosive.explosion_coordinates,
        price: explosive.price, 
        type: 'explosive',
        quantity: 0    
      };
      explosivesRecord[explosive.id]= newItem;
    })
    useGlobalStore.getState().setWorldExplosives(explosivesRecord);
  }

  updateBar(percentage: number) {
    percentage = percentage * 100;
    Client.getInstance().phaserGame.events.emit(gameEvents.phaser.LOADING,percentage.toFixed(2));
  }

  complete() {   
    this.storeWorldCrypto();
    this.storeWorldExplosives();
    console.log("Loading assets complete!");
    this.scene.start("MainScene");
  }
}
