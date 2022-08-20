
import Client from "matchmaking/Client";
import * as Protocol from "gotchiminer-multiplayer-protocol"

const submitMessage = (event: React.FormEvent<HTMLFormElement>,chatMessage:string) => {
    event.preventDefault(); // prevent the page from reloading
    const gameMode = true; // add some extra logic if lobby chat is implemented
    let message : Protocol.MessageToServer = new Protocol.MessageToServer();
    message.msg = chatMessage;
    let serializedMessage : Protocol.Message = Protocol.MessageSerializer.serialize(message)
    if (gameMode){
      if ( Client.getInstance().colyseusRoom){
        Client.getInstance().colyseusRoom.send(serializedMessage.name, serializedMessage.data)
      }
    } else {
      if ( Client.getInstance().lobbyRoom){
        Client.getInstance().lobbyRoom.send(serializedMessage.name, serializedMessage.data)
      }
    }
  };

  export default submitMessage