import {Injectable} from '@angular/core';
import {ApiApi} from "../openapi/apis";
import {Configuration} from "../openapi";
import {environment} from "../environments/environment";

@Injectable({
    providedIn: 'root'
})
export class ApiService {
    public api: ApiApi;

    constructor() {
        console.log(environment)
        let basePath = environment.production ? "https://babytrackerbe.herokuapp.com/" : "http://localhost9001"
            this.api = new ApiApi(new Configuration({
                    basePath: basePath,
                })
            )
    }
}
