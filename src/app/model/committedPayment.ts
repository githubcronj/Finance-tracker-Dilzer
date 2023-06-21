import { JsonObject, JsonProperty } from "./parsers/json-convert-decorators";
import { JsonConvert } from '../model/parsers/json-convert';
import { CommittedSavingFrequencyType, CommittedSavingFrequencyTypeUtils } from './enum/asset/committed-saving-frequency.enum'
import { TimeRange } from './timeRange';
import { FormatterService } from 'app/services/formatter.service';


@JsonObject
export class CommittedPayment extends TimeRange {

    formatter = new FormatterService()

    @JsonProperty("_id", String) _id: string = undefined
    @JsonProperty("incrementalRate", Number) incrementalRate: number = undefined
    @JsonProperty("excludeFromCashFlow", Boolean) excludeFromCashFlow: boolean = undefined
    @JsonProperty("name", String) name: string = undefined
    @JsonProperty("amount", Number) amount: number = undefined
    @JsonProperty("absoluteAmount", Number) absoluteAmount: number = undefined
    @JsonProperty("kind", String) kind: string = undefined
    @JsonProperty("frequency", Number) frequency: number = undefined


    frequencyDisplayString() {
        return CommittedSavingFrequencyTypeUtils.getCommittedSavingFrequencyTypeText(this.frequency)
    }

    displayCurrencyString(amount) {

        return this.formatter.currencyFormatter(amount);

    }

    displayAmountInPerAnnum(amount, frequency) {
        let payment = 0;
        if (frequency == CommittedSavingFrequencyType.HalfYearly) {
            payment = (amount * 2)
        } else if (frequency == CommittedSavingFrequencyType.Quarterly) {
            payment = (amount * 4)
        } else if (frequency == CommittedSavingFrequencyType.Monthly) {
            payment = (amount * 12)
        } else {
            payment = amount
        }
        return payment
    }

}