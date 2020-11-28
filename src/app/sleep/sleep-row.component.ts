import {Component, Input, OnInit} from "@angular/core"
import {Baby, Sleep} from "../../openapi/models"
import {DatetimeToolsService} from "../datetime-tools.service"
import {UnitUtilsService} from "../unit-utils.service"

export interface SleepRowCtx {
    entity: Sleep
    baby: Baby
}

@Component({
    selector: "app-sleep-row",
    styleUrls: ["../track-base/track-base.component.scss"],
    template: `
        <div class="row-div">
            <div
                mat-line>{{dtt.humanizeTime(ctx.entity.startAt)}} {{ctx.entity.endAt ? (" - " + dtt.humanizeTime(ctx.entity.endAt)) : "" }}
            </div>
            <div mat-line>
                {{dtt.humanizeDuration(ctx.entity.startAt, ctx.entity.endAt)}}
            </div>
        </div>
    `,
})
export class SleepRowComponent implements OnInit {
    @Input() public ctx: SleepRowCtx

    constructor(public dtt: DatetimeToolsService, public uu: UnitUtilsService) {
    }

    ngOnInit() {
    }
}
