import { Asset } from './asset';
import { PPFAssetSubtypeTypeUtils } from '../enum/asset/ppf-sub-type.enum';
import { AssetType } from '../enum/asset/asset-type.enum'
import { JsonObject, JsonProperty } from "../parsers/json-convert-decorators";

@JsonObject
export class PPF extends Asset {

    constructor() {
        super()
        this.kind = String(AssetType.PPF)
    }

    subTypesOptions(){
        return PPFAssetSubtypeTypeUtils.getAllAssetSubType()
    }
}