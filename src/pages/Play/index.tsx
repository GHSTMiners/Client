import $ from "jquery";
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

            room: Client.getInstance().colyseusRoom,
            scale: {
                mode: Phaser.Scale.RESIZE,
                autoCenter: Phaser.Scale.CENTER_BOTH
            },
            scene: [LoadingScene, MainScene]
          };

        //Handle resize
        var self = this;
        this.game = new Phaser.Game(config);
        $(window).on('resize', function (event: JQuery.Event) {
            let newWidth : number|undefined = $("#phaser-game").width();
            let newHeight : number|undefined = $("#phaser-game").width();
            if(typeof newWidth === "number" && typeof newHeight === "number") {
                self.game.scale.setGameSize(newWidth, newHeight)
                // self.game.scale.resize(newWidth, newHeight)
                // self.game.scene.scenes[1].cameras.main.setViewport(0, 0, newWidth, newHeight)
            }
            
        })

    }

    shouldComponentUpdate(): boolean {
        return false;
    }
    
    render(): React.ReactNode {
        return <div id="phaser-game"/>
    }
    private game!: Phaser.Game;
    
}