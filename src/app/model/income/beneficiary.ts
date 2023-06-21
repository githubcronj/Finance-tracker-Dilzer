import { Attachment } from '../asset/attachment/attachment';
import { JsonObject, JsonProperty } from "../parsers/json-convert-decorators";
import { JsonConvert } from '../../model/parsers/json-convert';
import { DatePipe } from '@angular/common';
import { CommittedSavingFrequencyType, CommittedSavingFrequencyTypeUtils } from '../enum/asset/committed-saving-frequency.enum';
import { FormatterService } from 'app/services/formatter.service';



@JsonObject
export class Beneficiary {

    @JsonProperty("owner", String) owner: string = undefined
    @JsonProperty("startDate", Date) startDate: Date = undefined
    @JsonProperty("endDate", Date) endDate: Date = undefined
    @JsonProperty("amount", Number) amount: number = undefined
    @JsonProperty("frequency", Number) frequency: number = undefined
    @JsonProperty("growthRate", Number) growthRate: number = undefined
 
    isSelected = false;
    formatter = new FormatterService()
   
    constructor() {

    }

    displayStartDate() {
        if (this.startDate != null) {
            const datePipe = new DatePipe('en-US');
            return datePipe.transform(this.startDate, 'dd/MM/yyyy');
        }
    }

    displayEndDate() {
        if (this.endDate != null) {
            const datePipe = new DatePipe('en-US');
            return datePipe.transform(this.endDate, 'dd/MM/yyyy');
        }
    }

    frequencyDisplayString() {
        return CommittedSavingFrequencyTypeUtils.getCommittedSavingFrequencyTypeText(this.frequency)
    }

    displayBeneficiaryDetails() {

        let beneficiaryDetails = '';

        if (this.owner != null && this.amount != null && this.growthRate != null && this.startDate != null && this.endDate != null) {
           beneficiaryDetails += '<small>' + 'Owner: ' + '</small>' + this.owner + '<br/>' + '<small>' + 'Amount:' + '</small>' + '&#8377;'+ this.displayCurrencyString(this.amount) + '<br/>' + '<small>' + 'Growth Rate: ' + '</small>' + this.growthRate + ' %' + '<br/>' + '<small>' + 'Start Date: ' + '</small>' + this.displayStartDate() + '<br/>' + '<small>' + 'End Date: ' + '</small>' + this.displayEndDate() + '<br/>'
        } else {
            return '-'
        }

        return beneficiaryDetails
    }

    displayCurrencyString(amount) {
   
      return this.formatter.currencyFormatter(amount);
   
     }

}
