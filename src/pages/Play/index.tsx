import $ from "jquery";
import * as React from "react";
import * as Phaser from "phaser";
import Client from "matchmaking/Client";
import LoadingScene from "game/Scenes/LoadingScene";
import MainScene from "game/Scenes/MainScene";
import { useNavigate } from "react-router-dom";
import styles from "./styles.module.css";
import { HUD } from "components";

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
        },
        fps: {
          target: 30,
          forceSetTimeOut: true,
        },
        scene: [LoadingScene, MainScene],
      };
      this.game = new Phaser.Game(config);
      Client.getInstance().phaserGame = this.game;

      console.log(Client.getInstance().authenticationInfo.toJSON());
    } else {
      window.location.href = "/";
    }
  }

  shouldComponentUpdate(): boolean {
    return false;
  }

  render(): React.ReactNode {
    return (
      <>
        <HUD />
        <div id="phaser-game" />
      </>
    );
  }
  private game!: Phaser.Game;
}
