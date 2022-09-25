import { ServerRegion } from "chisel-api-interface/lib/ServerRegion";
import * as Chisel from "chisel-api-interface";
import { useGlobalStore } from "store"

import axios from 'axios';

export type Point = {
    lat: number;
    long: number;
  };

export default class ServerLocator {
    constructor(apiInterface: Chisel.APIInterface) {
        apiInterface.server_regions().then(regions => {
            this.regions = regions;
            useGlobalStore.getState().setServerRegions(regions)
            let nearestLocation : number = Number.MAX_SAFE_INTEGER
            this.estimateClientLocation().then(result => {
                let clientCoordinate : Point = {lat: result[0], long: result[1]}

                this.regions?.forEach((region : ServerRegion, index : number) => {
                    let regionCoordinate : Point = {lat: region.latitude as number, long: region.longitude as number}
                    let distanceToRegion : number = this.distanceBetweenPoints(clientCoordinate, regionCoordinate)
                    console.log(`Distance to ${region.name}, is ${distanceToRegion/1000} kilometres`)
                    if(nearestLocation > distanceToRegion) {
                        nearestLocation = distanceToRegion
                        this.closestRegion = region
                        useGlobalStore.getState().setRegion(region)
                    }
                })

                console.log(`Closest region is: ${this.closestRegion?.name}`)
                
            })
        })
    }

    private distanceBetweenPoints(p1 : Point, p2 : Point) {
        const R = 6371e3; // metres
        const φ1 = p1.lat * Math.PI/180; // φ, λ in radians
        const φ2 = p2.lat * Math.PI/180;
        const Δφ = (p2.lat-p1.lat) * Math.PI/180;
        const Δλ = (p2.long-p1.long) * Math.PI/180;

        const a = Math.sin(Δφ/2) * Math.sin(Δφ/2) +
                Math.cos(φ1) * Math.cos(φ2) *
                Math.sin(Δλ/2) * Math.sin(Δλ/2);
        const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));

        return R * c; // in metres
    }

    private async estimateClientLocation() : Promise<any> {
        var timezone = Intl.DateTimeFormat().resolvedOptions().timeZone;
        return axios.get('assets/geo/timezone_centers.json').then(response => {
            var timezone_locations = response.data
            return timezone_locations[timezone]
        })
    }

    private regions? : ServerRegion[]
    public closestRegion? : ServerRegion
}