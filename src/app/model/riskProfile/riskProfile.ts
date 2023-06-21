import { JsonObject, JsonProperty } from '../parsers/json-convert-decorators';
import { JsonConvert } from '../../model/parsers/json-convert';


@JsonObject
export class RiskProfile {

    @JsonProperty('_id', String) _id: string = undefined
    @JsonProperty('displayName', String) displayName: string = undefined
    @JsonProperty('name', String) name: string = undefined
    @JsonProperty('rate', Number) rate: number = undefined

}
