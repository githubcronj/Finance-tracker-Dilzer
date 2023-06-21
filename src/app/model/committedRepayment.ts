import { JsonObject, JsonProperty } from "./parsers/json-convert-decorators";
import { JsonConvert } from '../model/parsers/json-convert';
import { CommittedSavingFrequencyType, CommittedSavingFrequencyTypeUtils } from './enum/asset/committed-saving-frequency.enum'
import { EventDate } from './value-objects/eventDate';
import { CommittedPayment } from './committedPayment';



@JsonObject
export class CommittedRepayment extends CommittedPayment {

    @JsonProperty("outstandingAmountAfterPayment", Number) outstandingAmountAfterPayment: number = undefined
    @JsonProperty("interestPayableAfterPayment", Number) interestPayableAfterPayment: number = undefined
    @JsonProperty("savingsAfterRepayment", Number) savingsAfterRepayment: number = undefined
    @JsonProperty("mutualFundROR", Number) mutualFundROR: number = undefined
    @JsonProperty("mutualFundFutureValue", Number) mutualFundFutureValue: number = undefined
    @JsonProperty("mutualFundNetGain", Number) mutualFundNetGain: number = undefined



    displaySavingsAfterRepayments() {
        if (this.savingsAfterRepayment != null) {
            return `₹ ${this.displayCurrencyString(this.savingsAfterRepayment)} of interest will be saved after lumpsum repayment`
        }
    }

    displaymutualFundNetGain() {
        if (this.mutualFundNetGain != null) {
            return `₹ ${this.displayCurrencyString(this.mutualFundNetGain)} will be the Net savings by doing prepayment instead of investing the amount`
        }
    }
}