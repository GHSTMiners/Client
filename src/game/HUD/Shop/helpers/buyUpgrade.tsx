import Client from "matchmaking/Client";
import * as Protocol from "gotchiminer-multiplayer-protocol"

function buyUpgrade ( upgradeId:number , tier:number ) {
    let purchaseMessage : Protocol.PurchaseUpgrade = new Protocol.PurchaseUpgrade();
    purchaseMessage.id = upgradeId;
    purchaseMessage.tier = tier;
    const serializedMessage = Protocol.MessageSerializer.serialize(purchaseMessage);
    Client.getInstance().colyseusRoom.send(serializedMessage.name,serializedMessage.data);
}

export default buyUpgrade