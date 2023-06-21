
import { JsonObject, JsonProperty } from "./parsers/json-convert-decorators";
import { JsonConvert } from '../model/parsers/json-convert';
import { DatePipe } from '@angular/common';
import { RateOptionsType } from '../model/enum/rate-options.enum'
import { AssetTypeUtils } from './enum/asset/asset-type.enum';

@JsonObject
export class RateOfReturn {

    @JsonProperty("_id", String) _id: string = undefined
    @JsonProperty("fromDate", Date) fromDate: Date = undefined
    @JsonProperty("rate", Number) rate: number = undefined
    @JsonProperty("displayString", String) displayString: string = undefined
    @JsonProperty("assetType", String) assetType: string = undefined
    @JsonProperty("rateOfReturnType", Number) rateOfReturnType: number = undefined


    description() {
        const datePipe = new DatePipe('en-US');
        let fromDateString = datePipe.transform(this.fromDate, 'dd/MM/yyyy');
        if (this.rateOfReturnType == RateOptionsType.SetByAssetClass) {
            let displayString = AssetTypeUtils.getAssetSubTypeName(this.assetType, this.displayString)
            return `${displayString} @ ${this.rate}%`
        } else {
            if (this.displayString == null) {
                return `@ ${this.rate}% per annum`
            } else {
                return `${this.displayString} @ ${this.rate}%`
            }
        }
    }


    isDisabled() {

        if (this.rateOfReturnType == RateOptionsType.SetManually) {
            return false
        } else {
            return true

        }

    }

    displayFromDate() {

        const datePipe = new DatePipe('en-US');
        return datePipe.transform(this.fromDate, 'dd/MM/yyyy');

    }


}