import {Injectable} from "@angular/core"
import {Growth, GrowthTypes} from "../openapi/models"

@Injectable({
    providedIn: "root"
})
export class UnitUtilsService {

    constructor() {
    }

    getGrowthShortUnit(growth: Growth) {
        return this.getShortUnitFromGrowthType(growth.type)
    }

    getShortUnitFromGrowthType(growthType: GrowthTypes) {
        switch (growthType) {
            case GrowthTypes.HEAD:
            case GrowthTypes.HEIGHT:
                return "cm"
            case GrowthTypes.WEIGHT:
                return "g"
        }
        return "~"
    }
}
