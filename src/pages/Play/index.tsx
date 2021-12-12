import * as React from "react"
import * as Phaser from "phaser"
import { Container } from "react-bootstrap";
import Client from "matchmaking/Client";
import { World } from "matchmaking/Schemas/World";
import LoadingScene from "game/Scenes/LoadingScene";
import MainScene from "game/Scenes/MainScene"

export default class Play extends React.Component {

    componentDidMount() {
        const config = {
            type: Phaser.AUTO,
            parent: "phaser-game",
            width: 800,
            height: 600,
            room: Client.getInstance().colyseusRoom,
            scale: {
                mode: Phaser.Scale.RESIZE ,
                autoCenter: Phaser.Scale.CENTER_BOTH
            },
            scene: [LoadingScene, MainScene]
          };
        new Phaser.Game(config);
        
    }

    shouldComponentUpdate(): boolean {
        return false;
    }
    
    render(): React.ReactNode {
        return <div id="phaser-game"/>
    }
}