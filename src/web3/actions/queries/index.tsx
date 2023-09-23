import { AavegotchiContractObject } from "types";

export interface AavegotchisOfOwner {
  aavegotchis: Array<AavegotchiContractObject>
}

export interface AavegotchisNameArray {
  aavegotchis: Array<{id:string, name:string}>
}

export const getAllAavegotchisOfOwner = (owner: string) => {
  const query = `
    {
      aavegotchis(first: 1000, orderBy: withSetsRarityScore, orderDirection: desc,  where: { owner:"${owner.toLowerCase()}", status: 3 }) {
        id
        name
        withSetsNumericTraits
        equippedWearables
        withSetsRarityScore
        owner {
          id
        }
      }
    }
  `
  return query;
}

export const getAavegotchiNames = (ids: string[]) => {
  const query = `
    {
      aavegotchis(first: 1000, where: { gotchiId_in: [${ids}] }) {
        id
        name
      }
    }
  `
  return query;
}