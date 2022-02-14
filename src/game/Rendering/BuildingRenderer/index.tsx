import * as APIInterface from "chisel-api-interface"
import Client from "matchmaking/Client"
import * as Schema from "matchmaking/Schemas";
import Building from "../../World/Building"
import { Player } from ".././../World/Player";
import * as Protocol from "gotchiminer-multiplayer-protocol"
import { act } from "react-dom/test-utils";

export default class BuildingRenderer extends Phaser.GameObjects.GameObject {
    constructor(scene : Phaser.Scene) {
        super(scene, "BuildingRenderer")
        this.buildings = new Map<APIInterface.Building, Building>()
        this.loadBuildings();
        this.scene.game.events.on("joined_game", this.handlePlayerAdded, this);
        this.scene.add.existing(this);
        var self = this
        scene.input.keyboard.on('keydown-E', function() {
            self.handleActivateKey()
        }, this)
        this.currentBuilding = undefined
    }

    private handleActivateKey() {
        if(this.currentBuilding) {
            //Play sound
            this.scene.sound.play(`building_activation_${this.currentBuilding.id}`)
            //Notify server
            let activateBuildingMessage : Protocol.ActivateBuilding = new Protocol.ActivateBuilding()
            activateBuildingMessage.id = this.currentBuilding.id
            let serializedMessage : Protocol.Message = Protocol.MessageSerializer.serialize(activateBuildingMessage)
            Client.getInstance().colyseusRoom.send(serializedMessage.name, serializedMessage.data)
        }
    }

    private handlePlayerAdded(schemaPlayer : Schema.Player, player : Player) {
        this.player = player
    }

    private loadBuildings() {
        var self = this;
        Client.getInstance().chiselWorld.buildings.forEach(building => {
            let newBuilding = new Building(building, this.scene)
            self.buildings.set(building, newBuilding)
        })
    }

    public preUpdate(time: number, delta: number) {
        this.currentBuilding = undefined
        if(this.player) {
            this.buildings.forEach(building => {
                if(Phaser.Geom.Intersects.RectangleToRectangle(building.getBounds(), this.player!.getBounds())) {
                    this.player?.displayMessage(building.buildingInfo.activation_message, 10)
                    this.currentBuilding = building.buildingInfo
                    return
                }
            })
        }
        if(!this.currentBuilding) this.player?.hideMessage()
    }
    private player : Player | undefined;
    private buildings : Map<APIInterface.Building, Building>
    private currentBuilding : APIInterface.Building | undefined
}