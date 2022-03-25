import { Player } from "game/World/Player";
import Client from "matchmaking/Client";
import * as Schema from "matchmaking/Schemas";
import { AavegotchiGameObject } from "types";
import AavegotchiSVGFetcher from "../AavegotchiSVGFetcher";
import { constructSpritesheet } from "game/helpers/spritesheet";
import { customiseSvg } from "helpers/aavegotchi";


export default class PlayerRenderer extends Phaser.GameObjects.GameObject {
  constructor(scene: Phaser.Scene) {
    super(scene, "PlayerRenderer");
    this.playerSprites = new Map<number, Player>();
    //Handle player creation
    Client.getInstance().colyseusRoom.state.players.onAdd =
      this.addPlayerSprite.bind(this);
    Client.getInstance().colyseusRoom.state.players.onRemove =
      this.removePlayerSprite.bind(this);
    Client.getInstance().colyseusRoom.state.players.forEach((player) => {
      this.addPlayerSprite(player);
    }, this);
  }

  private addPlayerSprite(player: Schema.Player) {
    if(!this.playerSprites.has(player.gotchiID)){
      console.log(
        `Player entered the game with Aavegotchi ID: ${player.gotchiID}`
      );
      Client.getInstance().phaserGame.events.emit('system_message',`[${player.name}] entered the room`)

      let aavegotchiSVGFetcher: AavegotchiSVGFetcher = new AavegotchiSVGFetcher(
        player.gotchiID
      );

      aavegotchiSVGFetcher.getSideviews().then((svg) => {

        const playerGotchi : AavegotchiGameObject = {
          svg:svg,
          id:`${player.gotchiID}`,
          name: player.name, 
          spritesheetKey: `gotchi_${player.gotchiID}`, 
          owner:{id:'unknown'},
          withSetsNumericTraits:[50,50,50,50,50,50],
          withSetsRarityScore: 300,
          equippedWearables: [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
          status: 3
        };
        
        this.loadInGotchiSpritesheet(playerGotchi);
        
        this.scene.load.once(Phaser.Loader.Events.COMPLETE, () => {
          let newPlayer: Player = new Player(this.scene, player);
          this.playerSprites.set(player.gotchiID, newPlayer);
          
          this.scene.add.existing(newPlayer);
          //Check if self sprite belong to me
          if (
            player.playerSessionID == Client.getInstance().colyseusRoom.sessionId
          ) {
            this.scene.cameras.main.startFollow(newPlayer, true, 0.15, 0.15);
            Client.getInstance().ownPlayer = player;
            this.scene.game.events.emit("joined_game", player, newPlayer);
          }
        });
      });
    }
  }

  private removePlayerSprite(player: Schema.Player) {
    console.log(`Player left the game with Aavegotchi ID: ${player.gotchiID}`);
    Client.getInstance().phaserGame.events.emit('system_message',`[${player.name}] left the room`)

    let playerSprite: Player | undefined = this.playerSprites.get(
      player.gotchiID
    );
    if (playerSprite) {
      this.playerSprites.delete(player.gotchiID);
      playerSprite.destroy();
    }
  }

  update(time: number, delta: number): void {
    this.playerSprites.forEach((sprite) => {
      sprite.update(time, delta);
    });
  }

   /**
   * Constructs and loads in the Aavegotchi spritesheet, you can use customiseSVG() to create custom poses and animations
   */
    private loadInGotchiSpritesheet = async (
      gotchiObject: AavegotchiGameObject
    ) => {
      const svg = gotchiObject.svg;
      
      const spriteMatrix = [
        // Front
        [
          customiseSvg(svg[0], { removeBg: true }),
          customiseSvg(svg[0], {
            armsUp: true,
            eyes: "happy",
            float: true,
            removeBg: true,
          }),
        ],
        // Left
        [
          customiseSvg(svg[1], { removeBg: true }),
        ],
        // Right
        [
          customiseSvg(svg[2], { removeBg: true }),
        ],
        // Right
        [
          customiseSvg(svg[3], { removeBg: true }),
        ]
      ];
      const { src, dimensions } = await constructSpritesheet(spriteMatrix);
      this.scene.load.spritesheet(gotchiObject.spritesheetKey, src, {
        frameWidth: dimensions.width / dimensions.x,
        frameHeight: dimensions.height / dimensions.y,
      });
      this.scene.load.start();
    };
 

    
  private playerSprites: Map<number, Player>;
}