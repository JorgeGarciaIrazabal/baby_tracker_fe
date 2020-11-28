import {Component, Input, OnChanges, OnInit} from "@angular/core"
import {FormBuilder, Validators} from "@angular/forms"
import {Baby, Sleep} from "../../openapi/models"
import {DatetimeToolsService} from "../datetime-tools.service"
import {UnitUtilsService} from "../unit-utils.service"

export interface SleepFromCtx {
    entity: Sleep
    onCancel: () => void
    onRemove: (sleep: Sleep) => void
    onOk: (sleep: Sleep) => void
    baby: Baby
}

@Component({
    selector: "app-sleep-form",
    styleUrls: ["../track-base/track-base.component.scss"],
    template: `
        <form [formGroup]="sleepForm">
            <mat-card>
                <mat-card-content class="card-content">
                    <div class="ion-float-right">
                        <button mat-mini-fab color="warn" (click)="myOnRemove()">
                            <mat-icon>delete</mat-icon>
                        </button>
                    </div>
                    <div class="simple-row">
                        <div class="col">
                            <mat-form-field class="edit-input">
                                <mat-label>Date</mat-label>
                                <input formControlName="startDate" matInput [matDatepicker]="startDatePicker">
                                <mat-datepicker-toggle matSuffix [for]="startDatePicker"></mat-datepicker-toggle>
                                <mat-datepicker touchUi #startDatePicker></mat-datepicker>
                            </mat-form-field>
                        </div>
                        <div class="col">
                            <mat-form-field class="edit-input">
                                <mat-label>Time</mat-label>
                                <input matInput formControlName="startTime" [ngxTimepicker]="startTimePicker"
                                       readonly>
                                <ngx-material-timepicker #startTimePicker></ngx-material-timepicker>
                            </mat-form-field>
                        </div>
                        <span class="spacer"></span>
                    </div>
                    <div class="simple-row">
                        <div class="col">
                            <mat-form-field class="edit-input">
                                <mat-label>Date</mat-label>
                                <input formControlName="endDate" matInput [matDatepicker]="endDatePicker">
                                <mat-datepicker-toggle matSuffix [for]="endDatePicker"></mat-datepicker-toggle>
                                <mat-datepicker touchUi #endDatePicker></mat-datepicker>
                            </mat-form-field>
                        </div>
                        <div class="col">
                            <mat-form-field class="edit-input">
                                <mat-label>Time</mat-label>
                                <input matInput formControlName="endTime" [ngxTimepicker]="endTimePicker"
                                       readonly>
                                <ngx-material-timepicker #endTimePicker></ngx-material-timepicker>
                            </mat-form-field>
                        </div>
                        <span class="spacer"></span>
                    </div>
                </mat-card-content>

                <mat-card-actions class="ion-padding-start">
                    <div class="simple-row">
                        <span class="spacer"></span>
                        <button mat-raised-button (click)="ctx.onCancel()">Cancel</button>
                        <button
                            mat-raised-button
                            color="primary"
                            [disabled]="sleepForm.status==='INVALID'"
                            (click)="myOnOk()">
                            Ok
                        </button>
                    </div>
                </mat-card-actions>
            </mat-card>
        </form>
    `,
})
export class SleepFormComponent implements OnInit, OnChanges {
    @Input() public ctx: SleepFromCtx

    sleepForm = this.fb.group({
        startDate: [null, Validators.required],
        startTime: [null, Validators.required],
        endDate: [null, Validators.required],
        endTime: [null, Validators.required],
    })

    constructor(private fb: FormBuilder, public dtt: DatetimeToolsService, public uu: UnitUtilsService) {
    }

    ngOnChanges(changes): void {
        if (changes.ctx?.currentValue?.entity) {
            this.setSleepInForm(changes.ctx.currentValue.entity)
        }
    }

    ngOnInit() {
    }

    myOnRemove() {
        return this.ctx.onRemove(this.sleepFromForm())
    }

    myOnOk() {
        return this.ctx.onOk(this.sleepFromForm())
    }

    private setSleepInForm(sleep: Sleep) {
        this.sleepForm.setValue({
            startDate: sleep.startAt,
            startTime: this.dtt.datetimeToStrTime(sleep.startAt),
            endDate: sleep.endAt ? sleep.endAt : null,
            endTime: sleep.endAt ? this.dtt.datetimeToStrTime(sleep.endAt) : null,
        })
    }

    private sleepFromForm(): Sleep {
        const sleep: Sleep = {...this.ctx.entity}
        sleep.startAt = this.dtt.datetimeUIToUtc(this.sleepForm.value.startDate, this.sleepForm.value.startTime)
        sleep.endAt = this.dtt.datetimeUIToUtc(this.sleepForm.value.endDate, this.sleepForm.value.endTime)
        sleep.babyId = this.ctx.baby.id
        return sleep
    }
}
