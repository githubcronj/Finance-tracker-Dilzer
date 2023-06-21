import { JsonObject, JsonProperty } from '../parsers/json-convert-decorators';

@JsonObject
export class Reference {

    @JsonProperty('referenceType', Number) referenceType: Number = undefined;
    @JsonProperty('description', String) description: string = undefined;
}