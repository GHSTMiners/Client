// 
// THIS FILE HAS BEEN GENERATED AUTOMATICALLY
// DO NOT CHANGE IT MANUALLY UNLESS YOU KNOW WHAT YOU'RE DOING
// 
// GENERATED USING @colyseus/schema 2.0.3
// 
// eslint-disable-next-line @typescript-eslint/no-unused-vars
import { Schema, type } from "@colyseus/schema"

export class Explosive extends Schema {
    @type ("uint16") public explosiveID!: number;
    @type ("int32") public x!: number;
    @type ("int32") public y!: number;
}