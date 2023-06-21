import { Asset } from './asset';
import { NPSAssetSubtypeTypeUtils } from '../enum/asset/nps-sub-type.enum';
import { AssetType } from '../enum/asset/asset-type.enum'
import { JsonObject, JsonProperty } from "../parsers/json-convert-decorators";

@JsonObject
export class NPS extends Asset {

    constructor() {
        super()
        this.kind = String(AssetType.NPS)
    }

    subTypesOptions(){
        return NPSAssetSubtypeTypeUtils.getAllAssetSubType()
    }
}