import MainScene from "game/Scenes/MainScene";
import * as Protocol from "gotchiminer-multiplayer-protocol"
import Client from "matchmaking/Client";


function requestUseConsumable(consumableID: number) {
    const soundFXManager = (Client.getInstance().phaserGame?.scene.getScene('MainScene') as MainScene)?.soundFXManager;
    let requestUtilizeConsumable: Protocol.RequestUseConsumable = new Protocol.RequestUseConsumable();
    requestUtilizeConsumable.consumableID = consumableID;
    console.log(`Requesting to use consumable ID ${consumableID}`)
    let serializedMessage: Protocol.Message = Protocol.MessageSerializer.serialize(requestUtilizeConsumable);
    Client.getInstance().colyseusRoom.send(serializedMessage.name, serializedMessage.data);
    soundFXManager?.play('consumable')
}

export default requestUseConsumable