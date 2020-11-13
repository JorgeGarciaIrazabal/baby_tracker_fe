import {Component, Input, OnInit} from "@angular/core"
import {Baby, Feed, FeedTypes, Parent} from "../../openapi/models"
import {ApiService} from "../api.service"
import {MatDialog} from "@angular/material/dialog"
import {ToastController} from "@ionic/angular"
import {DatetimeToolsService} from "../datetime-tools.service"
// @ts-ignore
import moment from "moment"

@Component({
    selector: "app-track-feed",
    templateUrl: "./track-feed.component.html",
    styleUrls: ["./track-feed.component.scss"],
})
export class TrackFeedComponent implements OnInit {

    @Input() parent: Parent
    @Input() baby: Baby
    public feeds: Array<Feed>
    public editingFeed: number = null
    public self = this

    constructor(private apiService: ApiService, public dialog: MatDialog,
                public toastCtrl: ToastController, public dtt: DatetimeToolsService) {
    }

    async ngOnInit() {
        await this.refreshFeedings()
    }

    clearEditingFeed = () => {
        this.editingFeed = null
        this.feeds = this.feeds.filter((feed) => {
            return feed.id !== -1
        })
    }

    getLastFeedingTime() {
        if (this.feeds && this.feeds.length > 0) {
            return `Last feeding ${moment(this.feeds[0].startAt).fromNow()}`
        }
        return "touch the + button to add feedings"
    }

    async feedEvent(feed) {
        if (feed.id === -1) {
            await this.createFeed(feed)
        } else {
            await this.updateFeed(feed)
        }
        await this.refreshFeedings()
        this.editingFeed = null
    }

    async createFeed(feed) {
        try {
            delete feed.id
            if (feed.endAt === null) {
                delete feed.endAt
            }
            await this.apiService.api.createFeedFeedPost({feed})
        } catch (e) {
            await (await this.toastCtrl.create({
                message: "failed creating feed",
                duration: 1
            })).present()
        }
    }

    async updateFeed(feed) {
        try {
            await this.apiService.api.updateFeedFeedPut({feed})
        } catch (e) {
            await (await this.toastCtrl.create({
                message: "failed updating feed",
                duration: 1
            })).present()
        }
    }

    addEmptyFeed() {
        const baby = this.baby
        // tslint:disable-next-line:new-parens
        const newFeed = new class implements Feed {
            amount = null
            babyId: number = baby.id
            endAt: Date = null
            id = -1
            startAt: Date = new Date()
            type: FeedTypes = FeedTypes.NUMBER_1
        }
        this.feeds = [
            newFeed,
            ...this.feeds
        ]
        this.editingFeed = -1
    }

    async endFeeding(feed: Feed) {
        feed.endAt = this.dtt.dateToUtc(new Date())
        await this.apiService.api.updateFeedFeedPut({feed})
        await this.refreshFeedings()
        this.editingFeed = null
    }

    async refreshFeedings() {
        const feeds = await this.apiService.api.getBabyFeedsBabyBabyIdFeedGet({babyId: this.baby.id})
        this.feeds = feeds.sort((f1, f2) => {
            return f1.startAt < f2.startAt ? 1 : -1
        })
    }


    async onRemove(feed: Feed) {
        await this.apiService.api.deleteFeedFeedIdDelete({id: feed.id})
        await this.refreshFeedings()
        this.editingFeed = null
    }
}
