import { JsonObject, JsonProperty } from "../parsers/json-convert-decorators";
import { FormatterService } from 'app/services/formatter.service';

@JsonObject
export class SurvivalBenefit {

    @JsonProperty("_id", String) _id: string = undefined    
    @JsonProperty("amount", Number) amount: number = undefined
    @JsonProperty("startDate", Date) startDate: Date = undefined

    formatter = new FormatterService()

    displayCurrencyString(amount) {

        return this.formatter.currencyFormatter(amount);
     
       }
}