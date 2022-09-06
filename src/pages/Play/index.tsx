import * as React from "react";
import * as Phaser from "phaser";
import Client from "matchmaking/Client";
import LoadingScene from "game/Scenes/LoadingScene";
import MainScene from "game/Scenes/MainScene";
import { HUD } from "game/HUD";

export default class Play extends React.Component {
  componentDidMount() {
    if (Client.getInstance().colyseusRoom) {
      const config = {
        type: Phaser.AUTO,
        parent: "phaser-game",

        room: Client.getInstance().colyseusRoom,
        scale: {
          mode: Phaser.Scale.RESIZE,
          autoCenter: Phaser.Scale.NONE,
        },
        physics: {
          default: "arcade",
          arcade: {
            debug: false,
          }
        },
        scene: [LoadingScene, MainScene],
      };
      this.game = new Phaser.Game(config);
      Client.getInstance().phaserGame = this.game;
    } else {
      window.location.href = "/";
    }
  }

  shouldComponentUpdate(): boolean {
    return false;
  }

  render(): React.ReactNode {
    if (Client.getInstance().colyseusRoom) {
      return (
        <>
          <HUD />
          <div id="phaser-game" />
        </>
      );
    } else {
      return (
        <></>
      )
    }
  }
  private game!: Phaser.Game;
}
