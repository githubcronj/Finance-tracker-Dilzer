import { JsonObject, JsonProperty } from "../../parsers/json-convert-decorators";
import { JsonConvert } from '../../../model/parsers/json-convert';
import { DatePipe } from '@angular/common';

@JsonObject
export class LoanStage {

    @JsonProperty("_id", String) _id: string = undefined
    @JsonProperty("date", Date) date: Date = undefined 
    @JsonProperty("outStandingAmount", Number) outStandingAmount: number = undefined
    @JsonProperty("emiPaid", Number) emiPaid: number = undefined
    @JsonProperty("numberOfRepaymentsPaid", Number) numberOfRepaymentsPaid: number = undefined
    @JsonProperty("numberOfRepaymentsPayable", Number) numberOfRepaymentsPayable: number = undefined
    @JsonProperty("remainingInterestPayable", Number) remainingInterestPayable: number = undefined
    @JsonProperty("remainingPrincipalPayable", Number) remainingPrincipalPayable: number = undefined


    displayDate() {
        if (this.date != null) {
            const datePipe = new DatePipe('en-US');
            return datePipe.transform(this.date, 'dd/MM/yyyy');
        }
    }

}