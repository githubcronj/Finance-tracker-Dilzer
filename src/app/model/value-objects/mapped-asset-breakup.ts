import { JsonObject, JsonProperty } from '../parsers/json-convert-decorators';


@JsonObject
export class MappedAssetBreakup {

    @JsonProperty('date', Date) date: Date = undefined;
    @JsonProperty('rate', Number) rate: number = undefined;
    @JsonProperty('months', Number) months: number = undefined;
    @JsonProperty('openingBalance', Number) openingBalance: number = undefined;
    @JsonProperty('contribution', Number) contribution: number = undefined;
    @JsonProperty('closingBalanace', Number) closingBalanace: number = undefined;


    constructor() {

    }

}
