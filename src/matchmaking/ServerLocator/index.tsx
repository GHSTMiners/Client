import { ServerRegion } from "chisel-api-interface/lib/ServerRegion";
import * as Chisel from "chisel-api-interface";

import axios from 'axios';

export default class ServerLocator {
    constructor(apiInterface: Chisel.APIInterface) {
        apiInterface.server_regions().then(regions => {
            this.regions = regions;
            this.estimateClientLocation().then(result => {
                
            })
        })
    }

    private async estimateClientLocation() : Promise<any> {
        var timezone = Intl.DateTimeFormat().resolvedOptions().timeZone;
        return axios.get('assets/geo/timezone_centers.json').then(response => {
            var timezone_locations = response.data
            return timezone_locations[timezone]
        })
    }

    private regions? : ServerRegion[]
}