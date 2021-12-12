import * as Chisel from "chisel-api-interface";
import * as Colyseus from "colyseus.js"
import { World } from "matchmaking/Schemas/World";

export default class Client {
    private static instance: Client;
    public colyseusClient : Colyseus.Client = new Colyseus.Client('ws://localhost:2567');
    public apiInterface : Chisel.APIInterface = new Chisel.APIInterface('https://chisel.gotchiminer.rocks/api')
    public colyseusRoom? : Colyseus.Room<World>
    public chiselWorld! : Chisel.DetailedWorld
    /**
     * The Singleton's constructor should always be private to prevent direct
     * construction calls with the `new` operator.
     */
    private constructor() { }

    /**
     * The static method that controls the access to the singleton instance.
     *
     * This implementation let you subclass the Singleton class while keeping
     * just one instance of each subclass around.
     */
    public static getInstance(): Client {
        if (!Client.instance) {
            Client.instance = new Client();
        }

        return Client.instance;
    }

    /**
     * Finally, any singleton should define some business logic, which can be
     * executed on its instance.
     */
    public someBusinessLogic() {
        // ...
    }
}