// 
// THIS FILE HAS BEEN GENERATED AUTOMATICALLY
// DO NOT CHANGE IT MANUALLY UNLESS YOU KNOW WHAT YOU'RE DOING
// 
// GENERATED USING @colyseus/schema 2.0.3
// 
// eslint-disable-next-line @typescript-eslint/no-unused-vars
import { Schema, type, ArraySchema } from '@colyseus/schema';

export class Layer extends Schema {
    @type(["uint32"]) public blocks: ArraySchema<number> = new ArraySchema<number>();
}
