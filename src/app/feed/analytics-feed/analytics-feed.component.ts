import {Component, Input, OnInit} from "@angular/core"
import {ApiService} from "../../api.service"
import {ChartDataSet} from "../../models"
import {Baby, Feed} from "../../../openapi/models"
// @ts-ignore
import moment from "moment"
// @ts-ignore
import Enumerable from "linq"


export interface Summary {
    amount24h: number
    duration24h: number
    amountToday: number
    durationToday: number
    avgFeedingsPerDay: number
    avgAmountPerDay: number
    avgDurationPerDay: number
}


@Component({
    selector: "app-analytics-feed",
    templateUrl: "./analytics-feed.component.html",
    styleUrls: ["./analytics-feed.component.scss"],
})
export class AnalyticsFeedComponent implements OnInit {
    @Input() public baby: Baby
    public amountDataSet: ChartDataSet
    public amountLabels: Array<string>
    public durationDataSet: ChartDataSet
    public durationLabels: Array<string>
    public dateRangeOptions = [
        {value: 7, label: "Last 7 Days"},
        {value: 30, label: "Last 30 Days"},
        {value: 90, label: "Last 90 Days"},
    ]
    public dateRangeSelected = 7
    public summary: Summary = {
        amount24h: 0,
        amountToday: 0,
        avgAmountPerDay: 0,
        avgDurationPerDay: 0,
        avgFeedingsPerDay: 0,
        duration24h: 0,
        durationToday: 0
    }

    private feeds: Array<Feed> = []
    private feedsPerDay: {}

    constructor(public apiService: ApiService) {
    }

    async ngOnInit() {
        await this.refreshCharts()
    }

    private async refreshCharts() {
        await this.fetchFeedsWithinRange()
        this.populateSummary()
        this.populateAmountChart()
        this.populateDurationChart()
    }

    private populateSummary() {
        const feeds24h = this.feeds.filter((feed) => {
            return moment(feed.startAt) > moment().subtract(1, "d")
        })
        const feedsToday = this.feedsPerDay[moment().format("MMM DD")] || []

        const amount24h = Math.round(Enumerable.from(feeds24h).sum((f: Feed) => f.amount))
        const amountToday = Math.round(Enumerable.from(feedsToday).sum((f: Feed) => f.amount))
        const duration24h = Math.round(Enumerable.from(feeds24h).sum(this.getFeedDuration))
        const durationToday = Math.round(Enumerable.from(feedsToday).sum(this.getFeedDuration))

        const totalAmount = Math.round(Enumerable.from(this.feeds).sum((f: Feed) => f.amount) - amountToday)
        const totalDuration = Math.round(Enumerable.from(this.feeds).sum(this.getFeedDuration) - durationToday)

        const daysCountButToday = this.dateRangeSelected - 1
        this.summary = {
            amount24h,
            amountToday,
            duration24h,
            durationToday,
            avgAmountPerDay: totalAmount / daysCountButToday,
            avgDurationPerDay: totalDuration / daysCountButToday,
            avgFeedingsPerDay: (this.feeds.length - feedsToday.length) / daysCountButToday,
        }
    }

    private getFeedDuration(f: Feed) {
        return moment.duration(moment(f.endAt).diff(moment(f.startAt))).asMinutes()
    }

    private populateAmountChart() {
        this.amountDataSet = {
            data: Object.values(this.feedsPerDay).map((feeds: Array<Feed>) => {
                return Enumerable.from(feeds).sum((f: Feed) => f.amount)
            }),
            label: `Amount drank per day (ml). Avg ${this.summary.avgAmountPerDay.toFixed(2)} ml/day`
        }

        this.amountLabels = Object.keys(this.feedsPerDay)
    }

    private populateDurationChart() {
        this.durationDataSet = {
            data: Object.values(this.feedsPerDay).map((feeds: Array<Feed>) => {
                return Enumerable.from(feeds).sum((f: Feed) => {
                    return moment.duration(moment(f.endAt).diff(moment(f.startAt))).asMinutes()
                })
            }),
            label: `Feeding duration per day (min). Avg ${this.summary.avgDurationPerDay.toFixed(2)} min/day`
        }

        this.durationLabels = Object.keys(this.feedsPerDay)
    }

    private async fetchFeedsWithinRange() {
        const feeds = await this.apiService.api.getBabyFeeds(
            {babyId: this.baby.id, startAt: this.getAnalyticsStartAt()}
        )
        this.feeds = feeds.sort((f1, f2) => {
            return f1.startAt > f2.startAt ? 1 : -1
        }).filter((feed) => {
            return feed.amount
        })
        this.feedsPerDay = this.feeds.reduce((acc, feed) => {
            const day = moment(feed.startAt).format("MMM DD")
            if (!acc[day]) {
                acc[day] = []
            }
            acc[day].push(feed)
            return acc
        }, {})
    }

    private getAnalyticsStartAt() {
        const startAtDate = moment().subtract(this.dateRangeSelected - 1, "d")
        startAtDate.startOf("day")
        return startAtDate
    }

    public async onRangeChanged() {
        await this.refreshCharts()
    }
}
