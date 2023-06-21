import { JsonObject, JsonProperty } from '../parsers/json-convert-decorators';
import { MappedAssetBreakup } from '../value-objects/mapped-asset-breakup';


@JsonObject
export class MappedAsset {

    @JsonProperty('_id', String) _id: string = undefined;
    @JsonProperty('breakup', [MappedAssetBreakup]) breakup: Array<MappedAssetBreakup> = [];


    constructor() {

    }

}
