import {Injectable} from "@angular/core"
// @ts-ignore
import moment from "moment"
import humanizeDuration from "humanize-duration"

@Injectable({
    providedIn: "root"
})
export class DatetimeToolsService {

    constructor() {
    }

    datetimeUIToUtc(date: Date, time: string): Date {
        let hour = parseInt(time.split(" ")[0].split(":")[0], 10)
        const mode = time.split(" ")[1]
        if (hour !== 12) {
            hour = mode === "PM" ? 12 + hour : hour
        } else {
            hour = mode === "AM" ? 0 : 12
        }

        const min = parseInt(time.split(" ")[0].split(":")[1], 10)
        const momentDate = moment(date)
        momentDate.hours(hour)
        momentDate.minutes(min)
        return momentDate.utc().toDate()
    }

    datetimeToStrTime(date: Date): string {
        const momentDate = moment(date)
        return momentDate.format("hh:mm a").toUpperCase()
    }

    dateDiffMinutes(entity): number {
        if (entity.endAt == null) {
            return 0
        }
        // @ts-ignore
        const diffMs: number = (entity.endAt - entity.startAt) // milliseconds
        return Math.floor(diffMs / 60000)
    }

    dateToUtc(date) {
        return moment(date).utc().toDate()
    }

    humanizeDateTime(date) {
        return moment(date).format("MMM Do hh:mm A")
    }

    humanizeTime(date) {
        return moment(date).format("hh:mm A")
    }

    humanizeDate(date) {
        return moment(date).format("dddd, MMM Do")
    }

    humanizeDuration(startAt: Date, endAt: Date = null): string {
        endAt = endAt || new Date()
        return humanizeDuration(
            moment(startAt).diff(moment(endAt)),
            {units: ["d", "h", "m"], maxDecimalPoints: 0},
        )
    }

    humanizeDiffMinutes(entity: any) {
        return moment.duration(moment(entity.endAt).diff(moment(entity.startAt))).asMinutes()
    }
}
