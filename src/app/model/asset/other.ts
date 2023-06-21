import { Asset } from './asset';
import { OtherAssetSubTypeUtils } from '../enum/asset/other-sub-type.enum';
import { AssetType } from '../enum/asset/asset-type.enum'
import { JsonObject, JsonProperty } from "../parsers/json-convert-decorators";

@JsonObject
export class Other extends Asset {

    constructor() {
        super()
        this.kind = String(AssetType.Other)
    }

    subTypesOptions() {
        return OtherAssetSubTypeUtils.getAllAssetSubType()
    }
}