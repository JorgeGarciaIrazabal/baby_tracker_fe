import {Component, Input, OnInit} from "@angular/core"
import {ChartDataSet} from "../../models"
import {ApiService} from "../../api.service"
import {Baby, Growth, GrowthTypes} from "../../../openapi/models"
// @ts-ignore
import Enumerable from "linq"

@Component({
    selector: "app-analytics-growth",
    template: `
        <div class="ion-padding" *ngFor="let dataSet of dataSets">
            <div style="display: block">
                <canvas mdbChart
                        chartType="line"
                        [datasets]="[dataSet]"
                        [colors]="[dataSet.colors]"
                        [options]="chartOptions"
                        [legend]="true"
                >
                </canvas>
            </div>
        </div>
    `,
    styleUrls: ["./analytics-growth.component.scss"],
})
export class AnalyticsGrowthComponent implements OnInit {
    @Input() baby: Baby
    public dataSets: Array<ChartDataSet> = [{data: [], label: "No data available", colors: {}}]

    constructor(public apiService: ApiService) {
    }

    chartOptions: any = {
        responsive: true,
        scales: {
            yAxes: [{
                ticks: {
                    beginAtZero: true
                }
            }],
            xAxes: [{
                type: "time",
                time: {
                    displayFormats: {
                        day: "MMM D",
                        hour: "MMM D",
                        minute: "MMM D",
                    }
                }
            }]
        },
    }

    async ngOnInit() {
        const growths = await this.apiService.api.getBabyGrowths({babyId: this.baby.id})
        const selectDataSet = (g: Growth) => {
            return {
                x: g.at,
                y: g.measure,
            }
        }
        const heights = {
            data: Enumerable.from(growths).where((g: Growth) => g.type === GrowthTypes.HEIGHT).select(selectDataSet).toArray(),
            label: "Height (cm)",
            colors: {backgroundColor: "rgba(255, 0, 0, 0.1)"},
        }
        const weights = {
            data: Enumerable.from(growths).where((g: Growth) => g.type === GrowthTypes.WEIGHT).select(selectDataSet).toArray(),
            label: "Weight (kg)",
            colors: {backgroundColor: "rgba(0, 255, 0, 0.1)"},
        }
        const heads = {
            data: Enumerable.from(growths).where((g: Growth) => g.type === GrowthTypes.HEAD).select(selectDataSet).toArray(),
            label: "Head size (cm)",
            colors: {backgroundColor: "rgba(0, 0, 255, 0.1)"},
        }
        this.dataSets = [
            heights, heads, weights
        ].filter((d) => d.data.length > 0)
    }

}
