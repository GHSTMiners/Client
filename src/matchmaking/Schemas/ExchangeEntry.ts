// 
// THIS FILE HAS BEEN GENERATED AUTOMATICALLY
// DO NOT CHANGE IT MANUALLY UNLESS YOU KNOW WHAT YOU'RE DOING
// 
// GENERATED USING @colyseus/schema 2.0.3
// 

import { Schema, type } from "@colyseus/schema"

export class ExchangeEntry extends Schema {
    @type ("float32") public crypto_id!: number;
    @type ("int32") public usd_value!: number;
}