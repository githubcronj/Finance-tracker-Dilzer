import { JsonObject, JsonProperty } from "../parsers/json-convert-decorators";
import { JsonConvert } from '../../model/parsers/json-convert';


@JsonObject
export class Allocation {

    @JsonProperty("_id", String) _id: string = undefined
    @JsonProperty("assetId", String) assetId: string = undefined
    @JsonProperty("amount", String) amount: number = undefined
    
}