import * as APIInterface from "chisel-api-interface"
import Client from "matchmaking/Client"
import * as Schema from "matchmaking/Schemas";
import Building from "../../World/Building"
import { Player } from ".././../World/Player";
import * as Protocol from "gotchiminer-multiplayer-protocol"
import gameEvents from "game/helpers/gameEvents";
import MainScene from "game/Scenes/MainScene";
import { RefineAnimation } from "game/World/RefineAnimation";
import { useGlobalStore } from "store";

export default class BuildingRenderer extends Phaser.GameObjects.GameObject {
    constructor(scene : MainScene) {
        super(scene, "BuildingRenderer")
        this.soundFXManager = scene.soundFXManager;
        this.buildings = new Map<APIInterface.Building, Building>()
        this.loadBuildings();
        this.scene.game.events.on( gameEvents.room.JOINED, this.handlePlayerAdded, this);
        this.scene.game.events.on( gameEvents.game.USEBUILDING, () => this.handleActivateKey() );
        this.scene.add.existing(this);
        this.currentBuilding = undefined
    }

    private handleActivateKey() {

        if(this.currentBuilding) {
            //Play sound
            this.soundFXManager.play(`building_activation_${this.currentBuilding.id}`)
            switch (this.currentBuilding.type){
                case 'Refinery':
                    this.scene.game.events.emit( gameEvents.refinary.REFINE );
                    const playerCargo = useGlobalStore.getState().cargo;
                    Object.keys(playerCargo)
                        .filter( cryptoID => playerCargo[+cryptoID] > 0 )
                        .forEach( cryptoID => new RefineAnimation(this.scene,cryptoID) )
                    break;
                case 'Bazaar':
                    this.scene.game.events.emit( gameEvents.shop.SHOW );
                    break;
            }
             
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
        if(this.player) {
            this.playerAtBuilding = false;
            this.buildings.forEach(building => {
                if(Phaser.Geom.Intersects.RectangleToRectangle(building.getBounds(), this.player!.getBounds())) {
                    this.playerAtBuilding = true;
                    if( this.currentBuilding !== building.buildingInfo){
                        this.player?.setPlayerAtBuilding(building.buildingInfo.type)
                        this.player?.displayMessage(building.buildingInfo.activation_message,  10)
                        this.currentBuilding = building.buildingInfo
                    }
                    return
                } 
            })

            if (this.playerAtBuilding === false){
                if (this.currentBuilding){
                    this.player?.hideMessage()
                    this.currentBuilding = undefined;
                }
            }
        }
    }
    
    private soundFXManager 
    private player : Player | undefined;
    private buildings : Map<APIInterface.Building, Building>
    private currentBuilding : APIInterface.Building | undefined = undefined;
    private playerAtBuilding: boolean = false;
}