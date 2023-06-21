import { Asset } from './asset';
import { OtherGovernmentSchemeAssetSubtypeTypeUtils } from '../enum/asset/other-government-scheme-sub-type.enum';
import { AssetType } from '../enum/asset/asset-type.enum'
import { JsonObject, JsonProperty } from "../parsers/json-convert-decorators";


@JsonObject
export class OtherGovernmentSchemes extends Asset {

    constructor() {
        super()
        this.kind = String(AssetType.OtherGovernmentSchemes)
    }

    subTypesOptions(){
        return OtherGovernmentSchemeAssetSubtypeTypeUtils.getAllAssetSubType()
    }
}