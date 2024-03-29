import * as Phaser from "phaser";
import Client from "matchmaking/Client";
import * as Chisel from "chisel-api-interface";
import gameEvents from "game/helpers/gameEvents";
import * as Schema from "matchmaking/Schemas"
import * as Protocol from "gotchiminer-multiplayer-protocol"
import { ConsumableItem, ExplosiveItem, IndexedCrypto, InventoryConsumables, InventoryExplosives } from "types"
import { useGlobalStore } from "store"
import Config from "config";
import { ItemTypes } from "helpers/vars";
import deployExplosive from "game/World/Explosive/deployExplosive";
import requestUseConsumable from "game/World/Consumable/requestUseConsumable";

export default class LoadingScene extends Phaser.Scene {
  graphics!: Phaser.GameObjects.Graphics;
  newGraphics!: Phaser.GameObjects.Graphics;

  constructor() {
    super({ key: "LoadingScene" });
    var self = this;
    //Register message handlers
    Client.getInstance().colyseusRoom.onMessage("*", (type, message) => {
      Client.getInstance().messageRouter.processRawMessage( type as string, message);
    });
    Client.getInstance().messageRouter.addRoute(Protocol.NotifyGameStarted, () => {
      console.log("⚔️ The game just started, let's go! ️‍🔥")
      self.scene.start("MainScene");
    });
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
    
    this.load.on('filefailed',  (key:string, file:Phaser.Loader.File) => {
      console.error('💩Failed to load asset:', key);
    });

    //Static images and audio files
    this.load.image("dirtParticle", "assets/images/stone.png");
    this.load.image("flare", "assets/images/flare.png");
    this.load.audio("jackHammer", "assets/audio/jackHammer.webm");
    this.load.audio("metalThud", "assets/audio/metalThud.wav");
    this.load.audio("explosion", "assets/audio/explosion.mp3");
    this.load.audio("nuke", "assets/audio/nuke.mp3");
    this.load.audio("fuse", "assets/audio/fuse.mp3");
    this.load.audio("consumable", "assets/audio/consumable.mp3");
    this.load.audio("switch", "assets/audio/switch.mp3");
    this.load.audio("thrusters", "assets/audio/thrusters.mp3");
    this.load.audio("upgraded", "assets/audio/upgraded.mp3");
    this.load.audio("dead", "assets/audio/dead.mp3");
    this.load.audio("pop", "assets/audio/pop.mp3");
    this.load.audio("locked", "assets/audio/locked.mp3");
    this.load.audio("lowFuelWarning","assets/audio/lowFuelWarning.mp3")
    this.load.spritesheet("explosionAnimation", "assets/images/explosionSprite.png", {frameHeight: 128, frameWidth: 128, startFrame:0, endFrame: 15})
    this.load.spritesheet("jetpackAnimationRear", "assets/sprites/jetpackRear.png", {frameHeight: 337, frameWidth: 296, startFrame:0, endFrame: 24})
    this.load.spritesheet("jetpackAnimationSide", "assets/sprites/jetpackSide.png", {frameHeight: 283, frameWidth: 103, startFrame:0, endFrame: 24})
    this.load.spritesheet("jackhammerAnimation", "assets/sprites/jackhammer.png", {frameHeight: 83, frameWidth: 112, startFrame:0, endFrame: 10})

    let world: Chisel.DetailedWorld | undefined =
      Client.getInstance().chiselWorld;

    world.music.forEach(music=> {
      this.load.audio(`music_${music.name}`, 
      `${Config.storageURL}/${music.audio}`,
      { stream: true })
    })
    world.backgrounds.forEach((background) => {
      this.load.image(
        `background_${background.id}`,
        `${Config.storageURL}/${background.image}`
      );
    });
    world.crypto.forEach((crypto) => {
      this.load.audio(
        `crypto_${crypto.id}`,
        `${Config.storageURL}/${crypto.mining_sound}`
      );
      this.load.image(
        `crypto_soil_${crypto.id}`,
        `${Config.storageURL}/${crypto.soil_image}`
      );
      this.load.image(
        `crypto_wallet_${crypto.id}`,
        `${Config.storageURL}/${crypto.wallet_image}`
      );
    });
    world.buildings.forEach((building) => {
      this.load.video(
        `building_${building.id}`,
        `${Config.storageURL}/${building.video}`,
        undefined, true, true
      );
      this.load.audio(`building_activation_${building.id}`,
      `${Config.storageURL}/${building.activation_sound}`
      )
    });
    world.soil.forEach((soil) => {
      this.load.image(
        `soil_top_${soil.id}`,
        `${Config.storageURL}/${soil.top_image}`
      );
      this.load.image(
        `soil_middle_${soil.id}`,
        `${Config.storageURL}/${soil.middle_image}`
      );
      this.load.image(
        `soil_bottom_${soil.id}`,
        `${Config.storageURL}/${soil.bottom_image}`
      );
    });
    world.rocks.forEach((rock) => {
      this.load.image(
        `rock_${rock.id}`,
        `${Config.storageURL}/${rock.image}`
      );
    });
    world.explosives.forEach((explosive) => {
      this.load.audio(
        `explosive_${explosive.id}`,
        `${Config.storageURL}/${explosive.explosion_sound}`
      );
      this.load.svg(
        `explosive_soil_${explosive.id}`,
        `${Config.storageURL}/${explosive.soil_image}`,
        {width: 128, height: 128}
      );
      this.load.image(
        `explosive_drop_${explosive.id}`,
        `${Config.storageURL}/${explosive.drop_image}`
      );
      this.load.image(
        `explosive_inventory_${explosive.id}`,
        `${Config.storageURL}/${explosive.inventory_image}`
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
        image: `${Config.storageURL}/${crypto.wallet_image}`,
        crystal: `${Config.storageURL}/${crypto.soil_image}`,
        price: (cryptoPrice? cryptoPrice.usd_value : 1)
      }
      console.log(`${newCrypto.name} price ($): ${newCrypto.price}`)
      cryptoRecord[newCrypto.cryptoID]= newCrypto;
    })
    useGlobalStore.getState().setWorldCrypto(cryptoRecord);
  }

   storeWorldExplosives(){
    const world =   Client.getInstance().chiselWorld;
    let explosivesRecord : InventoryExplosives ={};
    world.explosives.forEach((explosive: Chisel.Explosive)=>{
      let newItem : ExplosiveItem = { 
        id: explosive.id,
        name: explosive.name,
        image: `${Config.storageURL}/${explosive.drop_image}`,
        pattern: explosive.explosion_coordinates,
        price: explosive.price, 
        crypto_id: explosive.crypto_id,
        purchase_limit: explosive.purchase_limit,
        type: ItemTypes.Explosive,
        cooldown: explosive.lifespan,
        callback: () => deployExplosive(explosive.id),
        quantity: 0    
      };
      explosivesRecord[explosive.id]= newItem;
    })
    useGlobalStore.getState().setWorldExplosives(explosivesRecord);
  }

  storeWorldConsumables(){
    const world =   Client.getInstance().chiselWorld;
    let consumablesRecord : InventoryConsumables ={};
    world.consumables.forEach((consumable:Chisel.Consumable)=>{
      let newItem : ConsumableItem = { 
        id: consumable.id, 
        name: consumable.name,
        description: consumable.description,
        duration: consumable.duration,
        skill_effects: consumable.skill_effects,
        vital_effects: consumable.vital_effects,
        image: `${Config.storageURL}/${consumable.image}`,
        price: consumable.price,
        crypto_id: consumable.crypto_id,
        purchase_limit: consumable.purchase_limit, 
        type: ItemTypes.Consumable,
        cooldown: consumable.duration,
        callback: () => requestUseConsumable(consumable.id),
        quantity: 0    
      };
      consumablesRecord[consumable.id]= newItem;
    })
    useGlobalStore.getState().setWorldConsumables(consumablesRecord);
  }

  updateBar(percentage: number) {
    percentage = percentage * 100;
    Client.getInstance().phaserGame.events.emit(gameEvents.phaser.LOADING,percentage.toFixed(2));
  }

  complete() {   
    this.storeWorldCrypto();
    this.storeWorldExplosives();
    this.storeWorldConsumables();
    useGlobalStore.getState().initializeUserSettings();
    console.log("✅ Loading assets complete!");
    // Send request game start
    let requestGameStartMessage : Protocol.RequestStartGame = new Protocol.RequestStartGame()
    let serializedMessage : Protocol.Message = Protocol.MessageSerializer.serialize(requestGameStartMessage)
    Client.getInstance().colyseusRoom.send(serializedMessage.name, serializedMessage.data)
  }
}
