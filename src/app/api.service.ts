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
        const basePath = environment.production ? "" : "http://localhost:9001"
        this.api = new ApiApi(new Configuration({
                    basePath,
                })
            )
    }
}
