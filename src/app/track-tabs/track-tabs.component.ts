import {Component, Input, OnInit, TemplateRef, ViewChild} from "@angular/core"
import {Baby, Growth, GrowthTypes, Pee, Poop, Sleep} from "../../openapi"
import {Metric} from "../models"
import {DatetimeToolsService} from "../datetime-tools.service"

type PeePoop = Pee | Poop

@Component({
    selector: "app-track-tabs",
    templateUrl: "./track-tabs.component.html",
    styleUrls: ["./track-tabs.component.scss"],
})
export class TrackTabsComponent implements OnInit {
    @Input() baby: Baby
    @Input() metric: Metric
    @ViewChild("loading")
    private defaultTabButtonsTpl: TemplateRef<any>

    Metric = Metric

    constructor(public dtt: DatetimeToolsService) {
    }

    ngOnInit() {
    }

    createNewGrowth(baby: Baby) {
        return new class implements Growth {
            at: Date = new Date()
            babyId: number = baby.id
            id: number = null
            measure = 0
            type: GrowthTypes = GrowthTypes.WEIGHT
        }
    }

    createNewSleep(baby: Baby) {
        return new class implements Sleep {
            startAt: Date = new Date()
            endAt: Date = null
            babyId: number = baby.id
            id: number = null
        }
    }

    createNewPee(baby: Baby) {
        return new class implements Pee {
            at: Date = new Date()
            babyId: number = baby.id
            id: number = null
        }
    }

    createNewPoop(baby: Baby) {
        return new class implements Poop {
            at: Date = new Date()
            babyId: number = baby.id
            id: number = null
        }
    }

    getSleepListHeader = (sleeps: Sleep[]) => {
            if (sleeps && sleeps.length > 0) {
                if (!sleeps[0].endAt) {
                    return `${this.baby.name} is sleeping`
                }
                return `${this.baby.name} woke up ${this.dtt.humanizeDuration(sleeps[0].endAt)} ago`
            }
            return "touch the + button add a sleeping record"
    }

    getPeePoopListHeader = (peePoops: PeePoop[]) => {
        if (peePoops && peePoops.length > 0) {
            return `Last ${this.metric} ${this.dtt.humanizeDuration(peePoops[0].at)} ago`
        }
        return `touch the + button add a ${this.metric}ing record`
    }

    public getEntityStartAtDate(e) {
        return e.startAt
    }
}
