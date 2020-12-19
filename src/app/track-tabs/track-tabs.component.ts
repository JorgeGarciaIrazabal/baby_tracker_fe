import {Component, Input, OnInit, TemplateRef, ViewChild} from "@angular/core"
import {Baby, Growth, GrowthTypes, Pee, Poop, Sleep} from "../../openapi/models"
import {Metric} from "../models"

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

    tabLoadTimes: Date[] = []
    Metric = Metric

    constructor() {
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

    public getEntityStartAtDate(e) {
        return e.startAt
    }
}
