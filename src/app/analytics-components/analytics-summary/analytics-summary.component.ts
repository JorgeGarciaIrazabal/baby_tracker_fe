import {Component, Input, OnInit} from "@angular/core"

@Component({
    selector: "app-analytics-summary",
    templateUrl: "./analytics-summary.component.html",
    styleUrls: ["./analytics-summary.component.scss"],
})
export class AnalyticsSummaryComponent implements OnInit {
    @Input() todayRows: Array<string>
    @Input() last24Rows: Array<string>

    constructor() {
    }

    ngOnInit() {
    }

}
