import { Schema, type } from "@colyseus/schema"

export class CargoEntry extends Schema {
    @type ("number") cryptoID!: number
    @type ("number") amount! : number
}