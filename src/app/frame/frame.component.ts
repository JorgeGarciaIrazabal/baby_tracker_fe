import {Component, OnInit} from "@angular/core"
import {BreakpointObserver, Breakpoints} from "@angular/cdk/layout"
import {Observable} from "rxjs"
import {map, shareReplay} from "rxjs/operators"
import {NavController, ToastController} from "@ionic/angular"
import {ApiService} from "../api.service"
import {Storage} from "@ionic/storage"
import {Baby, Parent} from "../../openapi/models"
import {MatDialog} from "@angular/material/dialog"
import {BabyDialogComponent} from "../baby-dialog/baby-dialog.component"
import {Metric} from "../models"

@Component({
    selector: "app-frame",
    templateUrl: "./frame.component.html",
    styleUrls: ["./frame.component.scss"]
})
export class FrameComponent implements OnInit {
    public baby: Baby = null
    public parent: Parent = null

    isHandset$: Observable<boolean> = this.breakpointObserver.observe(Breakpoints.Handset)
        .pipe(
            map(result => result.matches),
            shareReplay()
        )
    public selectingNewParent: boolean
    public newParentsEmail: string
    public metrics = [
        { value: Metric.Feed, label: "Feeds" },
        { value: Metric.Growth, label: "Growth" }
    ]
    public metricSelected: Metric = Metric.Feed

    constructor(private breakpointObserver: BreakpointObserver, public nav: NavController,
                private storage: Storage, private apiService: ApiService, public dialog: MatDialog,
                public toastCtrl: ToastController) {
    }

    async ngOnInit() {
        await this.storage.ready()
        this.parent = await this.storage.get("self")
        if (this.parent === null) {
            await this.nav.navigateForward("login")
        }
        try {
            this.baby = await this.apiService.api.getParentsBaby({id: this.parent.id})
        } catch (e) {

        }
    }

    async logout() {
        await this.storage.ready()
        await this.storage.remove("self")
        await this.nav.navigateRoot("login")
    }

    async removeBaby() {
        await this.apiService.api.removeParentsBaby({
            babyId: this.baby.id,
            parentId: this.parent.id
        })
        this.baby = new class implements Baby {
            birthDate: Date
            fatherId: number
            id: number
            motherId: number
            name: string
        }
    }

    async openDialog() {
        const dialogRef = this.dialog.open(BabyDialogComponent, {
            width: "250px",
            data: null
        })

        dialogRef.afterClosed().subscribe(async result => {
            console.log("The dialog was closed")
            this.baby = result
            this.baby = await this.apiService.api.createBaby({baby: this.baby})
        })
    }

    setSelectingNewParent(value: boolean) {
        this.selectingNewParent = value
    }

    async setNewParent() {
        try {
            this.baby = await this.apiService.api.newParentForBaby({
                id: this.baby.id,
                newParentEmail: this.newParentsEmail
            })
        } catch (e) {
            await (await this.toastCtrl.create({
                message: "failed add new parent",
                duration: 1000,
            })).present()
        }
        this.selectingNewParent = false
    }

    showNewParent() {
        return this.baby !== null &&
            !this.selectingNewParent &&
            (this.baby.fatherId == null ||
                this.baby.motherId == null)
    }

    async doRefresh() {
        location.reload()
    }
}
