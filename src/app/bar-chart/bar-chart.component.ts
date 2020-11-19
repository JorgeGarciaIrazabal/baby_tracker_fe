import {Component, Input} from "@angular/core"
import {ChartDataSet} from "../models"



@Component({
    selector: "app-bar-chart",
    templateUrl: "./bar-chart.component.html",
    styleUrls: ["./bar-chart.component.scss"]
})
export class BarChartComponent {
    public chartType = "bar"

    @Input() public dataSets: Array<ChartDataSet> = [
        { data: [65, 59, 80, 81, 56, 55, 40], label: "My First dataset" }
    ]

    @Input() public labels: Array<string> = []
    @Input() public unit = "min"

    public chartColors: Array<any> = [
        {
            backgroundColor: "#a987ea",
            borderColor: "rgba(103,58,183,0.67)",
            borderWidth: 2,
        }
    ]

    public chartOptions: any = {
        responsive: true,
        scales: {
            yAxes: [{
                ticks: {
                    beginAtZero: true
                }
            }]
        },
        tooltips: {
            callbacks: {
                label: (tooltipItem, data) => {
                    return `${Math.round(tooltipItem.yLabel)} (${this.unit})`
                }
            }
        }
    }

    public chartClicked(e: any): void { }
    public chartHovered(e: any): void { }
}
