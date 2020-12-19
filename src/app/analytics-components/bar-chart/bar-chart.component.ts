import {Component, Input, OnInit} from "@angular/core"
import {ChartDataSet} from "../../models"


@Component({
    selector: "app-bar-chart",
    templateUrl: "./bar-chart.component.html",
    styleUrls: ["./bar-chart.component.scss"]
})
export class BarChartComponent implements OnInit {
    // public chartType = "bar"

    @Input() public dataSets: Array<ChartDataSet> = []
    @Input() public labels: Array<string>
    @Input() public unit = "min"
    @Input() public chartType = "bar"
    @Input() public stacked = false
    @Input() public labelCallback = (tooltipItem, data) => {
        return `${Math.round(tooltipItem.yLabel)} (${this.unit})`
    }

    public chartColors: Array<any> = [
        {
            backgroundColor: "#a987ea",
            borderColor: "rgba(103,58,183,0.67)",
            borderWidth: 2,
        },
        {
            backgroundColor: "#87eaa0",
            borderColor: "rgb(78,131,29)",
            borderWidth: 2,
        }
    ]

    public chartOptions: any = {
        responsive: true,
        scales: {
            yAxes: [{
                ticks: {
                    beginAtZero: true
                },
                stacked: this.stacked
            }],
            xAxes: [{
                stacked: this.stacked
            }],
        },
        tooltips: {
            callbacks: {
                label: this.labelCallback
            }
        }
    }

    ngOnInit() {
        this.chartOptions.scales.yAxes[0].stacked = this.stacked
        this.chartOptions.tooltips.callbacks.label = this.labelCallback
    }

    public chartClicked(e: any): void {
    }

    public chartHovered(e: any): void {
    }
}
