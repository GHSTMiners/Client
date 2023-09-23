// eslint-disable-next-line @typescript-eslint/no-unused-vars
import { Schema, type} from "@colyseus/schema"

export class PlayerSeatState extends Schema {
    @type ("number") map_vote!: number ;
    @type ("number") gotchi_id!: number ;
    @type ("boolean") ready!: boolean ;
}
