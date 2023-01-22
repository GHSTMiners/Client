import Client from "matchmaking/Client";
import * as Protocol from "gotchiminer-multiplayer-protocol"
  
function buyItem ( id:number , quantity:number) {
  let purchaseMessage : Protocol.PurchaseExplosive = new Protocol.PurchaseExplosive();
  purchaseMessage.id = id;
  purchaseMessage.quantity = quantity;
  const serializedMessage = Protocol.MessageSerializer.serialize(purchaseMessage);
  Client.getInstance().colyseusRoom.send(serializedMessage.name,serializedMessage.data);
 }
 
 export default buyItem