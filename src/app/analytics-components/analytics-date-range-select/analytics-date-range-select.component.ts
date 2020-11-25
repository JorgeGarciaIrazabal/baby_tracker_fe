import {Component, Input, OnInit, Output} from "@angular/core"
import {EventEmitter} from "@angular/core"

@Component({
    selector: "app-analytics-date-range-select",
    template: `
        <div class="d-flex date-range">
            <mat-form-field>
                <mat-label>Days To Analyze</mat-label>
                <mat-select [(ngModel)]="ngModel" (ngModelChange)="onRangeChanged()">
                    <mat-option *ngFor="let option of dateRangeOptions" [value]="option.value">
                        {{option.label}}
                    </mat-option>
                </mat-select>
            </mat-form-field>
        </div>
    `,
    styleUrls: ["./analytics-date-range-select.component.scss"],
})
export class AnalyticsDateRangeSelectComponent implements OnInit {
    @Input() ngModel: number
    @Output() ngModelChange = new EventEmitter<number>()

    public dateRangeOptions = [
        {value: 7, label: "Last 7 Days"},
        {value: 30, label: "Last 30 Days"},
        {value: 90, label: "Last 90 Days"},
    ]

    constructor() {
    }

    ngOnInit() {
    }

    onRangeChanged() {
        this.ngModelChange.emit(this.ngModel)
    }
}
