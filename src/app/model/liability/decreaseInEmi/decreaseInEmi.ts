import { JsonObject, JsonProperty } from "../../parsers/json-convert-decorators";
import { JsonConvert } from '../../../model/parsers/json-convert';

@JsonObject
export class DecreaseInEmi {

    @JsonProperty("_id", String) _id: string = undefined
    @JsonProperty("decreasePercentage", Number) decreasePercentage: number = undefined 
    @JsonProperty("emiPaidAfterRevision", Number) emiPaidAfterRevision: number = undefined
    @JsonProperty("revisedRate", Number) revisedRate: number = undefined
    @JsonProperty("numberOfRepaymentsPayableAfterRevision", Number) numberOfRepaymentsPayableAfterRevision: number = undefined
    @JsonProperty("remainingInterestPayableAfterRevision", Number) remainingInterestPayableAfterRevision: number = undefined
    @JsonProperty("additionalInterestPayableAfterRevision", Number) additionalInterestPayableAfterRevision: number = undefined

}