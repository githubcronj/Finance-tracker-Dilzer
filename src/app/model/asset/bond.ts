import { Asset } from './asset';
import { BondAssetSubTypeUtils } from '../enum/asset/bond-sub-type.enum'
import { AssetType } from '../enum/asset/asset-type.enum'
import { JsonObject, JsonProperty } from "../parsers/json-convert-decorators";

@JsonObject
export class Bond extends Asset {


    constructor() {
        super()
        this.kind = String(AssetType.Bond)
    }

    subTypesOptions() {
        return BondAssetSubTypeUtils.getAllAssetSubType()
    }

}