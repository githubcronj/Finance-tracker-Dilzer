import { Asset } from './asset';
import { RealEstateAssetSubtypeTypeUtils } from '../enum/asset/real-estate-sub-type.enum';
import { AssetType } from '../enum/asset/asset-type.enum'
import { JsonObject, JsonProperty } from "../parsers/json-convert-decorators";

@JsonObject
export class RealEstate extends Asset {

    constructor() {
        super()
        this.kind = String(AssetType.RealEstate)
    }

    subTypesOptions(){
        return RealEstateAssetSubtypeTypeUtils.getAllAssetSubType()
    }
}
