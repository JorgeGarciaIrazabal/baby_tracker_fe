import {Injectable} from "@angular/core"
import {ApiApi} from "../openapi/apis"
import {Configuration, Middleware} from "../openapi"
import {environment} from "../environments/environment"
import {Storage} from "@ionic/storage"

@Injectable({
    providedIn: "root"
})
export class ApiService {
    public api: ApiApi

    constructor(private storage: Storage) {
        console.log(environment)
        const basePath = environment.production ? "" : "http://localhost:9001"
        this.api = new ApiApi(new Configuration({
                basePath,
                middleware: [
                    {
                        pre: async (context) => {
                            const token = await this.storage.get("token")
                            if (context.url.includes("sign")) {
                                return {
                                    url: context.url,
                                    init: context.init,
                                }
                            }
                            // @ts-ignore
                            context.init.headers.Authorization = `Bearer ${token}`
                            return {
                                url: context.url,
                                init: context.init,
                            }
                        }
                    }
                ]
            })
        )
    }
}
