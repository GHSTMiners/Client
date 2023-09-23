import Client from "matchmaking/Client";
import * as Protocol from "gotchiminer-multiplayer-protocol"
  
function buyConsumable ( id:number , quantity:number) {
  let purchaseMessage : Protocol.PurchaseConsumable = new Protocol.PurchaseConsumable();
  purchaseMessage.id = id;
  purchaseMessage.quantity = quantity;
  console.log(`Purchasing Consumable ${id}`)
  console.log(purchaseMessage)
  const serializedMessage = Protocol.MessageSerializer.serialize(purchaseMessage);
  Client.getInstance().colyseusRoom.send(serializedMessage.name,serializedMessage.data);
 }
 
 export default buyConsumable