import { Asset } from './asset';
import { BusinessAssetSubTypeUtils } from '../enum/asset/business-sub-type.enum'
import { AssetType } from '../enum/asset/asset-type.enum'
import { JsonObject, JsonProperty } from "../parsers/json-convert-decorators";

@JsonObject
export class Business extends Asset {


    constructor() {
        super()
        this.kind = String(AssetType.Business)
    }

    subTypesOptions() {
        return BusinessAssetSubTypeUtils.getAllAssetSubType()
    }

}