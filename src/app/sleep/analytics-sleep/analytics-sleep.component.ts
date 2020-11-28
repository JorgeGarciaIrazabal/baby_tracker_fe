import {Component, Input, OnInit} from "@angular/core"
import {ApiService} from "../../api.service"
import {Baby, Sleep} from "../../../openapi/models"
// @ts-ignore
import Enumerable from "linq"
// @ts-ignore
import moment from "moment";
import {DatetimeToolsService} from "../../datetime-tools.service";


@Component({
    selector: "app-analytics-sleep",
    template: `
        <div class="ion-padding">
            <app-analytics-summary *ngIf="summary"
                                   [todayRows]="['Duration ' + summary.durationToday +  'min']"
                                   [last24Rows]="['Duration ' + summary.duration24h +  ' min']"
            ></app-analytics-summary>
            <div class="d-flex">
                <app-analytics-date-range-select [(ngModel)]="dateRangeSelected"
                                                 (ngModelChange)="refreshCharts()"
                >
                </app-analytics-date-range-select>
            </div>
            <div style="display: block">
                <app-bar-chart [dataSets]="[durationDataSet]" [labels]="durationLabels"></app-bar-chart>
            </div>
        </div>
    `,
    styleUrls: ["./analytics-sleep.component.scss"],
})
export class AnalyticsSleepComponent implements OnInit {
    @Input() baby: Baby

    public sleeps: Array<Sleep> = []
    private sleepsPerDay: any = {}
    public durationDataSet: { data: number[]; label: string };
    public dateRangeSelected = 7
    public durationLabels: Array<string>;

    constructor(public apiService: ApiService, public dtt: DatetimeToolsService) {
    }

    public summary: {
        avgDurationPerDay: number,
        duration24h: number,
        durationToday: number
    }

    async ngOnInit() {
        await this.refreshCharts()
    }

    private getAnalyticsStartAt() {
        const startAtDate = moment().subtract(this.dateRangeSelected - 1, "d")
        startAtDate.startOf("day")
        return startAtDate
    }

    private async fetchSleepsWithinRange() {
        this.sleeps = await this.apiService.api.getBabySleeps(
            {babyId: this.baby.id, startAt: this.getAnalyticsStartAt()}
        )
        this.sleeps = Enumerable.from(this.sleeps).where((s) => s.endAt).orderBy((s) => s.start_at).toArray()
        this.sleepsPerDay = Enumerable.from(this.sleeps)
            .groupBy(
                s => (moment(s.startAt).format("MMM DD")),
                null,
                (key, g) => {
                    // @ts-ignore
                    return {key, sleeps: g.toArray()}
                },
            ).toArray()
    }

    private populateSummary() {
        const sleeps24h = this.sleeps.filter((sleep) => {
            return moment(sleep.startAt) > moment().subtract(1, "d")
        })
        const sleepsToday = Enumerable.from(this.sleepsPerDay)
            .firstOrDefault(f => f.key == moment().format("MMM DD"), {entities: []}).entities

        const duration24h = Math.round(Enumerable.from(sleeps24h).sum(this.dtt.humanizeDiffMinutes))
        const durationToday = Math.round(Enumerable.from(sleepsToday).sum(this.dtt.humanizeDiffMinutes))

        const totalDuration = Math.round(Enumerable.from(this.sleeps).sum(this.dtt.humanizeDiffMinutes) - durationToday)

        const daysCountButToday = this.dateRangeSelected - 1
        this.summary = {
            duration24h,
            durationToday,
            avgDurationPerDay: totalDuration / daysCountButToday,
        }
    }

    private populateDurationChart() {
        this.durationDataSet = {
            data: Enumerable.from(this.sleepsPerDay).select(s => {
                return Enumerable.from(s.sleeps).sum((s: Sleep) => {
                    return moment.duration(moment(s.endAt).diff(moment(s.startAt))).asMinutes()
                })
            }).toArray(),
            label: `Sleeping duration per day (min). Avg ${this.summary.avgDurationPerDay.toFixed(2)} min/day`
        }

        this.durationLabels = Enumerable.from(this.sleepsPerDay).select(s => s.key).toArray()
    }


    public async refreshCharts() {
        await this.fetchSleepsWithinRange()
        this.populateSummary()
        this.populateDurationChart()
    }
}
