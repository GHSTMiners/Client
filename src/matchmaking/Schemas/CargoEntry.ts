// 
// THIS FILE HAS BEEN GENERATED AUTOMATICALLY
// DO NOT CHANGE IT MANUALLY UNLESS YOU KNOW WHAT YOU'RE DOING
// 
// GENERATED USING @colyseus/schema 2.0.3
// 
// eslint-disable-next-line @typescript-eslint/no-unused-vars
import { Schema, type} from '@colyseus/schema';


export class CargoEntry extends Schema {
    @type("number") public cryptoID!: number;
    @type("number") public amount!: number;
}
