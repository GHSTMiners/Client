// 
// THIS FILE HAS BEEN GENERATED AUTOMATICALLY
// DO NOT CHANGE IT MANUALLY UNLESS YOU KNOW WHAT YOU'RE DOING
// 
// GENERATED USING @colyseus/schema 2.0.3
// 
// eslint-disable-next-line @typescript-eslint/no-unused-vars
import { Schema, type } from "@colyseus/schema"

export class ExplosiveEntry extends Schema {
    @type ("number") public explosiveID!: number;
    @type ("number") public amount!: number;
    @type ("number") nextTimeAvailable! : number;
    @type ("number") amountSpawned! : number;
    @type ("number") amountPurchased! : number;
}