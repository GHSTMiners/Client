// 
// THIS FILE HAS BEEN GENERATED AUTOMATICALLY
// DO NOT CHANGE IT MANUALLY UNLESS YOU KNOW WHAT YOU'RE DOING
// 
// GENERATED USING @colyseus/schema 2.0.3
// 
// eslint-disable-next-line @typescript-eslint/no-unused-vars
import { Schema, type} from '@colyseus/schema';


export class Rock extends Schema {
    @type("boolean") public digable!: boolean;
    @type("boolean") public explodable!: boolean;
    @type("boolean") public lava!: boolean;
}
