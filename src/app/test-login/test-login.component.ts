import {Component, OnInit} from "@angular/core"
import {FormBuilder, Validators} from "@angular/forms"
import {Parent, ParentWithToken} from "../../openapi/models"
import {NavController, ToastController} from "@ionic/angular"
import {ApiService} from "../api.service"
import {Storage} from "@ionic/storage"


@Component({
    selector: "app-test-login",
    templateUrl: "./test-login.component.html",
    styleUrls: ["./test-login.component.scss"]
})
export class TestLoginComponent implements OnInit {
    parentForm = this.fb.group({
        name: null,
        email: [null, Validators.required],
        password: [null, Validators.required],
        signingUp: [false]
    })
    public signingUp = false

    constructor(private fb: FormBuilder,
                public nav: NavController,
                public toastCtrl: ToastController,
                public apiService: ApiService,
                private storage: Storage) {
    }

    async ngOnInit() {
        await this.storage.ready()
        const loggedParent =  await this.storage.get("self")
        if (loggedParent !== null) {
            await this.nav.navigateRoot("tabs/timeline")
        }
    }


    async onSubmit(parent) {
        try {
            let parentWithToken: ParentWithToken
            if (!this.signingUp) {
                parentWithToken = await this.apiService.api.signIn({
                    email: parent.email,
                    password: parent.password
                })
            } else {
                parentWithToken = await this.apiService.api.signUp({parent})
            }
            const t = await this.toastCtrl.create({
                message: "Successfully logged in",
                duration: 1000,
            })
            await this.storage.set("self", parentWithToken.parent)
            await this.storage.set("token", parentWithToken.token)
            await this.nav.navigateRoot("")
            await t.present()
        } catch (e) {
            const t = await this.toastCtrl.create({
                message: "failed logging in :(",
                duration: 1000,
            })
            await t.present()
        }
    }
}
