import {Component, Input, OnChanges, OnInit} from "@angular/core"
import {FormBuilder, Validators} from "@angular/forms"
import {Baby, Growth, GrowthTypes} from "../../openapi/models"
import {DatetimeToolsService} from "../datetime-tools.service"
import {UnitUtilsService} from "../unit-utils.service"

export interface GrowthCtx {
    entity: Growth
    onCancel: () => void
    onRemove: (growth: Growth) => void
    onOk: (growth: Growth) => void
    baby: Baby
}

@Component({
    selector: "app-growth-form",
    styleUrls: ["../track-base/track-base.component.scss"],
    template: `
        <form [formGroup]="growthForm">
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
                                <input formControlName="atDate" matInput [matDatepicker]="atDatePicker">
                                <mat-datepicker-toggle matSuffix [for]="atDatePicker"></mat-datepicker-toggle>
                                <mat-datepicker touchUi #atDatePicker></mat-datepicker>
                            </mat-form-field>
                        </div>
                        <div class="col">
                            <mat-form-field class="edit-input">
                                <mat-label>Time</mat-label>
                                <input matInput formControlName="atTime" [ngxTimepicker]="atTimePicker"
                                       readonly>
                                <ngx-material-timepicker #atTimePicker></ngx-material-timepicker>
                            </mat-form-field>
                        </div>
                        <span class="spacer"></span>
                    </div>
                    <div class="simple-row">
                        <div class="col">
                            <mat-form-field class="edit-input">
                                <mat-label>
                                    Measure ({{uu.getShortUnitFromGrowthType(growthForm.value.type)}})
                                </mat-label>
                                <input class="edit-input" formControlName="measure" type="number" matInput>
                            </mat-form-field>
                        </div>
                        <div class="col">
                            <mat-form-field class="edit-input">
                                <mat-label>Type</mat-label>
                                <mat-select formControlName="type">
                                    <mat-option *ngFor="let option of growthTypesKeys" [value]="growthTypes[option]">
                                        {{option}}
                                    </mat-option>
                                </mat-select>
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
                            [disabled]="growthForm.status==='INVALID'"
                            (click)="myOnOk()">
                            Ok
                        </button>
                    </div>
                </mat-card-actions>
            </mat-card>
        </form>
    `,
})
export class GrowthFormComponent implements OnInit, OnChanges {
    @Input() public ctx: GrowthCtx

    growthForm = this.fb.group({
        atDate: [null, Validators.required],
        atTime: [null, Validators.required],
        measure: [null, Validators.required],
        type: [null, Validators.required],
    })
    public growthTypes = GrowthTypes
    public growthTypesKeys

    constructor(private fb: FormBuilder, public dtt: DatetimeToolsService, public uu: UnitUtilsService) {
        this.growthTypesKeys = Object.keys(this.growthTypes)
    }

    ngOnChanges(changes): void {
        if (changes.ctx?.currentValue?.entity) {
            this.setGrowthInForm(changes.ctx.currentValue.entity)
        }
    }

    ngOnInit() {
    }

    myOnRemove() {
        return this.ctx.onRemove(this.growthFromForm())
    }

    myOnOk() {
        return this.ctx.onOk(this.growthFromForm())
    }

    private setGrowthInForm(growth: Growth) {
        this.growthForm.setValue({
            atDate: growth.at,
            atTime: this.dtt.datetimeToStrTime(growth.at),
            measure: growth.measure,
            type: growth.type,
        })
    }

    private growthFromForm(): Growth {
        const growth: Growth = {at: undefined, babyId: 0, id: 0, measure: 0, type: GrowthTypes.HEIGHT}
        growth.measure = this.growthForm.value.measure
        growth.at = this.dtt.datetimeUIToUtc(this.growthForm.value.atDate, this.growthForm.value.atTime)
        growth.babyId = this.ctx.baby.id
        growth.type = this.growthForm.value.type
        return growth
    }
}
