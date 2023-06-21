import { Asset } from './asset';
import { MutualFundsAssetSubtypeTypeUtils } from '../enum/asset/mutual-funds-sub-type.enum';
import { AssetType } from '../enum/asset/asset-type.enum'
import { JsonObject, JsonProperty } from "../parsers/json-convert-decorators";

@JsonObject
export class MutualFunds extends Asset {

    constructor() {
        super()
        this.kind = String(AssetType.MutualFunds)
    }

    subTypesOptions(){
        return MutualFundsAssetSubtypeTypeUtils.getAllAssetSubType()
    }
}