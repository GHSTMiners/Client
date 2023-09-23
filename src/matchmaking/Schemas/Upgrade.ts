// eslint-disable-next-line @typescript-eslint/no-unused-vars
import { Schema, type } from "@colyseus/schema"

export class Upgrade extends Schema {
    @type ("number") id : number = 0;
    @type ("number") tier : number = 0;
}