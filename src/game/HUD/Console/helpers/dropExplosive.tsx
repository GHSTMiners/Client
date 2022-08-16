import * as Protocol from "gotchiminer-multiplayer-protocol"
import Client from "matchmaking/Client";

function dropExplosive(explosiveID?: number) {
    if (explosiveID){
        let requestDropExplosive: Protocol.RequestDropExplosive = new Protocol.RequestDropExplosive();
        requestDropExplosive.explosiveID = explosiveID;
        let serializedMessage: Protocol.Message = Protocol.MessageSerializer.serialize(requestDropExplosive);
        Client.getInstance().colyseusRoom.send(serializedMessage.name, serializedMessage.data);
    }
}

export default dropExplosive