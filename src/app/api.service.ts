import {Injectable} from "@angular/core"
import {ApiApi} from "../openapi/apis"
import {Configuration} from "../openapi"
import {environment} from "../environments/environment"

@Injectable({
    providedIn: "root"
})
export class ApiService {
    public api: ApiApi

    constructor() {
        console.log(environment)
        console.log("HEYYY THIS IS NEW")
        const basePath = environment.production ? "https://babytrackerbe.herokuapp.com" : "http://localhost:9001"
        this.api = new ApiApi(new Configuration({
                    basePath,
                })
            )
    }
}
