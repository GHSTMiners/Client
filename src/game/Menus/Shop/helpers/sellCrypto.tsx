import * as Chisel from "chisel-api-interface";
import * as Protocol from "gotchiminer-multiplayer-protocol"
import Client from "matchmaking/Client";

const sellCrypto = (cryptoID : number, amount: number) => {
    const world: Chisel.DetailedWorld | undefined =   Client.getInstance().chiselWorld;
    let message : Protocol.ExchangeCrypto = new Protocol.ExchangeCrypto();
    message.sourceCryptoId = cryptoID;
    message.targetCryptoId = world.world_crypto_id;
    message.amount = amount;
    let serializedMessage : Protocol.Message = Protocol.MessageSerializer.serialize(message);
    Client.getInstance().colyseusRoom.send(serializedMessage.name, serializedMessage.data);
  };

export default sellCrypto