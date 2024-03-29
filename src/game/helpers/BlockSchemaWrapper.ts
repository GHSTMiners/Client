import { SpawnType } from "chisel-api-interface";

export class BlockSchemaWrapper {
    static blockToString(block: BlockInterface) : number {
        // [8-bit spawntype][12-bit soilID][12-bit spawnID]
        const spawnType = block.spawnType << 24
        const soilID    = block.soilID << 12
        const spawnID   = block.spawnID << 0
        return spawnType | soilID | spawnID
    }

    static stringToBlock(value : number) : BlockInterface {
        const spawnType = (value & 0b11111111000000000000000000000000) >> 24
        const soilID    = (value & 0b00000000111111111111000000000000) >> 12
        const spawnID   = (value & 0b00000000000000000000111111111111) >> 0

        const block = {} as BlockInterface
        block.soilID = soilID
        block.spawnType = spawnType
        block.spawnID = spawnID
        return block
    }
}

export interface BlockInterface {
    soilID : number
    spawnType : SpawnType
    spawnID : number
}