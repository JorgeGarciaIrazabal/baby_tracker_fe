import {Component, Input, OnChanges, OnInit} from "@angular/core"
import {FormBuilder, Validators} from "@angular/forms"
import {Baby, Pee, Poop} from "../../openapi/models"
import {DatetimeToolsService} from "../datetime-tools.service"
import {UnitUtilsService} from "../unit-utils.service"


type Entity = Pee | Poop

export interface EntityFromCtx {
    entity: Pee | Poop
    onCancel: () => void
    onRemove: (entity: Entity) => void
    onOk: (entity: Entity) => void
    baby: Baby
}

@Component({
    selector: "app-simple-generic-form",
    styleUrls: ["../track-base/track-base.component.scss"],
    template: `
        <form [formGroup]="entityForm">
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
                </mat-card-content>

                <mat-card-actions class="ion-padding-start">
                    <div class="simple-row">
                        <span class="spacer"></span>
                        <button mat-raised-button (click)="ctx.onCancel()">Cancel</button>
                        <button
                            mat-raised-button
                            color="primary"
                            [disabled]="entityForm.status==='INVALID'"
                            (click)="myOnOk()">
                            Ok
                        </button>
                    </div>
                </mat-card-actions>
            </mat-card>
        </form>
    `,
})
export class SimpleGenericFormComponent implements OnInit, OnChanges {
    @Input() public ctx: EntityFromCtx

    entityForm = this.fb.group({
        atDate: [null, Validators.required],
        atTime: [null, Validators.required],
    })

    constructor(private fb: FormBuilder, public dtt: DatetimeToolsService, public uu: UnitUtilsService) {
    }

    ngOnChanges(changes): void {
        if (changes.ctx?.currentValue?.entity) {
            this.setEntityInForm(changes.ctx.currentValue.entity)
        }
    }

    ngOnInit() {
    }

    myOnRemove() {
        return this.ctx.onRemove(this.entityFromForm())
    }

    myOnOk() {
        return this.ctx.onOk(this.entityFromForm())
    }

    private setEntityInForm(entity: Entity) {
        this.entityForm.setValue({
            atDate: entity.at,
            atTime: this.dtt.datetimeToStrTime(entity.at),
        })
    }

    private entityFromForm(): Entity {
        const entity: Entity = {...this.ctx.entity}
        entity.at = this.dtt.datetimeUIToUtc(this.entityForm.value.atDate, this.entityForm.value.atTime)
        entity.babyId = this.ctx.baby.id
        return entity
    }
}
