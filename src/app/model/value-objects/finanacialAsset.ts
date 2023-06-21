import { JsonObject, JsonProperty } from '../parsers/json-convert-decorators';

@JsonObject
export class FinancialAsset {

    @JsonProperty('assetType', Number) assetType: number = undefined;
    @JsonProperty('description', String) description: string = undefined;
}