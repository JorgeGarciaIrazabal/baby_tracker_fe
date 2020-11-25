import {
    AfterViewInit,
    Component,
    ContentChild,
    ContentChildren,
    Input,
    OnDestroy,
    OnInit,
    TemplateRef,
    ViewChild,
    ViewContainerRef
} from "@angular/core"
import {Baby, Feed, FeedTypes, Growth} from "../../openapi/models"
import {FormBuilder} from "@angular/forms"
import {ApiService} from "../api.service"
import {MatDialog} from "@angular/material/dialog"
import {ToastController} from "@ionic/angular"
import {DatetimeToolsService} from "../datetime-tools.service"
import {UnitUtilsService} from "../unit-utils.service"

@Component({
    selector: "app-track-base",
    templateUrl: "./track-base.component.html",
    styleUrls: ["./track-base.component.scss"],
})
export class TrackBaseComponent implements OnInit, OnDestroy {
    @Input() formTpl: TemplateRef<any>
    @Input() baby: Baby
    @Input() createNewEntity: (baby: Baby) => any
    @Input() pageSize = 10
    @Input() pageSizeTotal = 30
    @Input() entitiesName: string
    public entities: Array<any>
    public editingId: number = null
    public self = this
    public formTplContext = {ctx: null}
    private interval = null

    constructor(private fb: FormBuilder,
                private apiService: ApiService,
                public dialog: MatDialog,
                public toastCtrl: ToastController,
                public dtt: DatetimeToolsService,
                public uu: UnitUtilsService) {
    }

    @Input() getEntityStartDate: (e) => Date = (e) => (e.at)

    async ngOnInit() {
        this.formTplContext = {
            ctx: {
                entity: null,
                onCancel: () => this.editingId = null,
                onRemove: this.onRemove.bind(this),
                baby: this.baby,
                onOk: this.entityEvent.bind(this),
            }
        }
        await this.refreshList()
        clearInterval(this.interval)

        this.interval = setInterval(() => {
            if (this.editingId === null) {
                this.refreshList()
            }
        }, 5000)
    }

    async ngOnDestroy() {
        clearInterval(this.interval)
    }

    async refreshList() {
        const entities = await this.apiService.api[`getBaby${this.entitiesName}s`]({
            babyId: this.baby.id,
            pageSize: this.pageSizeTotal,
        })
        this.entities = entities.sort((f1, f2) => {
            return this.getEntityStartDate(f1) < this.getEntityStartDate(f2) ? 1 : -1
        })
    }

    async onRemove(entity) {
        await this.apiService.api[`delete${this.entitiesName}`]({id: entity.id})
        await this.refreshList()
        this.editingId = null
    }

    async onScroll() {
        this.pageSizeTotal += this.pageSize
        await this.refreshList()
    }

    async entityEvent(entity) {
        if (entity.id === -1) {
            await this.createEntity(entity)
        } else {
            await this.updateEntity(entity)
        }
        await this.refreshList()
        this.editingId = null
    }

    async createEntity(entity) {
        try {
            delete entity.id
            const params = {
                [this.entitiesName.toLowerCase()]: entity
            }
            await this.apiService.api[`create${this.entitiesName}`](params)
        } catch (e) {
            await (await this.toastCtrl.create({
                message: `failed creating ${this.entitiesName.toLowerCase()}`,
                duration: 1
            })).present()
        }
    }

    async updateEntity(entity) {
        try {
            entity.id = this.editingId
            const params = {
                [this.entitiesName.toLowerCase()]: entity
            }
            await this.apiService.api[`update${this.entitiesName}`](params)
        } catch (e) {
            await (await this.toastCtrl.create({
                message: `failed updating  ${this.entitiesName.toLowerCase()}`,
                duration: 1
            })).present()
        }
    }

    updateEditingId = (entity) => {
        this.editingId = entity.id
        this.formTplContext.ctx.entity = entity
    }

    addEmptyEntity = () => {
        const baby = this.baby
        const newEntity = this.createNewEntity(baby)
        newEntity.id = -1
        this.entities = [
            newEntity,
            ...this.entities
        ]
        this.formTplContext.ctx.entity = newEntity
        this.editingId = -1
    }
}
