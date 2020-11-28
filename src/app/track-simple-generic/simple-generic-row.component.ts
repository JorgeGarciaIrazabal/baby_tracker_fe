import {Component, Input, OnInit} from "@angular/core"
import {Baby, Pee, Poop} from "../../openapi/models"
import {DatetimeToolsService} from "../datetime-tools.service"
import {UnitUtilsService} from "../unit-utils.service"

export interface SleepRowCtx {
    entity: Pee | Poop
    baby: Baby
}

@Component({
    selector: "app-simple-generic-row",
    styleUrls: ["../track-base/track-base.component.scss"],
    template: `
        <div class="row-div">
            <div
                mat-line>{{dtt.humanizeTime(ctx.entity.at)}}
            </div>
        </div>
    `,
})
export class SimpleGenericRowComponent implements OnInit {
    @Input() public ctx: SleepRowCtx

    constructor(public dtt: DatetimeToolsService, public uu: UnitUtilsService) {
    }

    ngOnInit() {
    }
}
