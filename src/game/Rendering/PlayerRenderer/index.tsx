import { Player } from "game/World/Player";
import Client from "matchmaking/Client";
import * as Schema from "matchmaking/Schemas";
import AavegotchiSVGFetcher from "../AavegotchiSVGFetcher";

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
    console.log(
      `Player entered the game with Aavegotchi ID: ${player.gotchiID}`
    );
    let aavegotchiSVGFetcher: AavegotchiSVGFetcher = new AavegotchiSVGFetcher(
      player.gotchiID
    );
    aavegotchiSVGFetcher.frontWithoutBackground().then((svg) => {
      console.log(svg);
      //Convert string from svg
      const blob = new Blob([svg], { type: "image/svg+xml" });
      const url = URL.createObjectURL(blob);

      this.scene.load.svg(`gotchi_${player.gotchiID}`, url);
      this.scene.load.start();
      var self = this;
      this.scene.load.on(Phaser.Loader.Events.COMPLETE, function () {
        let newPlayer: Player = new Player(self.scene, player);
        self.playerSprites.set(player.gotchiID, newPlayer);
        self.scene.add.existing(newPlayer);
        //Check if self sprite belong to me
        if (
          player.playerSessionID == Client.getInstance().colyseusRoom.sessionId
        ) {
          self.scene.cameras.main.startFollow(newPlayer, true, 0.1, 0.1);
        }
      });
    });
  }

  private removePlayerSprite(player: Schema.Player) {
    console.log(`Player left the game with Aavegotchi ID: ${player.gotchiID}`);
    let playerSprite: Player | undefined = this.playerSprites.get(
      player.gotchiID
    );
    if (playerSprite) {
      this.playerSprites.delete(player.gotchiID);
      playerSprite.destroy();
    }
  }

  update(time: number, delta: number): void {
    //console.log("INSIDE PLAYER RENDERER");
    this.playerSprites.forEach((sprite) => {
      sprite.update(time, delta);
    });
  }

  private playerSprites: Map<number, Player>;
}
