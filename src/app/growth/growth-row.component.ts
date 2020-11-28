import {Component, Input, OnInit} from "@angular/core"
import {Baby, Growth} from "../../openapi/models"
import {DatetimeToolsService} from "../datetime-tools.service"
import {UnitUtilsService} from "../unit-utils.service"

export interface GrowthRowCtx {
    entity: Growth
    baby: Baby
}

@Component({
    selector: "app-growth-row",
    styleUrls: ["../track-base/track-base.component.scss"],
    template: `
        <div class="row-div">
            <div mat-line>{{ctx.entity.type}} - {{dtt.humanizeTime(ctx.entity.at)}}
                - {{ctx.entity.measure}} {{uu.getGrowthShortUnit(ctx.entity)}}
            </div>
        </div>
    `,
})
export class GrowthRowComponent implements OnInit {
    @Input() public ctx: GrowthRowCtx

    constructor(public dtt: DatetimeToolsService, public uu: UnitUtilsService) {
    }

    ngOnInit() {
    }
}
