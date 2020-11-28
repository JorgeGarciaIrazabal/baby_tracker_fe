import {Component, Input, OnInit} from "@angular/core"
import {ApiService} from "../../api.service"
import {Baby, Pee, Poop} from "../../../openapi/models"
// @ts-ignore
import Enumerable from "linq"
// @ts-ignore
import moment from "moment";
import {DatetimeToolsService} from "../../datetime-tools.service";


type Entity = Pee | Poop

@Component({
    selector: "app-analytics-simple-generic",
    template: `
        <div class="ion-padding">
            <app-analytics-summary *ngIf="summary"
                                   [todayRows]="['Times: ' + summary.countToday]"
                                   [last24Rows]="['Times: ' + summary.count24h]"
            ></app-analytics-summary>
            <div class="d-flex">
                <app-analytics-date-range-select [(ngModel)]="dateRangeSelected"
                                                 (ngModelChange)="refreshCharts()"
                >
                </app-analytics-date-range-select>
            </div>
            <div style="display: block">
                <app-bar-chart [dataSets]="[countDataSet]" [labels]="countLabels" unit="times"></app-bar-chart>
            </div>
        </div>
    `,
    styleUrls: ["./analytics-simple-generic.component.scss"],
})
export class AnalyticsSimpleGenericComponent implements OnInit {
    @Input() baby: Baby
    @Input() entityName: string

    public entities: Array<Entity> = []
    private entitiesPerDay: any = {}
    public countDataSet: { data: number[]; label: string };
    public dateRangeSelected = 7
    public countLabels: Array<string>;

    constructor(public apiService: ApiService, public dtt: DatetimeToolsService) {
    }

    public summary: {
        avgCountPerDay: number,
        count24h: number,
        countToday: number
    }

    async ngOnInit() {
        await this.refreshCharts()
    }

    private getAnalyticsStartAt() {
        const startAtDate = moment().subtract(this.dateRangeSelected - 1, "d")
        startAtDate.startOf("day")
        return startAtDate
    }

    private async fetchEntitiesWithinRange() {
        this.entities = await this.apiService.api[`getBaby${this.entityName}s`](
            {babyId: this.baby.id, at: this.getAnalyticsStartAt()}
        )
        this.entities = Enumerable.from(this.entities)
            .orderBy((s) => s.at).toArray()
        this.entitiesPerDay = Enumerable.from(this.entities)
            .groupBy(
                s => (moment(s.at).format("MMM DD")),
                null,
                (key, g) => {
                    // @ts-ignore
                    return {key, entities: g.toArray()}
                },
            ).toArray()
    }

    private populateCountChart() {
        this.countDataSet = {
            data: Enumerable.from(this.entitiesPerDay).select(s => s.entities.length).toArray(),
            label: `${this.entityName}s count per day. Avg ${this.summary.avgCountPerDay.toFixed(2)} per day`
        }

        this.countLabels = Enumerable.from(this.entitiesPerDay).select(s => s.key).toArray()
    }

    private populateSummary() {
        const entities24h = this.entities.filter((entity) => {
            return moment(entity.at) > moment().subtract(1, "d")
        })
        const entitiesToday = Enumerable.from(this.entitiesPerDay)
            .firstOrDefault(f => f.key == moment().format("MMM DD"), {entities: []}).entities

        const count24h = entities24h.length
        const countToday = entitiesToday.length

        const totalCount = this.entities.length - countToday

        const daysCountButToday = this.dateRangeSelected - 1
        this.summary = {
            count24h,
            countToday,
            avgCountPerDay: totalCount / daysCountButToday,
        }
    }

    public async refreshCharts() {
        await this.fetchEntitiesWithinRange()
        this.populateSummary()
        this.populateCountChart()
    }
}
