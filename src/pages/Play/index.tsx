import * as React from "react";
import * as Phaser from "phaser";
import Client from "matchmaking/Client";
import LoadingScene from "game/Scenes/LoadingScene";
import MainScene from "game/Scenes/MainScene";
import { HUD } from "game/HUD";
import LoadingGame from "components/LoadingGame";
import Menus from "game/Menus";
import VisualFX from "game/VisualFX";
import { useGlobalStore } from "store";

export default class Play extends React.Component {
  componentDidMount() {
    if (Client.getInstance().colyseusRoom) {
      let config = {
        type: Phaser.AUTO,
        parent: "phaser-game",
        antialias: true,
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
        input: {
          gamepad: true
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

  componentWillUnmount() {
    useGlobalStore.getState().clearUserGameData();
  }

  render(): React.ReactNode {
    if (Client.getInstance().colyseusRoom) {
      return (
        <>
          <LoadingGame />
          <HUD />
          <Menus />
          <VisualFX />
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
