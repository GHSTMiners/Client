import { Schema, type } from '@colyseus/schema';

export class WalletEntry extends Schema {
    @type ("number") cryptoID!: number
    @type ("number") amount! : number
}