import { Asset } from './asset';
import { EPFAssetSubTypeUtils } from '../enum/asset/epf-sub-type.enum';
import { AssetType } from '../enum/asset/asset-type.enum'
import { JsonObject, JsonProperty } from "../parsers/json-convert-decorators";

@JsonObject
export class EPF extends Asset {

    constructor() {
        super()
        this.kind = String(AssetType.EPF)
    }

    subTypesOptions(){
        return EPFAssetSubTypeUtils.getAllAssetSubType()
    }
}