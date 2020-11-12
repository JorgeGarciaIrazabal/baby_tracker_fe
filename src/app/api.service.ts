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
        const basePath = environment.production ? "http://b88a09688f3577649.temporary.link:9001" : "http://localhost:9001"
        this.api = new ApiApi(new Configuration({
                    basePath,
                })
            )
    }
}
