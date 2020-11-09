import {Component, Input, OnInit} from '@angular/core';
import {Baby, Feed, FeedTypes} from "../../openapi/models";
import {FormBuilder, Validators} from "@angular/forms";
// @ts-ignore
import moment from 'moment';
import {DatetimeToolsService} from "../datetime-tools.service";

@Component({
  selector: 'app-feed-dialog',
  templateUrl: './feed-dialog.component.html',
  styleUrls: ['./feed-dialog.component.scss'],
})
export class FeedDialogComponent implements OnInit {
  @Input() public feed: Feed
  @Input() public onCancel: Function
  @Input() public onRemove: Function
  @Input() public onOk: Function
  @Input() public baby: Baby

  feedForm = this.fb.group({
    startDate: [null, Validators.required],
    startTime: [null, Validators.required],
    endDate: [null],
    endTime: [null],
    amount: [null, Validators.required],
  });

  constructor(private fb: FormBuilder, private dtt: DatetimeToolsService) {
  }

  ngOnInit() {
    if (this.feed !== null) {
      let startAt = moment.utc(this.feed.startAt).toDate()
      let endAt = this.feed.endAt ? moment.utc(this.feed.endAt).toDate() : null
      this.feedForm.setValue({
        startDate: startAt,
        startTime: this.dtt.datetimeToStrTime(startAt),
        endDate: endAt ? endAt : null,
        endTime: endAt ? this.dtt.datetimeToStrTime(endAt) : null,
        amount: this.feed.amount,
      })
    }
  }

  onSubmit() {
    this.feed.amount = this.feedForm.value.amount
    this.feed.startAt = this.dtt.datetimeUIToUtc(this.feedForm.value.startDate, this.feedForm.value.startTime)
    if (this.feedForm.value.endDate !== null) {
      this.feed.endAt = this.dtt.datetimeUIToUtc(this.feedForm.value.endDate, this.feedForm.value.endTime)
    }

    // this.feed.babyId = this.baby.id
    this.feed.type = FeedTypes.NUMBER_1
    this.onOk(this.feed)
  }

  onRemoveClicked() {
    this.onRemove(this.feed)
  }
}
