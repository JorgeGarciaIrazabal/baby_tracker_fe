import {Component, Inject, OnInit} from "@angular/core"
import {Baby, Parent} from "../../openapi/models"
import {MAT_DIALOG_DATA, MatDialogRef} from "@angular/material/dialog"
import {Storage} from "@ionic/storage"

@Component({
    selector: "app-baby-dialog",
    templateUrl: "./baby-dialog.component.html",
    styleUrls: ["./baby-dialog.component.scss"],
})
export class BabyDialogComponent implements OnInit {
    public baby: Baby
    private parent: Parent

    constructor(
        public dialogRef: MatDialogRef<BabyDialogComponent>,
        @Inject(MAT_DIALOG_DATA) public data: Baby,
        private storage: Storage,
    ) {
        this.baby = new class implements Baby {
            birthDate: Date = new Date()
            id: number
            name: string
            parentIds: Array<number> = []
        }
    }

    onCancel(): void {
        this.dialogRef.close()
    }

    async ngOnInit() {
        await this.storage.ready()
        this.parent = await this.storage.get("self")
        this.baby.parentIds = [this.parent.id]
    }
}
