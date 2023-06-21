import { JsonObject, JsonProperty } from "../../parsers/json-convert-decorators";
import { JsonConvert } from '../../../model/parsers/json-convert';
import { AssetTypeUtils } from '../../../model/enum/asset/asset-type.enum';
import { RateOptionsType } from '../../enum/rate-options.enum'

@JsonObject
export class AssetAllocation {

    @JsonProperty("_id", String) _id: string = undefined
    @JsonProperty("rate", Number) rate: number = undefined
    @JsonProperty("doNotInclude", Boolean) doNotInclude: boolean = undefined
    @JsonProperty("displayString", String) displayString: string = undefined
    @JsonProperty("allocationType", Number) allocationType: number = undefined


    description(kind) {
        if (this.doNotInclude) {
            return "Not Included";
        } else {
            if (this.allocationType == RateOptionsType.SetByAssetClass) {
                let displayString = AssetTypeUtils.getAssetSubTypeName(kind, this.displayString)
                return `${displayString} @ ${this.rate}%`
            } else {
                if (this.displayString) {
                    return `${this.displayString} @  ${this.rate}%`;
                } else {
                    `${this.rate} %`;
                }
            }
        }
    }

}
